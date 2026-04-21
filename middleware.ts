import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware cookies:", request.cookies.getAll());
  console.log("Has _ms-mid:", request.cookies.has("_ms-mid"));

  // Temporarily allow all requests through to confirm middleware is the bounce source
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/lessons/:path*",
    "/member/:path*",
  ],
};
