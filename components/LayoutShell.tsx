"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";

const AUTH_ROUTES = ["/login", "/signup", "/verified"];

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r);

  return (
    <>
      {!isAuthRoute && <Nav />}
      <main className="flex-1">{children}</main>
      {!isAuthRoute && <Footer />}
    </>
  );
}
