"use client";

import { getMemberstack } from "./memberstack";

const TABLE = "student_profiles";

export type ChildProfile = {
  id: string;
  parentMemberId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  level: string;
  username: string;
  pin: string;
  medicalNotes: string;
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

function parseChild(record: RawRecord): ChildProfile {
  const d = record.data ?? {};
  return {
    id: record.id,
    parentMemberId: str(d["parent_member_id"]),
    firstName: str(d["first_name"]),
    lastName: str(d["last_name"]),
    dateOfBirth: str(d["date_of_birth"]),
    level: str(d["level"]),
    username: str(d["username"]),
    pin: str(d["pin"]),
    medicalNotes: str(d["medical_notes"]),
    createdAt: record.createdAt ?? "",
  };
}

export function fullName(c: ChildProfile): string {
  const name = [c.firstName, c.lastName].filter(Boolean).join(" ").trim();
  return name || c.username || "Unnamed";
}

export function ageInYears(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birth.getDate())
  ) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

export async function findStudentByUsernameAndPin(
  username: string,
  pin: string,
): Promise<ChildProfile | null> {
  const ms = getMemberstack();
  if (!ms || !username || !pin) return null;

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: {
          AND: [
            { username: { equals: username } },
            { pin: { equals: pin } },
          ],
        },
        take: 1,
      },
    });
    if ("records" in data && data.records.length > 0) {
      return parseChild(data.records[0] as RawRecord);
    }
  } catch (err) {
    console.error("findStudentByUsernameAndPin failed", err);
  }
  return null;
}

export async function getChildrenForParent(
  parentMemberId: string,
): Promise<ChildProfile[]> {
  const ms = getMemberstack();
  if (!ms || !parentMemberId) return [];

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: { parent_member_id: { equals: parentMemberId } },
        take: 50,
      },
    });
    if ("records" in data) {
      return data.records
        .map((r: RawRecord) => parseChild(r))
        .sort((a: ChildProfile, b: ChildProfile) =>
          a.createdAt.localeCompare(b.createdAt),
        );
    }
  } catch (err) {
    console.error("getChildrenForParent failed", err);
  }
  return [];
}
