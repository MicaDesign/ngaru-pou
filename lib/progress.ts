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

export async function ensureProgressRecord(
  params: ProgressKey,
): Promise<LessonProgress | null> {
  const existing = await getLessonProgress(params.lessonId);
  if (existing) return existing;

  const ms = getMemberstack();
  if (!ms) return null;

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
      },
    });
    return parseProgress(data as RawRecord);
  } catch (err) {
    console.error("ensureProgressRecord failed", err);
    return null;
  }
}

export async function markLessonComplete(
  params: ProgressKey,
): Promise<LessonProgress | null> {
  const ms = getMemberstack();
  if (!ms) return null;

  const existing = await ensureProgressRecord(params);
  if (!existing) return null;

  try {
    const { data } = await ms.updateDataRecord({
      recordId: existing.id,
      data: {
        completed: true,
        completed_at: new Date().toISOString(),
      },
    });
    return parseProgress(data as RawRecord);
  } catch (err) {
    console.error("markLessonComplete failed", err);
    return null;
  }
}
