"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  Users,
  MessageSquare,
  Send,
  Check,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";
import { isKaiako, KAIAKO_PLAN_ID } from "@/lib/kaiako";
import {
  getProgressByMemberId,
  type ProgressRecord,
} from "@/lib/progress";
import { getStudents, fullName, type Student } from "@/lib/studentRegistry";
import {
  getTeacherMembers,
  memberFullName,
  type TeacherMember,
} from "@/lib/teacherMembers";
import {
  getAllQuestions,
  answerQuestion,
  type Question,
} from "@/lib/questions";
import type { Level } from "@/lib/airtable";

type Props = {
  levels: Level[];
};

type Member = {
  id?: string;
  auth?: { email?: string };
  customFields?: Record<string, unknown>;
  planConnections?: { planId?: string; active?: boolean }[];
} | null;

type StudentSummary = {
  memberId: string;
  name: string;
  email: string;
  completedByLevel: Record<string, number>;
  lastActivity: string;
};

function getFirstName(member: Member): string {
  const cf = member?.customFields;
  const v = cf?.["first-name"];
  if (typeof v === "string" && v.trim()) return v.trim();
  const email = member?.auth?.email ?? "";
  return email.split("@")[0] ?? "";
}

// Exported for reuse if the teacher route needs to redirect non-Kaiako members.
export default function TeacherDashboardView({ levels }: Props) {
  const [member, setMember] = useState<Member>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [teacherMembers, setTeacherMembers] = useState<TeacherMember[]>([]);
  const [registry, setRegistry] = useState<Student[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const ms = getMemberstack();
    if (!ms) {
      window.location.href = "/login";
      return;
    }

    async function run() {
      try {
        const { data } = await ms.getCurrentMember();
        if (!data) {
          window.location.href = "/login";
          return;
        }
        if (cancelled) return;

        if (!isKaiako(data)) {
          setDenied(true);
          setAuthLoading(false);
          window.location.href = "/dashboard";
          return;
        }

        setMember(data);
        setAuthLoading(false);

        const [allMembers, allStudents, allQuestions] = await Promise.all([
          getTeacherMembers(),
          getStudents(),
          getAllQuestions(),
        ]);
        if (cancelled) return;

        // Only students — strip Kaiako accounts out of the member list.
        const studentMembers = allMembers.filter(
          (m) =>
            !m.planConnections.some(
              (c) => c.planId === KAIAKO_PLAN_ID && c.active === true,
            ),
        );

        // Union the admin-API member IDs with student_registry IDs, then fetch
        // each student's progress via where: { member_id: { equals: id } }.
        const idsFromApi = new Set(studentMembers.map((m) => m.id));
        const extraIds = allStudents
          .map((s) => s.memberId)
          .filter((id) => id && !idsFromApi.has(id));
        const allIds = Array.from(idsFromApi).concat(extraIds);

        const progressByStudent = await Promise.all(
          allIds.map((id) => getProgressByMemberId(id)),
        );
        if (cancelled) return;

        setTeacherMembers(studentMembers);
        setRegistry(allStudents);
        setQuestions(allQuestions);
        setProgress(progressByStudent.flat());
        setDataLoading(false);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setAuthLoading(false);
          setDataLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const students = useMemo<StudentSummary[]>(() => {
    const byMember = new Map<string, StudentSummary>();

    // Primary identity source: admin API member list.
    for (const m of teacherMembers) {
      byMember.set(m.id, {
        memberId: m.id,
        name: memberFullName(m),
        email: m.email,
        completedByLevel: {},
        lastActivity: "",
      });
    }

    // Fallback identity: student_registry entries for members the admin API
    // didn't return (e.g. if the route is down).
    for (const s of registry) {
      if (!s.memberId || byMember.has(s.memberId)) continue;
      byMember.set(s.memberId, {
        memberId: s.memberId,
        name: fullName(s),
        email: s.email,
        completedByLevel: {},
        lastActivity: s.createdAt,
      });
    }

    // Edge case: students who asked a question but aren't in either source yet.
    for (const q of questions) {
      if (!q.studentId || byMember.has(q.studentId)) continue;
      byMember.set(q.studentId, {
        memberId: q.studentId,
        name: q.studentName || q.studentId,
        email: q.studentEmail,
        completedByLevel: {},
        lastActivity: q.createdAt,
      });
    }

    // Fold in lesson progress counts.
    for (const p of progress) {
      if (!p.memberId) continue;
      const existing = byMember.get(p.memberId) ?? {
        memberId: p.memberId,
        name: p.memberId,
        email: "",
        completedByLevel: {},
        lastActivity: p.createdAt,
      };
      if (p.completed && p.levelSlug) {
        existing.completedByLevel[p.levelSlug] =
          (existing.completedByLevel[p.levelSlug] ?? 0) + 1;
      }
      if (p.createdAt && p.createdAt > existing.lastActivity) {
        existing.lastActivity = p.createdAt;
      }
      byMember.set(p.memberId, existing);
    }

    return Array.from(byMember.values()).sort((a, b) =>
      b.lastActivity.localeCompare(a.lastActivity),
    );
  }, [teacherMembers, registry, progress, questions]);

  const unansweredQuestions = useMemo(
    () => questions.filter((q) => !q.answered),
    [questions],
  );
  const answeredCount = questions.length - unansweredQuestions.length;

  const levelBySlug = useMemo(() => {
    const map: Record<string, Level> = {};
    for (const l of levels) map[l.slug] = l;
    return map;
  }, [levels]);

  function handleAnswered(q: Question) {
    setQuestions((prev) =>
      prev.map((item) =>
        item.id === q.id ? { ...item, answered: true, answer: q.answer } : item,
      ),
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal flex items-center justify-center">
        <Loader2 size={28} className="text-white/30 animate-spin" />
      </div>
    );
  }

  if (denied) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <ShieldAlert size={36} className="text-semantic-yellow mx-auto mb-4" />
          <h1 className="font-display text-3xl text-white mb-2">
            redirecting…
          </h1>
          <p className="font-sans text-white/60">
            The kaiako dashboard is for teachers only.
          </p>
        </div>
      </div>
    );
  }

  const firstName = getFirstName(member);

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal">
      <section className="site-container py-16 md:py-20">
        <div className="rounded-2xl bg-primary shadow-xl shadow-primary/20 px-7 py-8 md:px-10 md:py-10">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/75 mb-2">
            Kaiako dashboard
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white leading-[1.05]">
            kia ora{firstName ? `, ${firstName}` : ""} — kaiako dashboard
          </h1>
          <div className="mt-4 flex flex-wrap gap-5 text-sm font-sans text-white/85">
            <span className="inline-flex items-center gap-2">
              <Users size={14} />
              {students.length} student{students.length === 1 ? "" : "s"}
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageSquare size={14} />
              {unansweredQuestions.length} unanswered · {answeredCount} answered
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <InboxSection
            questions={unansweredQuestions}
            allQuestions={questions}
            onAnswered={handleAnswered}
            loading={dataLoading}
            levelNameBySlug={(slug) => levelBySlug[slug]?.name ?? slug}
          />

          <StudentsSection
            students={students}
            loading={dataLoading}
            levels={levels}
          />
        </div>
      </section>
    </div>
  );
}

function StudentsSection({
  students,
  loading,
  levels,
}: {
  students: StudentSummary[];
  loading: boolean;
  levels: Level[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Users size={20} className="text-primary" />
        <h2 className="font-display text-2xl text-white">students</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="text-white/30 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <p className="font-sans text-sm text-white/50 leading-relaxed">
          No student activity yet. Students will appear here once they mark
          lessons complete or ask questions.
        </p>
      ) : (
        <ul className="divide-y divide-white/10">
          {students.map((s) => {
            const totalCompleted = Object.values(s.completedByLevel).reduce(
              (sum, n) => sum + n,
              0,
            );
            const levelCount = Object.keys(s.completedByLevel).length;

            return (
              <li key={s.memberId} className="py-4">
                <p className="font-sans text-base text-white truncate">
                  {s.name}
                </p>
                {s.email && (
                  <p className="font-sans text-xs text-white/45 truncate">
                    {s.email}
                  </p>
                )}

                <p className="mt-2 font-sans text-xs text-white/55">
                  {totalCompleted === 0
                    ? "No lessons completed yet"
                    : `${totalCompleted} lesson${totalCompleted === 1 ? "" : "s"} completed across ${levelCount} level${levelCount === 1 ? "" : "s"}`}
                </p>

                {totalCompleted > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {levels.map((level) => {
                      const count = s.completedByLevel[level.slug] ?? 0;
                      if (count === 0) return null;
                      const thumbnail = level.thumbnail?.[0]?.url;
                      return (
                        <Link
                          key={level.slug}
                          href={`/dashboard/levels/${level.slug}`}
                          className="group inline-flex items-center gap-3 rounded-lg p-2 -m-2 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-iron-depth border border-white/10">
                            {thumbnail && (
                              <Image
                                src={thumbnail}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-contain"
                              />
                            )}
                          </div>
                          <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-3 py-1 font-sans text-xs text-primary group-hover:bg-primary/20 transition-colors">
                            {level.name} · {count} lesson
                            {count === 1 ? "" : "s"}
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-white/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function InboxSection({
  questions,
  allQuestions,
  onAnswered,
  loading,
  levelNameBySlug,
}: {
  questions: Question[];
  allQuestions: Question[];
  onAnswered: (q: Question) => void;
  loading: boolean;
  levelNameBySlug: (slug: string) => string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={20} className="text-primary" />
        <h2 className="font-display text-2xl text-white">
          ask the kaiako inbox
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="text-white/30 animate-spin" />
        </div>
      ) : questions.length === 0 ? (
        <div className="py-6">
          <p className="font-sans text-sm text-white/60">
            {allQuestions.length === 0
              ? "No questions yet. Student questions will land here when they use the Ask the Kaiako form on a lesson."
              : "You're all caught up — no unanswered questions."}
          </p>
        </div>
      ) : (
        <ul className="space-y-5">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onAnswered={onAnswered}
              levelNameBySlug={levelNameBySlug}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  onAnswered,
  levelNameBySlug,
}: {
  question: Question;
  onAnswered: (q: Question) => void;
  levelNameBySlug: (slug: string) => string;
}) {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || submitting) return;
    setSubmitting(true);
    const result = await answerQuestion({
      questionId: question.id,
      answer: reply.trim(),
    });
    setSubmitting(false);
    if (result) {
      setDone(true);
      onAnswered({ ...question, answer: reply.trim(), answered: true });
    }
  }

  const levelName = levelNameBySlug(question.levelSlug);

  return (
    <li className="rounded-xl border border-white/10 bg-midnight-tidal p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p className="font-sans text-sm font-semibold text-white">
          {question.studentName || "Unknown student"}
        </p>
        <p className="font-sans text-xs uppercase tracking-widest text-white/40">
          {levelName}
          {question.weekNumber ? ` · wk ${question.weekNumber}` : ""}
        </p>
      </div>
      <p className="font-sans text-white/80 leading-relaxed mb-4 whitespace-pre-line">
        {question.question}
      </p>

      {done ? (
        <div className="flex items-center gap-2 text-sm font-sans text-semantic-green">
          <Check size={16} />
          Reply sent
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block font-sans text-xs uppercase tracking-widest text-white/50">
            Your reply
          </label>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Kia ora — type your reply…"
            className="w-full rounded-lg bg-iron-depth border border-white/10 px-4 py-3 font-sans text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !reply.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-4 bg-primary text-white font-sans text-sm font-medium transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-primary"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {submitting ? "Sending…" : "Send reply"}
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

// Exported link helper kept for future use by the dashboard header.
export function TeacherDashboardLink() {
  return (
    <Link
      href="/dashboard/teacher"
      className="inline-flex items-center gap-2 font-sans text-sm text-primary hover:text-primary-light transition-colors"
    >
      Open kaiako dashboard →
    </Link>
  );
}
