"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

const navLinks = [
  { label: "Lessons", href: "/lessons" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about-us" },
];

export default function Nav() {
  const [open, setOpen]       = useState(false);
  const [member, setMember]   = useState<unknown>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const ms = getMemberstack();
    if (!ms) { setChecking(false); return; }
    ms.getCurrentMember()
      .then(({ data }: { data: unknown }) => setMember(data))
      .catch(() => setMember(null))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    const ms = getMemberstack();
    if (ms) await ms.logout();
    window.location.href = "/";
  }

  const authButtons = checking ? null : member ? (
    <>
      <Link
        href="/dashboard"
        className="inline-flex h-8 items-center rounded-lg px-3 py-[0.4rem] font-sans text-[1.1rem] font-semibold text-white/50 transition-[color,background-color] duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.11] hover:text-white"
      >
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="inline-flex h-8 items-center rounded-lg bg-primary px-3 py-[0.4rem] font-sans text-[1.1rem] font-semibold text-white transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-primary-light"
      >
        Log Out
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="inline-flex h-8 items-center rounded-lg px-3 py-[0.4rem] font-sans text-[1.1rem] font-semibold text-white/50 transition-[color,background-color] duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.11] hover:text-white"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="inline-flex h-8 items-center rounded-lg bg-primary px-3 py-[0.4rem] font-sans text-[1.1rem] font-semibold text-white transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-primary-light"
      >
        Sign Up
      </Link>
    </>
  );

  const mobileAuthButtons = checking ? null : member ? (
    <>
      <Link href="/dashboard" className="text-white/70 hover:text-white text-base font-semibold transition-colors" onClick={() => setOpen(false)}>Dashboard</Link>
      <button onClick={handleLogout} className="bg-primary hover:bg-primary-light text-white text-base font-semibold px-5 py-3 rounded-lg text-center transition-all duration-300">Log Out</button>
    </>
  ) : (
    <>
      <Link href="/login" className="text-white/70 hover:text-white text-base font-semibold transition-colors" onClick={() => setOpen(false)}>Login</Link>
      <Link href="/signup" className="bg-primary hover:bg-primary-light text-white text-base font-semibold px-5 py-3 rounded-lg text-center transition-all duration-300" onClick={() => setOpen(false)}>Sign Up</Link>
    </>
  );

  return (
    <header className="header-border-shadow sticky top-0 z-[999] w-full bg-midnight-tidal">
      <div className="site-container flex h-24 items-center justify-between gap-3">
        <Link
          href="/"
          className="flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:scale-[1.05]"
        >
          <Image
            src="/images/main-logo-white.svg"
            alt="Ngaru Pou"
            width={250}
            height={54}
            className="h-auto w-[200px] md:w-[250px]"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative mx-[5px] inline-flex items-center justify-center rounded-lg border border-transparent px-3 py-[0.4rem] font-sans text-[1.1rem] font-semibold text-white/50 transition-[color,background-color] duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.11] hover:text-white"
            >
              {link.label}
              <span className="absolute bottom-1 left-3 right-3 h-px origin-left scale-x-0 bg-white transition-transform duration-300 ease-[cubic-bezier(.165,.84,.44,1)] group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 min-w-[180px] justify-end">
          {authButtons}
        </div>

        <button
          className="rounded-lg p-2 text-white transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.11] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-midnight-tidal border-t border-white/[0.11] px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-white text-base font-semibold transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.11]">
            {mobileAuthButtons}
          </div>
        </div>
      )}
    </header>
  );
}
