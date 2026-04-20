"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMemberstack } from "@/lib/memberstack";

export type Member = {
  id: string;
  auth: { email: string };
  customFields?: Record<string, string>;
} | null;

type MemberstackContextValue = {
  member: Member;
  isLoading: boolean;
};

const MemberstackContext = createContext<MemberstackContextValue>({
  member: null,
  isLoading: false,
});

export function useMember() {
  return useContext(MemberstackContext);
}

// Auth pages are public — never initialise the SDK here so it can't
// perform its own page-protection redirects before the user logs in.
const AUTH_PAGES = ["/login", "/signup"];

export default function MemberstackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.includes(pathname);

  const [member, setMember] = useState<Member>(null);
  const [isLoading, setIsLoading] = useState(!isAuthPage);

  useEffect(() => {
    if (isAuthPage) {
      setIsLoading(false);
      return;
    }

    const ms = getMemberstack();
    if (!ms) {
      setIsLoading(false);
      return;
    }

    ms.getCurrentMember()
      .then(({ data }: { data: Member }) => {
        setMember(data);
      })
      .catch(() => {
        setMember(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthPage]);

  return (
    <MemberstackContext.Provider value={{ member, isLoading }}>
      {children}
    </MemberstackContext.Provider>
  );
}
