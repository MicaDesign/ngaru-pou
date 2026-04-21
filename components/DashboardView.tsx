"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";
import { getCompletedWeeksForLevel } from "@/lib/progress";
import { isKaiako } from "@/lib/kaiako";
import { ensureStudentRegistered } from "@/lib/studentRegistry";
import TeacherDashboardView from "./TeacherDashboardView";
import type { Level, LessonBasic } from "@/lib/airtable";

type Props = {
  levels: Level[];
  lessonsByLevel: Record<string, LessonBasic[]>;
};

type Member = {
  auth?: { email?: string };
  customFields?: Record<string, unknown>;
  planConnections?: { planId?: string; active?: boolean }[];
} | null;

const PLACEHOLDER_IMAGES = [
  "/images/maori-kapa-haka-group.avif",
  "/images/3-moari-girls.avif",
];

function getFirstName(member: Member): string {
  const cf = member?.customFields;
  const v = cf?.["first-name"];
  if (typeof v === "string" && v.trim()) return v.trim();
  const email = member?.auth?.email ?? "";
  return email.split("@")[0] ?? "";
}

function pickImage(level: Level, fallbackIndex: number): string {
  if (level.thumbnail?.[0]?.url) return level.thumbnail[0].url;
  const idx = level.order
    ? (level.order - 1) % PLACEHOLDER_IMAGES.length
    : fallbackIndex % PLACEHOLDER_IMAGES.length;
  return PLACEHOLDER_IMAGES[idx];
}

export default function DashboardView({ levels, lessonsByLevel }: Props) {
  const [member, setMember] = useState<Member>(null);
  const [planChecked, setPlanChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedByLevel, setCompletedByLevel] = useState<
    Record<string, number[]>
  >({});

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
        setMember(data);
        setPlanChecked(true);

        if (isKaiako(data)) {
          // TeacherDashboardView handles its own data loading — stop here.
          return;
        }

        // Fire-and-forget: keep the student_registry up to date.
        ensureStudentRegistered(data).catch(() => {});

        const results = await Promise.all(
          levels.map(async (level) => {
            const weeks = await getCompletedWeeksForLevel(level.slug);
            return [level.slug, weeks] as const;
          }),
        );
        if (cancelled) return;

        const map: Record<string, number[]> = {};
        for (const [slug, weeks] of results) map[slug] = weeks;
        setCompletedByLevel(map);
        setLoading(false);
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [levels]);

  if (planChecked && isKaiako(member)) {
    return <TeacherDashboardView levels={levels} />;
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal flex items-center justify-center">
        <Loader2 size={28} className="text-white/30 animate-spin" />
      </div>
    );
  }

  const firstName = getFirstName(member);
  const totalCompleted = Object.values(completedByLevel).reduce(
    (sum, weeks) => sum + weeks.length,
    0,
  );
  const hasProgress = totalCompleted > 0;

  const currentLevel = hasProgress
    ? ([...levels]
        .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
        .find((l) => (completedByLevel[l.slug] ?? []).length > 0) ?? null)
    : null;

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal">
      {hasProgress && currentLevel ? (
        <ContinueView
          firstName={firstName}
          currentLevel={currentLevel}
          lessons={lessonsByLevel[currentLevel.slug] ?? []}
          completedWeeks={completedByLevel[currentLevel.slug] ?? []}
        />
      ) : (
        <GetStartedView firstName={firstName} levels={levels} />
      )}
    </div>
  );
}

function GetStartedView({
  firstName,
  levels,
}: {
  firstName: string;
  levels: Level[];
}) {
  return (
    <section className="site-container py-16 md:py-20">
      <div className="max-w-3xl mb-12">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary mb-3">
          Get started
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-[1.05]">
          {firstName ? `kia ora, ${firstName}` : "kia ora"}
        </h1>
        <p className="font-sans text-lg text-white/60 leading-relaxed">
          Your learning journey starts here. Pick a level below to begin.
        </p>
      </div>

      {levels.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((level, i) => (
            <LevelMiniCard key={level.id} level={level} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

function LevelMiniCard({ level, index }: { level: Level; index: number }) {
  const image = pickImage(level, index);
  return (
    <Link
      href={`/dashboard/levels/${level.slug}`}
      className="group flex flex-col rounded-xl border border-white/20 bg-midnight-tidal overflow-hidden hover:border-primary transition-colors"
    >
      <div className="relative aspect-[16/10] bg-iron-depth">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col gap-3">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary">
          Level {level.order ?? index + 1}
        </p>
        <h3 className="font-display text-2xl text-white leading-tight">
          {level.name}
        </h3>
        {level.ageRange && (
          <span className="inline-flex self-start items-center rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 font-sans text-xs font-medium text-primary">
            {level.ageRange}
          </span>
        )}
        <span className="mt-auto inline-flex items-center gap-2 font-sans text-sm font-semibold text-primary pt-2">
          Start learning
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

function ContinueView({
  firstName,
  currentLevel,
  lessons,
  completedWeeks,
}: {
  firstName: string;
  currentLevel: Level;
  lessons: LessonBasic[];
  completedWeeks: number[];
}) {
  const publishedLessons = lessons.filter((l) => l.isPublished);
  const totalPublished = publishedLessons.length;
  const completedCount = completedWeeks.length;

  const nextLesson = publishedLessons
    .filter((l) => !completedWeeks.includes(l.weekNumber))
    .sort((a, b) => a.weekNumber - b.weekNumber)[0];

  return (
    <section className="site-container py-16 md:py-20">
      <div className="rounded-2xl bg-primary shadow-xl shadow-primary/20 px-7 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/75 mb-2">
            Continue learning
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white leading-[1.05]">
            welcome back{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="font-sans text-white/85 mt-3">
            You&apos;re working through{" "}
            <span className="font-semibold text-white">
              {currentLevel.name}
            </span>
            {totalPublished > 0 && (
              <>
                {" — "}
                {completedCount} of {totalPublished} lessons complete
              </>
            )}
          </p>
        </div>

        {nextLesson ? (
          <Link
            href={`/dashboard/levels/${currentLevel.slug}/lessons/${nextLesson.weekNumber}`}
            className="inline-flex h-12 items-center gap-2 self-start md:self-auto shrink-0 rounded-full bg-white text-primary font-sans font-semibold pl-5 pr-4 shadow-sm transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-salt-mist hover:-translate-y-0.5"
          >
            Continue learning
            <ArrowRight size={18} />
          </Link>
        ) : (
          <Link
            href="/dashboard/levels"
            className="inline-flex h-12 items-center gap-2 self-start md:self-auto shrink-0 rounded-full bg-white text-primary font-sans font-semibold pl-5 pr-4 shadow-sm transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-salt-mist hover:-translate-y-0.5"
          >
            View all levels
            <ArrowRight size={18} />
          </Link>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-9">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary mb-1">
              Your current level
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              {currentLevel.name}
            </h2>
          </div>
          <Link
            href={`/dashboard/levels/${currentLevel.slug}`}
            className="font-sans text-sm text-primary hover:text-primary-light transition-colors"
          >
            View level overview →
          </Link>
        </div>

        <ul className="divide-y divide-white/10">
          {lessons.map((lesson) => {
            const isDone = completedWeeks.includes(lesson.weekNumber);
            const isLocked = !lesson.isPublished;
            const isNext =
              !isDone &&
              !isLocked &&
              nextLesson?.weekNumber === lesson.weekNumber;

            const row = (
              <div
                className={`flex items-center gap-4 py-4 transition-colors ${
                  isLocked
                    ? "text-white/30"
                    : isNext
                      ? "text-white"
                      : isDone
                        ? "text-white/85"
                        : "text-white/70"
                }`}
              >
                {isDone ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-semantic-green shrink-0">
                    <Check
                      size={12}
                      className="text-midnight-tidal"
                      strokeWidth={3}
                    />
                  </span>
                ) : isNext ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary shrink-0">
                    <ArrowRight
                      size={12}
                      className="text-white"
                      strokeWidth={3}
                    />
                  </span>
                ) : (
                  <span
                    className={`inline-block h-6 w-6 rounded-full border shrink-0 ${
                      isLocked ? "border-white/15" : "border-white/25"
                    }`}
                  />
                )}

                <span className="font-sans text-xs uppercase tracking-widest w-14 shrink-0 opacity-70">
                  wk {lesson.weekNumber}
                </span>

                <span className="font-sans text-base flex-1 truncate">
                  {lesson.title || "Untitled lesson"}
                </span>

                {isNext && (
                  <span className="font-sans text-xs uppercase tracking-widest text-primary shrink-0">
                    next
                  </span>
                )}
              </div>
            );

            return (
              <li key={lesson.id}>
                {isLocked ? (
                  row
                ) : (
                  <Link
                    href={`/dashboard/levels/${currentLevel.slug}/lessons/${lesson.weekNumber}`}
                    className="block -mx-3 px-3 rounded hover:bg-white/[0.03] transition-colors"
                  >
                    {row}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
