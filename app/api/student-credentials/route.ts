import { NextResponse } from "next/server";
import {
  hashPin,
  writeCredentials,
  type StudentCredentials,
} from "@/lib/studentCredentials";

const ADMIN_BASE = "https://admin.memberstack.com";

type StudentInput = {
  id?: unknown;
  parent_member_id?: unknown;
  first_name?: unknown;
  last_name?: unknown;
  level?: unknown;
};

type Body = {
  username?: unknown;
  pin?: unknown;
  student?: StudentInput;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

async function verifyMember(memberId: string, key: string): Promise<boolean> {
  const res = await fetch(
    `${ADMIN_BASE}/members/${encodeURIComponent(memberId)}`,
    {
      headers: { "X-API-KEY": key, Accept: "application/json" },
      cache: "no-store",
    },
  );
  return res.ok;
}

export async function POST(request: Request) {
  const adminKey = process.env.MEMBERSTACK_SECRET_KEY;
  if (!adminKey) {
    console.error("/api/student-credentials: MEMBERSTACK_SECRET_KEY not set");
    return NextResponse.json(
      { error: "server not configured" },
      { status: 500 },
    );
  }

  const callerId = request.headers.get("x-member-id") ?? "";
  if (!callerId) {
    return NextResponse.json(
      { error: "missing x-member-id header" },
      { status: 401 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "invalid request body" },
      { status: 400 },
    );
  }

  const username = str(body.username);
  const pin = str(body.pin);
  const student = body.student ?? {};

  const id = str(student.id);
  const parentMemberId = str(student.parent_member_id);
  const firstName = str(student.first_name);
  const lastName = str(student.last_name);
  const level = str(student.level);

  if (!username || !pin || !id || !parentMemberId) {
    return NextResponse.json(
      { error: "username, pin, student.id and student.parent_member_id are required" },
      { status: 400 },
    );
  }

  if (parentMemberId !== callerId) {
    return NextResponse.json(
      { error: "you can only register credentials for your own children" },
      { status: 403 },
    );
  }

  const callerOk = await verifyMember(callerId, adminKey);
  if (!callerOk) {
    return NextResponse.json(
      { error: "caller not recognised" },
      { status: 403 },
    );
  }

  const pinHash = await hashPin(pin);
  const credentials: StudentCredentials = {
    id,
    parent_member_id: parentMemberId,
    first_name: firstName,
    last_name: lastName,
    level,
    username,
    pin_hash: pinHash,
  };

  const written = await writeCredentials(credentials);
  if (!written) {
    return NextResponse.json(
      {
        error:
          "That username is already taken. Please choose a different one.",
        code: "username_taken",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
