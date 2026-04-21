"use client";

import { getMemberstack } from "./memberstack";

export type TeacherMember = {
  id: string;
  email: string;
  customFields: Record<string, unknown>;
  planConnections: { planId?: string; active?: boolean; status?: string }[];
};

function pickField(
  cf: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const k of keys) {
    const v = cf[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

export function memberFullName(m: TeacherMember): string {
  const first = pickField(m.customFields, "first-name", "firstName");
  const last = pickField(m.customFields, "last-name", "lastName");
  const name = [first, last].filter(Boolean).join(" ").trim();
  return name || m.email || m.id;
}

export async function getTeacherMembers(): Promise<TeacherMember[]> {
  const ms = getMemberstack();
  if (!ms) return [];

  try {
    const { data: me } = await ms.getCurrentMember();
    if (!me) return [];

    const res = await fetch("/api/teacher/members", {
      headers: { "x-member-id": me.id },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("getTeacherMembers failed", res.status, body);
      return [];
    }

    const payload = (await res.json()) as { members: TeacherMember[] };
    return payload.members ?? [];
  } catch (err) {
    console.error("getTeacherMembers failed", err);
    return [];
  }
}
