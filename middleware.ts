import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STUDENT_SESSION_COOKIE } from "@/lib/studentSessionConstants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/student-dashboard")) {
    const cookie = request.cookies.get(STUDENT_SESSION_COOKIE)?.value;
    if (!cookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/student-login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/lessons/:path*",
    "/member/:path*",
    "/student-dashboard",
    "/student-dashboard/:path*",
  ],
};
