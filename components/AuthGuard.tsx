"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ms = getMemberstack();
    if (!ms) {
      window.location.href = "/login";
      return;
    }
    ms.getCurrentMember()
      .then(({ data }: { data: unknown }) => {
        if (!data) {
          window.location.href = "/login";
        } else {
          setReady(true);
        }
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-midnight-tidal flex items-center justify-center">
        <Loader2 size={28} className="text-white/30 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
