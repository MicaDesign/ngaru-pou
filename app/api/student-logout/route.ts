import { NextResponse } from "next/server";
import { clearStudentSession } from "@/lib/studentSession";

export async function POST(request: Request) {
  const target = new URL("/student-login", request.url);
  const response = NextResponse.redirect(target, { status: 303 });
  clearStudentSession(response);
  return response;
}
