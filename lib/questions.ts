"use client";

import { getMemberstack } from "./memberstack";

const TABLE = "kaiako_questions";

export type Question = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  levelSlug: string;
  weekNumber: number;
  question: string;
  answered: boolean;
  answer: string;
  createdAt: string;
};

type RawRecord = {
  id: string;
  data: Record<string, unknown>;
  createdAt?: string;
  createdByMemberId?: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseQuestion(record: RawRecord): Question {
  const d = record.data ?? {};
  return {
    id: record.id,
    studentId: str(d["student_id"]) || record.createdByMemberId || "",
    studentName: str(d["student_name"]),
    studentEmail: str(d["student_email"]),
    levelSlug: str(d["level_slug"]),
    weekNumber:
      typeof d["week_number"] === "number" ? d["week_number"] : 0,
    question: str(d["question"]),
    answered: d["answered"] === true,
    answer: str(d["answer"]),
    createdAt: record.createdAt ?? "",
  };
}

type CreateQuestionInput = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  levelSlug: string;
  weekNumber: number;
  question: string;
};

export async function createQuestion(
  input: CreateQuestionInput,
): Promise<Question | null> {
  const ms = getMemberstack();
  if (!ms) return null;

  try {
    const { data } = await ms.createDataRecord({
      table: TABLE,
      data: {
        student_id: input.studentId,
        student_name: input.studentName,
        student_email: input.studentEmail,
        level_slug: input.levelSlug,
        week_number: input.weekNumber,
        question: input.question,
        answered: false,
        answer: "",
      },
    });
    return parseQuestion(data as RawRecord);
  } catch (err) {
    console.error("createQuestion failed", err);
    return null;
  }
}

export async function getUnansweredQuestions(): Promise<Question[]> {
  const ms = getMemberstack();
  if (!ms) return [];

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: { answered: { equals: false } },
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    });
    if ("records" in data) {
      return data.records.map((r: RawRecord) => parseQuestion(r));
    }
  } catch (err) {
    console.error("getUnansweredQuestions failed", err);
  }
  return [];
}

export async function getAllQuestions(): Promise<Question[]> {
  const ms = getMemberstack();
  if (!ms) return [];

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    });
    if ("records" in data) {
      return data.records.map((r: RawRecord) => parseQuestion(r));
    }
  } catch (err) {
    console.error("getAllQuestions failed", err);
  }
  return [];
}

export async function getAnsweredQuestionsForLesson(params: {
  studentId: string;
  levelSlug: string;
  weekNumber: number;
}): Promise<Question[]> {
  const ms = getMemberstack();
  if (!ms) return [];

  try {
    const { data } = await ms.queryDataRecords({
      table: TABLE,
      query: {
        where: {
          AND: [
            { student_id: { equals: params.studentId } },
            { level_slug: { equals: params.levelSlug } },
            { week_number: { equals: params.weekNumber } },
            { answered: { equals: true } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    });
    if ("records" in data) {
      return data.records.map((r: RawRecord) => parseQuestion(r));
    }
  } catch (err) {
    console.error("getAnsweredQuestionsForLesson failed", err);
  }
  return [];
}

export async function answerQuestion(params: {
  questionId: string;
  answer: string;
}): Promise<Question | null> {
  const ms = getMemberstack();
  if (!ms) return null;

  try {
    const { data } = await ms.updateDataRecord({
      recordId: params.questionId,
      data: {
        answer: params.answer,
        answered: true,
      },
    });
    return parseQuestion(data as RawRecord);
  } catch (err) {
    console.error("answerQuestion failed", err);
    return null;
  }
}
