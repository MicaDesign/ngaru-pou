"use client";

import { getMemberstack } from "./memberstack";

const TABLE = "lesson_progress";

export type LessonProgress = {
  id: string;
  lessonId: string;
  levelSlug: string;
  weekNumber: number;
  completed: boolean;
  completedAt: string;
  reflectionAnswers: string;
};

type RawRecord = {
  id: string;
  data: Record<string, unknown>;
  createdByMemberId?: string;
  createdAt?: string;
};

export type ProgressRecord = LessonProgress & {
  memberId: string;
  createdAt: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseProgress(record: RawRecord): LessonProgress {
  const d = record.data ?? {};
  return {
    id: record.id,
    lessonId: str(d["lesson_id"]),
    levelSlug: str(d["level_slug"]),
    weekNumber: typeof d["week_number"] === "number" ? d["week_number"] : 0,
    completed: d["completed"] === true,
    completedAt: str(d["completed_at"]),
    reflectionAnswers: str(d["reflection_answers"]),
  };
}

function toProgressRecord(r: RawRecord): ProgressRecord {
  const memberIdFromData = str(r.data?.["member_id"]);
  return {
    ...parseProgress(r),
    memberId: memberIdFromData || r.createdByMemberId || "",
    createdAt: r.createdAt ?? "",
  };
}

export async function getLessonProgress(
  lessonId: string,
): Promise<LessonProgress | null> {
  const ms = getMemberstack();
  if (!ms) return null;

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: { lesson_id: { equals: lessonId } },
        take: 1,
      },
    });

    if ("records" in data && data.records.length > 0) {
      return parseProgress(data.records[0] as RawRecord);
    }
  } catch (err) {
    console.error("getLessonProgress failed", err);
  }
  return null;
}

export async function getCompletedWeeksForLevel(
  levelSlug: string,
): Promise<number[]> {
  const ms = getMemberstack();
  if (!ms) return [];

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: {
          AND: [
            { level_slug: { equals: levelSlug } },
            { completed: { equals: true } },
          ],
        },
        take: 100,
      },
    });

    if ("records" in data) {
      return data.records
        .map((r: RawRecord) =>
          typeof r.data["week_number"] === "number" ? r.data["week_number"] : 0,
        )
        .filter((n: number) => Number.isFinite(n) && n > 0);
    }
  } catch (err) {
    console.error("getCompletedWeeksForLevel failed", err);
  }
  return [];
}

type ProgressKey = {
  lessonId: string;
  levelSlug: string;
  weekNumber: number;
};

async function getCurrentMemberId(): Promise<string> {
  const ms = getMemberstack();
  if (!ms) return "";
  try {
    const { data: member } = await ms.getCurrentMember();
    return member?.id ?? "";
  } catch {
    return "";
  }
}

async function findProgressRecord(
  lessonId: string,
): Promise<RawRecord | null> {
  const ms = getMemberstack();
  if (!ms) return null;

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: { lesson_id: { equals: lessonId } },
        take: 1,
      },
    });
    if ("records" in data && data.records.length > 0) {
      return data.records[0] as RawRecord;
    }
  } catch (err) {
    console.error("findProgressRecord failed", err);
  }
  return null;
}

export async function ensureProgressRecord(
  params: ProgressKey,
): Promise<LessonProgress | null> {
  const ms = getMemberstack();
  if (!ms) return null;

  const memberId = await getCurrentMemberId();
  const existing = await findProgressRecord(params.lessonId);

  if (existing) {
    const recordedMemberId = str(existing.data?.["member_id"]);
    // Backfill: some older rows were written without member_id. If the
    // record we just loaded is missing the field and we know the current
    // member's ID, write it back so the teacher dashboard can find it.
    if (!recordedMemberId && memberId) {
      try {
        const { data: updated } = await ms.updateDataRecord({
          recordId: existing.id,
          data: { member_id: memberId },
        });
        return parseProgress(updated as RawRecord);
      } catch (err) {
        console.error("ensureProgressRecord backfill failed", err);
      }
    }
    return parseProgress(existing);
  }

  try {
    const { data } = await ms.createDataRecord({
      table: TABLE,
      data: {
        lesson_id: params.lessonId,
        level_slug: params.levelSlug,
        week_number: params.weekNumber,
        completed: false,
        completed_at: "",
        reflection_answers: "",
        member_id: memberId,
      },
    });
    return parseProgress(data as RawRecord);
  } catch (err) {
    console.error("ensureProgressRecord failed", err);
    return null;
  }
}

// For the Kaiako dashboard: returns progress records for a specific student,
// filtered by the member_id data field (populated when the record is created).
// Requires the lesson_progress table read rule to allow Kaiako plan members
// to read across members (otherwise only the caller's own records return).
export async function getProgressByMemberId(
  memberId: string,
): Promise<ProgressRecord[]> {
  const ms = getMemberstack();
  if (!ms || !memberId) return [];

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: { member_id: { equals: memberId } },
        take: 100,
      },
    });
    if ("records" in data) {
      return data.records.map((r: RawRecord) => toProgressRecord(r));
    }
  } catch (err) {
    console.error("getProgressByMemberId failed", err);
  }
  return [];
}

export async function markLessonComplete(
  params: ProgressKey,
): Promise<LessonProgress | null> {
  const ms = getMemberstack();
  if (!ms) return null;

  const existing = await ensureProgressRecord(params);
  if (!existing) return null;

  try {
    const memberId = await getCurrentMemberId();
    const { data } = await ms.updateDataRecord({
      recordId: existing.id,
      data: {
        completed: true,
        completed_at: new Date().toISOString(),
        member_id: memberId,
      },
    });
    return parseProgress(data as RawRecord);
  } catch (err) {
    console.error("markLessonComplete failed", err);
    return null;
  }
}
