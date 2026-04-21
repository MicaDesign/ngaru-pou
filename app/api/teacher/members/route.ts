import { NextResponse } from "next/server";
import { KAIAKO_PLAN_ID } from "@/lib/kaiako";

const ADMIN_BASE = "https://admin.memberstack.com";

type PlanConnection = {
  planId?: string;
  active?: boolean;
  status?: string;
};

type AdminMember = {
  id: string;
  auth?: { email?: string };
  customFields?: Record<string, unknown>;
  planConnections?: PlanConnection[];
};

async function adminFetch(
  path: string,
  key: string,
): Promise<{ ok: boolean; status: number; body: string; json?: unknown }> {
  const res = await fetch(`${ADMIN_BASE}${path}`, {
    headers: {
      "X-API-KEY": key,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  const body = await res.text();
  let json: unknown = undefined;
  if (body) {
    try {
      json = JSON.parse(body);
    } catch {
      // leave json undefined
    }
  }
  return { ok: res.ok, status: res.status, body, json };
}

function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.members)) return obj.members as T[];
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.members)) return inner.members as T[];
    }
  }
  return [];
}

function extractObject<T>(payload: unknown): T | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    return obj.data as T;
  }
  return payload as T;
}

export async function GET(request: Request) {
  const key = process.env.MEMBERSTACK_SECRET_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "MEMBERSTACK_SECRET_KEY not configured" },
      { status: 500 },
    );
  }

  const callerId = request.headers.get("x-member-id");
  if (!callerId) {
    return NextResponse.json(
      { error: "missing x-member-id header" },
      { status: 401 },
    );
  }

  // 1. Verify caller is on the Kaiako plan.
  const callerRes = await adminFetch(
    `/members/${encodeURIComponent(callerId)}`,
    key,
  );
  if (!callerRes.ok) {
    console.error("/api/teacher/members: caller lookup failed", callerRes);
    return NextResponse.json(
      {
        error: "caller lookup failed",
        stage: "caller",
        status: callerRes.status,
        body: callerRes.body.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const caller = extractObject<AdminMember>(callerRes.json);
  const isKaiako = (caller?.planConnections ?? []).some(
    (c) => c.planId === KAIAKO_PLAN_ID && c.active === true,
  );
  if (!isKaiako) {
    return NextResponse.json(
      { error: "kaiako plan required" },
      { status: 403 },
    );
  }

  // 2. Pull the full member list. Request a large page; we'll add pagination
  // if/when the roster actually exceeds a page.
  const membersRes = await adminFetch("/members?limit=100", key);
  if (!membersRes.ok) {
    console.error("/api/teacher/members: list fetch failed", membersRes);
    return NextResponse.json(
      {
        error: "members fetch failed",
        stage: "list",
        status: membersRes.status,
        body: membersRes.body.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const members = extractArray<AdminMember>(membersRes.json);

  return NextResponse.json({
    members: members.map((m) => ({
      id: m.id,
      email: m.auth?.email ?? "",
      customFields: m.customFields ?? {},
      planConnections: m.planConnections ?? [],
    })),
    _meta: { count: members.length },
  });
}
