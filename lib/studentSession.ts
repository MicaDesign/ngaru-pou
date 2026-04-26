import "server-only";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { STUDENT_SESSION_COOKIE } from "./studentSessionConstants";

export { STUDENT_SESSION_COOKIE };

const MAX_AGE_SECONDS = 8 * 60 * 60;

export type StudentSession = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  level: string;
  parent_member_id: string;
};

function encode(session: StudentSession): string {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decode(value: string | undefined): StudentSession | null {
  if (!value) return null;
  try {
    const json = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<StudentSession>;
    if (!parsed?.id || typeof parsed.id !== "string") return null;
    return {
      id: parsed.id,
      first_name: parsed.first_name ?? "",
      last_name: parsed.last_name ?? "",
      username: parsed.username ?? "",
      level: parsed.level ?? "",
      parent_member_id: parsed.parent_member_id ?? "",
    };
  } catch {
    return null;
  }
}

export function setStudentSession(
  response: NextResponse,
  session: StudentSession,
): void {
  response.cookies.set(STUDENT_SESSION_COOKIE, encode(session), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

export function getStudentSession(
  request: NextRequest,
): StudentSession | null {
  return decode(request.cookies.get(STUDENT_SESSION_COOKIE)?.value);
}

export function clearStudentSession(response: NextResponse): void {
  response.cookies.set(STUDENT_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}

// Convenience reader for server components / server actions.
export function readStudentSessionFromCookies(): StudentSession | null {
  return decode(cookies().get(STUDENT_SESSION_COOKIE)?.value);
}
