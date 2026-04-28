"use client";

import { getMemberstack } from "./memberstack";

export type KaiakoProfile = {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  experience: string;
  status: string;
  createdAt: string;
};

type RawRecord = {
  id: string;
  createdAt?: string;
  data?: Record<string, unknown>;
};

function toProfile(r: RawRecord): KaiakoProfile {
  const d = r.data ?? {};
  return {
    id: r.id,
    memberId: typeof d.member_id === "string" ? d.member_id : "",
    firstName: typeof d.first_name === "string" ? d.first_name : "",
    lastName: typeof d.last_name === "string" ? d.last_name : "",
    email: typeof d.email === "string" ? d.email : "",
    experience: typeof d.experience === "string" ? d.experience : "",
    status: typeof d.status === "string" ? d.status : "",
    createdAt: r.createdAt ?? "",
  };
}

export function fullName(profile: KaiakoProfile): string {
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || profile.email;
}

export async function createKaiakoProfile(data: {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  experience: string;
}): Promise<boolean> {
  const ms = getMemberstack();
  if (!ms) return false;
  try {
    await ms.createDataRecord({
      table: "kaiako_profiles",
      data: {
        member_id: data.memberId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        experience: data.experience,
        status: "pending",
      },
    });
    return true;
  } catch (err) {
    console.error("createKaiakoProfile failed", err);
    return false;
  }
}

export async function getPendingKaiakoProfiles(): Promise<KaiakoProfile[]> {
  const ms = getMemberstack();
  if (!ms) return [];
  try {
    const { data } = await ms.queryDataRecords({
      table: "kaiako_profiles",
      query: { orderBy: { createdAt: "asc" }, take: 100 },
    });
    if ("records" in data) {
      return (data.records as RawRecord[])
        .map(toProfile)
        .filter((p) => p.status === "pending");
    }
  } catch (err) {
    console.error("getPendingKaiakoProfiles failed", err);
  }
  return [];
}

export async function updateKaiakoProfileStatus(
  recordId: string,
  status: "approved" | "denied",
): Promise<boolean> {
  const ms = getMemberstack();
  if (!ms) return false;
  try {
    await ms.updateDataRecord({ recordId, data: { status } });
    return true;
  } catch (err) {
    console.error("updateKaiakoProfileStatus failed", err);
    return false;
  }
}
