import { NextResponse } from "next/server";

const ADMIN_BASE = "https://admin.memberstack.com";

type MsPlanConnection = { planId?: string; active?: boolean };
type MsMember = {
  id: string;
  auth?: { email?: string };
  customFields?: Record<string, string | null>;
  planConnections?: MsPlanConnection[];
};

export async function GET(request: Request) {
  const key = process.env.MEMBERSTACK_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "MEMBERSTACK_SECRET_KEY not configured" }, { status: 500 });
  }

  const callerId = request.headers.get("x-member-id");
  if (!callerId) {
    return NextResponse.json({ error: "missing x-member-id" }, { status: 401 });
  }

  try {
    const res = await fetch(`${ADMIN_BASE}/members?limit=500`, {
      headers: { "X-API-KEY": key, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "member fetch failed" }, { status: 502 });
    }

    const payload = await res.json() as { data?: MsMember[] };
    const members: MsMember[] = Array.isArray(payload?.data) ? payload.data : [];

    const list = members
      .filter((m) => m.id !== callerId)
      .map((m) => {
        const cf = m.customFields ?? {};
        const first = cf["first-name"] ?? "";
        const last = cf["last-name"] ?? "";
        const displayName = [first, last].filter(Boolean).join(" ") || m.auth?.email?.split("@")[0] || "Member";
        return { id: m.id, displayName, email: m.auth?.email ?? "" };
      });

    return NextResponse.json({ members: list });
  } catch (err) {
    console.error("messages/members failed", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
