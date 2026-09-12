/**
 * Browser-safe Google Drive link helpers. Kept apart from google-drive.ts,
 * which is server-only because it handles OAuth tokens.
 */

export function driveFolderUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${encodeURIComponent(folderId)}`;
}
