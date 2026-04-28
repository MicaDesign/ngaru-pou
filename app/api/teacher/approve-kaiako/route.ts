import { NextResponse } from "next/server";
import { KAIAKO_PLAN_ID } from "@/lib/kaiako";

const ADMIN_BASE = "https://admin.memberstack.com";

type PlanConnection = {
  planId?: string;
  active?: boolean;
};

type AdminMember = {
  id: string;
  planConnections?: PlanConnection[];
};

async function adminRequest(
  path: string,
  key: string,
  options: { method?: string; body?: unknown } = {},
): Promise<{ ok: boolean; status: number; json?: unknown }> {
  const res = await fetch(`${ADMIN_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "X-API-KEY": key,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  let json: unknown;
  if (text) {
    try { json = JSON.parse(text); } catch { /* leave undefined */ }
  }
  return { ok: res.ok, status: res.status, json };
}

function extractMember(payload: unknown): AdminMember | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    return obj.data as AdminMember;
  }
  return payload as AdminMember;
}

export async function POST(request: Request) {
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

  let body: { memberId?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request body" }, { status: 400 });
  }

  const { memberId, action } = body;
  if (!memberId || (action !== "approve" && action !== "deny")) {
    return NextResponse.json(
      { error: "memberId and action (approve|deny) required" },
      { status: 400 },
    );
  }

  // Verify caller is on the Kaiako plan.
  const callerRes = await adminRequest(
    `/members/${encodeURIComponent(callerId)}`,
    key,
  );
  if (!callerRes.ok) {
    return NextResponse.json(
      { error: "caller lookup failed", status: callerRes.status },
      { status: 502 },
    );
  }
  const caller = extractMember(callerRes.json);
  const callerIsKaiako = (caller?.planConnections ?? []).some(
    (c) => c.planId === KAIAKO_PLAN_ID && c.active === true,
  );
  if (!callerIsKaiako) {
    return NextResponse.json({ error: "kaiako plan required" }, { status: 403 });
  }

  if (action === "approve") {
    // Assign the Kaiako plan to the target member.
    const planRes = await adminRequest(
      `/members/${encodeURIComponent(memberId)}/plans`,
      key,
      { method: "POST", body: { planId: KAIAKO_PLAN_ID } },
    );
    if (!planRes.ok) {
      console.error("approve-kaiako: plan assignment failed", planRes);
      return NextResponse.json(
        { error: "plan assignment failed", status: planRes.status },
        { status: 502 },
      );
    }
  }

  // Update kaiako-status custom field (best-effort — PATCH may not be
  // available on all MemberStack plans, so we log but don't fail the request).
  const newStatus = action === "approve" ? "approved" : "denied";
  const patchRes = await adminRequest(
    `/members/${encodeURIComponent(memberId)}`,
    key,
    {
      method: "PATCH",
      body: { customFields: { "kaiako-status": newStatus } },
    },
  );
  if (!patchRes.ok) {
    console.warn(
      `approve-kaiako: status field update failed (${patchRes.status}) — continuing`,
    );
  }

  return NextResponse.json({ success: true, action });
}
