import "server-only";

import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { query } from "@/lib/db";
import {
  deleteFile,
  DriveError,
  ensureChildFolder,
  folderUrl,
  getAccessToken,
  inspectionFolderName,
  MAX_UPLOAD_BYTES,
  uploadFile,
} from "@/lib/google-drive";

export const runtime = "nodejs";

interface FileRow extends RowDataPacket {
  id: number;
  file_number: string;
  customer_name: string | null;
  drive_folder_id: string | null;
}

/**
 * Uploads one document into the inspection file's Google Drive folder,
 * creating the folder on the first upload. The client sends files one at a
 * time, so each request stays small and a failure affects only that file.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { id: idParam } = await params;
  const fileId = Number(idParam);
  if (!Number.isInteger(fileId) || fileId <= 0) {
    return NextResponse.json({ error: "Invalid file ID." }, { status: 400 });
  }

  const [row] = await query<FileRow[]>(
    "SELECT id, file_number, customer_name, drive_folder_id FROM inspection_files WHERE id = ? LIMIT 1",
    [fileId],
  );
  if (!row) return NextResponse.json({ error: "Inspection file not found." }, { status: 404 });

  const form = await request.formData().catch(() => null);
  const upload = form?.get("file");
  if (!(upload instanceof File) || upload.size === 0) {
    return NextResponse.json({ error: "No file was sent." }, { status: 400 });
  }
  if (upload.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `"${upload.name}" is larger than ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` },
      { status: 413 },
    );
  }

  try {
    const accessToken = await getAccessToken();
    const folder = await ensureChildFolder(
      row.drive_folder_id,
      inspectionFolderName(row.file_number, row.customer_name),
      accessToken,
      admin.id,
    );

    let folderId = folder.id;
    if (folder.created) {
      // Only claim the column if it still holds what we read. If a parallel
      // upload got there first, use its folder and discard ours, so one
      // inspection file never ends up split across two folders.
      const claim = await query<ResultSetHeader>(
        "UPDATE inspection_files SET drive_folder_id = ? WHERE id = ? AND drive_folder_id <=> ?",
        [folder.id, fileId, row.drive_folder_id],
      );
      if (claim.affectedRows === 0) {
        const [latest] = await query<FileRow[]>(
          "SELECT drive_folder_id FROM inspection_files WHERE id = ? LIMIT 1",
          [fileId],
        );
        if (latest?.drive_folder_id) {
          await deleteFile(folder.id, accessToken);
          folderId = latest.drive_folder_id;
        }
      }
    }

    const uploaded = await uploadFile(
      folderId,
      {
        name: upload.name.slice(0, 255) || "document",
        mimeType: upload.type || "application/octet-stream",
        data: await upload.arrayBuffer(),
      },
      accessToken,
    );

    return NextResponse.json({ file: uploaded, folderId, folderUrl: folderUrl(folderId) }, { status: 201 });
  } catch (error) {
    if (error instanceof DriveError) {
      const status = error.status === 409 || error.reconnect ? 409 : 502;
      return NextResponse.json({ error: error.message, reconnect: error.reconnect }, { status });
    }
    console.error("Inspection document upload failed", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
