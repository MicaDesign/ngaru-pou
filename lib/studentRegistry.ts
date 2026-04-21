"use client";

import { getMemberstack } from "./memberstack";
import { isKaiako } from "./kaiako";

const TABLE = "student_registry";

export type Student = {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

type RawRecord = {
  id: string;
  data: Record<string, unknown>;
  createdAt?: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseStudent(record: RawRecord): Student {
  const d = record.data ?? {};
  return {
    id: record.id,
    memberId: str(d["member_id"]),
    firstName: str(d["first_name"]),
    lastName: str(d["last_name"]),
    email: str(d["email"]),
    createdAt: record.createdAt ?? "",
  };
}

export function fullName(s: Student): string {
  const name = [s.firstName, s.lastName].filter(Boolean).join(" ").trim();
  return name || s.email || s.memberId;
}

type MemberLike = {
  id?: string;
  auth?: { email?: string };
  customFields?: Record<string, unknown>;
  planConnections?: { planId?: string; active?: boolean }[];
} | null;

function pickField(cf: Record<string, unknown> | undefined, ...keys: string[]) {
  if (!cf) return "";
  for (const k of keys) {
    const v = cf[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

export async function ensureStudentRegistered(
  member: MemberLike,
): Promise<Student | null> {
  if (!member?.id) return null;
  if (isKaiako(member)) return null; // teachers don't go in the student registry

  const ms = getMemberstack();
  if (!ms) return null;

  const memberId = member.id;

  try {
    // Look for an existing record for this member.
    const { data: existing } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: { member_id: { equals: memberId } },
        take: 1,
      },
    });
    if ("records" in existing && existing.records.length > 0) {
      return parseStudent(existing.records[0] as RawRecord);
    }

    const firstName = pickField(
      member.customFields,
      "first-name",
      "firstName",
    );
    const lastName = pickField(member.customFields, "last-name", "lastName");
    const email = member.auth?.email ?? "";

    const { data } = await ms.createDataRecord({
      table: TABLE,
      data: {
        member_id: memberId,
        first_name: firstName,
        last_name: lastName,
        email,
      },
    });
    return parseStudent(data as RawRecord);
  } catch (err) {
    console.error("ensureStudentRegistered failed", err);
    return null;
  }
}

export async function getStudents(): Promise<Student[]> {
  const ms = getMemberstack();
  if (!ms) return [];

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        orderBy: { createdAt: "asc" },
        take: 100,
      },
    });
    if ("records" in data) {
      return data.records.map((r: RawRecord) => parseStudent(r));
    }
  } catch (err) {
    console.error("getStudents failed", err);
  }
  return [];
}
