"use client";

import { getMemberstack } from "./memberstack";

const TABLE = "parent_profiles";

type RawRecord = {
  id: string;
  data: Record<string, unknown>;
};

export type ParentProfileFields = {
  phone?: string;
  street?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  enrolment_plan?: string;
  price_id?: string;
};

async function findExistingRow(
  memberId: string,
): Promise<RawRecord | null> {
  const ms = getMemberstack();
  if (!ms) return null;

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: { member_id: { equals: memberId } },
        take: 1,
      },
    });
    if ("records" in data && data.records.length > 0) {
      return data.records[0] as RawRecord;
    }
  } catch (err) {
    console.error("findExistingRow (parent_profiles) failed", err);
  }
  return null;
}

// Find-or-create-then-merge: queries for the member's parent_profiles row,
// updates it with the given fields if found, otherwise creates a new row.
// Only fields explicitly passed in are written — undefined values are skipped
// so callers can update a single field without clobbering the rest.
export async function upsertParentProfile(
  memberId: string,
  fields: ParentProfileFields,
): Promise<RawRecord | null> {
  const ms = getMemberstack();
  if (!ms || !memberId) return null;

  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v === "string") cleaned[k] = v;
  }

  const existing = await findExistingRow(memberId);

  try {
    if (existing) {
      const { data } = await ms.updateDataRecord({
        recordId: existing.id,
        data: cleaned,
      });
      return data as RawRecord;
    }

    const { data } = await ms.createDataRecord({
      table: TABLE,
      data: { member_id: memberId, ...cleaned },
    });
    return data as RawRecord;
  } catch (err) {
    console.error("upsertParentProfile failed", err);
    throw err;
  }
}
