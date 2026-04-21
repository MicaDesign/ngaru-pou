"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

type Member = {
  id: string;
  auth: { email: string };
  customFields?: Record<string, string>;
} | null;

export default function DashboardPage() {
  const [member, setMember] = useState<Member>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const ms = getMemberstack();
    if (!ms) {
      window.location.href = "/login";
      return;
    }
    ms.getCurrentMember()
      .then(({ data }: { data: Member }) => {
        if (!data) {
          window.location.href = "/login";
        } else {
          setMember(data);
          setChecking(false);
        }
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  async function handleLogout() {
    const ms = getMemberstack();
    if (ms) await ms.logout();
    window.location.href = "/login";
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-midnight-tidal flex items-center justify-center">
        <Loader2 size={28} className="text-white/30 animate-spin" />
      </div>
    );
  }

  const displayName = member?.customFields?.firstName || null;

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal">
      <section className="site-container py-20">
        <h1 className="font-display text-5xl md:text-6xl text-white mb-3">
          {displayName ? `welcome back, ${displayName}` : "welcome back"}
        </h1>
        <p className="font-sans text-white/50 text-sm mb-10">
          {member?.auth?.email}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="#"
            className="inline-flex h-14 items-center rounded-lg px-6 bg-primary hover:bg-primary-light text-white font-sans font-medium transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5"
          >
            Continue Learning
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex h-14 items-center rounded-lg px-6 border border-white/20 text-white/70 hover:text-white hover:bg-white/[0.06] font-sans font-medium transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5"
          >
            Log Out
          </button>
        </div>
      </section>
    </div>
  );
}
