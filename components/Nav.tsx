"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  LogOut,
} from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

const navLinks = [
  { label: "Levels", href: "/dashboard/levels" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about-us" },
];

type Member = {
  auth?: { email?: string };
  customFields?: Record<string, unknown>;
} | null;

function pickString(src: Record<string, unknown> | undefined, ...keys: string[]) {
  if (!src) return "";
  for (const k of keys) {
    const v = src[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function getDisplayName(member: Member): string {
  const first = pickString(member?.customFields, "first-name", "firstName");
  const last = pickString(member?.customFields, "last-name", "lastName");
  const full = [first, last].filter(Boolean).join(" ");
  return full || member?.auth?.email || "Member";
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [member, setMember] = useState<Member>(null);
  const [checking, setChecking] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const ms = getMemberstack();
    if (!ms) {
      setChecking(false);
      return;
    }
    ms.getCurrentMember()
      .then(({ data }: { data: Member }) => setMember(data))
      .catch(() => setMember(null))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  async function handleLogout() {
    const ms = getMemberstack();
    if (ms) await ms.logout();
    window.location.href = "/";
  }

  const displayName = getDisplayName(member);

  const authButtons = checking ? null : member ? (
    <div ref={userMenuRef} className="relative">
      <button
        onClick={() => setUserMenuOpen((v) => !v)}
        aria-label="User menu"
        aria-expanded={userMenuOpen}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-white/70 transition-colors duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-white/[0.08] hover:text-white"
      >
        <User size={18} />
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            userMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {userMenuOpen && (
        <div className="animate-fade-up absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-white/10 bg-iron-depth shadow-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-white/40">
              Signed in as
            </p>
            <p className="mt-0.5 truncate font-sans text-sm text-white/85">
              {displayName}
            </p>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <LayoutDashboard size={16} />
            View dashboard
          </Link>
          <Link
            href="/dashboard/levels"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <BookOpen size={16} />
            Levels
          </Link>

          <div className="border-t border-white/10" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 font-sans text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
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
      <Link
        href="/dashboard"
        className="text-white/70 hover:text-white text-base font-semibold transition-colors"
        onClick={() => setOpen(false)}
      >
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="bg-primary hover:bg-primary-light text-white text-base font-semibold px-5 py-3 rounded-lg text-center transition-all duration-300"
      >
        Log Out
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="text-white/70 hover:text-white text-base font-semibold transition-colors"
        onClick={() => setOpen(false)}
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="bg-primary hover:bg-primary-light text-white text-base font-semibold px-5 py-3 rounded-lg text-center transition-all duration-300"
        onClick={() => setOpen(false)}
      >
        Sign Up
      </Link>
    </>
  );

  return (
    <header className="header-border-shadow sticky top-0 z-[999] w-full bg-midnight-tidal">
      <div className="flex h-24 items-center justify-between gap-3 px-6 md:px-10">
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
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`group relative mx-[5px] inline-flex items-center justify-center rounded-lg border border-transparent px-3 py-[0.4rem] font-sans text-[1.1rem] font-semibold transition-[color,background-color] duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
                  active
                    ? "text-white"
                    : "text-white/50 hover:bg-white/[0.11] hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-1 left-3 right-3 h-px origin-left transition-transform duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
                    active
                      ? "scale-x-100 bg-primary"
                      : "scale-x-0 bg-white group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
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
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-base font-semibold transition-colors ${
                  active
                    ? "text-white border-l-2 border-primary pl-3 -ml-3"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.11]">
            {mobileAuthButtons}
          </div>
        </div>
      )}
    </header>
  );
}
