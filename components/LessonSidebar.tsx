"use client";

import Link from "next/link";
import { Lock, Check } from "lucide-react";
import type { Lesson } from "@/lib/airtable";

type Props = {
  levelSlug: string;
  levelName: string;
  lessons: Lesson[];
  currentWeek?: number;
  completedWeeks?: number[];
};

export default function LessonSidebar({
  levelSlug,
  levelName,
  lessons,
  currentWeek,
  completedWeeks = [],
}: Props) {
  return (
    <aside className="w-full lg:w-64 lg:fixed lg:top-24 lg:bottom-0 lg:left-0 lg:overflow-y-auto bg-iron-depth border-r border-white/5 py-8">
      <div className="px-6 mb-6">
        <Link
          href={`/dashboard/levels/${levelSlug}`}
          className="font-sans text-sm uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
        >
          ← back to level
        </Link>
        <h2 className="font-display text-3xl text-white mt-3">{levelName}</h2>
      </div>

      <nav className="px-3">
        <ul>
          {lessons.map((lesson, idx) => {
            const isCurrent = lesson.weekNumber === currentWeek;
            const isDone = completedWeeks.includes(lesson.weekNumber);
            const isLocked = !lesson.isPublished;

            const statusDot = isLocked ? (
              <Lock size={14} className="shrink-0 text-white/30" />
            ) : isDone ? (
              <span
                aria-label="Completed"
                className="shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-semantic-green"
              >
                <Check size={10} className="text-midnight-tidal" strokeWidth={3} />
              </span>
            ) : (
              <span
                aria-label="Not yet completed"
                className="shrink-0 inline-block h-4 w-4 rounded-full border border-white/20"
              />
            );

            const content = (
              <div
                className={`group flex items-center gap-3 rounded-lg px-3 py-5 transition-colors ${
                  isCurrent
                    ? "bg-primary/20 text-white"
                    : isLocked
                      ? "text-white/30"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="font-sans text-base flex-1 truncate">
                  {lesson.title || "Untitled lesson"}
                </span>
                {statusDot}
              </div>
            );

            const separator = idx > 0 ? "border-t border-white/10" : "";

            return (
              <li key={lesson.id} className={separator}>
                {isLocked ? (
                  content
                ) : (
                  <Link
                    href={`/dashboard/levels/${levelSlug}/lessons/${lesson.weekNumber}`}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
