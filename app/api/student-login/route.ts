import { NextResponse } from "next/server";
import { setStudentSession, type StudentSession } from "@/lib/studentSession";
import { readCredentials, comparePin } from "@/lib/studentCredentials";

export async function POST(request: Request) {
  let body: { username?: unknown; pin?: unknown };
  try {
    body = (await request.json()) as { username?: unknown; pin?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const username =
    typeof body.username === "string" ? body.username.trim() : "";
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";

  if (!username || !pin) {
    return NextResponse.json(
      { success: false, error: "Username and PIN are required." },
      { status: 400 },
    );
  }

  let credentials;
  try {
    credentials = await readCredentials(username);
  } catch (err) {
    console.error("/api/student-login: KV read failed", err);
    return NextResponse.json(
      {
        success: false,
        error: "Login service is unavailable. Please try again shortly.",
      },
      { status: 502 },
    );
  }

  if (!credentials) {
    return NextResponse.json(
      { success: false, error: "Username or PIN is incorrect" },
      { status: 401 },
    );
  }

  const pinMatch = await comparePin(pin, credentials.pin_hash);
  if (!pinMatch) {
    return NextResponse.json(
      { success: false, error: "Username or PIN is incorrect" },
      { status: 401 },
    );
  }

  const session: StudentSession = {
    id: credentials.id,
    first_name: credentials.first_name,
    last_name: credentials.last_name,
    username: credentials.username,
    level: credentials.level,
    parent_member_id: credentials.parent_member_id,
  };

  const response = NextResponse.json({ success: true, student: session });
  setStudentSession(response, session);
  return response;
}
