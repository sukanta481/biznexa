import { getActiveDatabaseLabel, pingDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await pingDatabase();

    return Response.json({
      ok: true,
      ...getActiveDatabaseLabel(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";

    return Response.json(
      {
        ok: false,
        ...getActiveDatabaseLabel(),
        error: message,
      },
      { status: 500 },
    );
  }
}
