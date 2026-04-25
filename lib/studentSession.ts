"use client";

const KEY = "np_student";

export type StudentSession = {
  id: string;
  firstName: string;
  lastName: string;
  level: string;
  username: string;
  parentMemberId: string;
};

export function setStudentSession(session: StudentSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function getStudentSession(): StudentSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentSession;
  } catch {
    return null;
  }
}

export function clearStudentSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
