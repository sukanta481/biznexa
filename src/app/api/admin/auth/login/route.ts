import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, remember } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const result = await authenticateAdmin(username.trim(), password);

    if (!result) {
      return NextResponse.json({ error: "Invalid credentials or account is inactive." }, { status: 401 });
    }

    await setSessionCookie(result.token, result.user.id, remember === true);

    return NextResponse.json({
      ok: true,
      user: result.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
