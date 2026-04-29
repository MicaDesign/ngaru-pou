"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { getMemberstack } from "@/lib/memberstack";

const MEMBER_ONLY_HREFS = new Set([
  "/enrolment/code-of-conduct",
  "/enrolment/uniform-regulations",
  "/enrolment/handy-hints",
]);

const footerColumns = [
  [
    { label: "Courses", href: "/lessons" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about-us" },
  ],
  [
    { label: "F.A.Q.", href: "/faq" },
    { label: "Sign Up", href: "/signup" },
    { label: "Log In", href: "/login" },
  ],
  [
    { label: "Code of Conduct", href: "/enrolment/code-of-conduct" },
    { label: "Uniform Regulations", href: "/enrolment/uniform-regulations" },
    { label: "Handy Hints", href: "/enrolment/handy-hints" },
    { label: "Terms of Service", href: "/enrolment/terms-of-service" },
    { label: "Legal & Privacy", href: "/enrolment/legal" },
  ],
];

export default function Footer() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const ms = getMemberstack();
    if (!ms) return;
    ms.getCurrentMember().then((res: { data?: { id?: string } | null }) => {
      setIsLoggedIn(!!res.data?.id);
    }).catch(() => {});
  }, []);

  async function handleLogout() {
    const ms = getMemberstack();
    if (ms) await ms.logout();
    window.location.href = "/";
  }

  return (
    <footer className="border-t border-white/[0.11] bg-midnight-tidal pt-16 pb-8">
      <div className="site-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <Link
            href="/"
            className="inline-block w-[14rem] transition-transform duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:scale-[1.05]"
          >
            <Image
              src="/images/main-logo-white-tagline.svg"
              alt="Ngaru Pou"
              width={224}
              height={64}
            />
          </Link>
          {footerColumns.map((col, i) => {
            // Column index 1 = the Sign Up / Log In column — swap when logged in
            if (i === 1 && isLoggedIn) {
              return (
                <ul key={i} className="flex flex-col gap-1 items-start">
                  <li><Link href="/faq" className={`font-sans text-[1.1rem] px-[10px] py-[5px] rounded-full inline-block transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${pathname === "/faq" ? "bg-primary text-white" : "text-white hover:text-primary"}`}>F.A.Q.</Link></li>
                  <li><Link href="/dashboard" className={`font-sans text-[1.1rem] px-[10px] py-[5px] rounded-full inline-block transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${pathname === "/dashboard" ? "bg-primary text-white" : "text-white hover:text-primary"}`}>Dashboard</Link></li>
                  <li><Link href="/messages" className={`font-sans text-[1.1rem] px-[10px] py-[5px] rounded-full inline-block transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${pathname === "/messages" ? "bg-primary text-white" : "text-white hover:text-primary"}`}>Messages</Link></li>
                  <li><button onClick={handleLogout} className="font-sans text-[1.1rem] px-[10px] py-[5px] rounded-full inline-block transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] text-white hover:text-primary">Log Out</button></li>
                </ul>
              );
            }
            return (
              <ul key={i} className="flex flex-col gap-1 items-start">
                {col.filter(({ href }) => !MEMBER_ONLY_HREFS.has(href) || isLoggedIn).map(({ label, href }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={label}>
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={`font-sans text-[1.1rem] px-[10px] py-[5px] rounded-full inline-block transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-white hover:text-primary"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>

        <div className="h-px bg-white/[0.11] my-6" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="font-sans text-[1.1rem] text-white/50">
              © {new Date().getFullYear()} Ngaru Pou
            </p>
            <Link
              href="https://www.micadesign.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[1.1rem] text-white/50 transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:text-primary"
            >
              Designed by Mica Design
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="https://www.facebook.com/groups/816360571780791"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Ngaru Pou on Facebook"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.11] hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </Link>
            <Link
              href="mailto:info@ngarupou.org.au"
              aria-label="Email Ngaru Pou"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.11] hover:-translate-y-0.5"
            >
              <Mail size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
