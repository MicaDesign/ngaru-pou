"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { markLessonComplete } from "@/lib/progress";

type Props = {
  lessonId: string;
  levelSlug: string;
  weekNumber: number;
  initialCompleted?: boolean;
  onComplete?: () => void;
};

export default function MarkCompleteButton({
  lessonId,
  levelSlug,
  weekNumber,
  initialCompleted = false,
  onComplete,
}: Props) {
  const [done, setDone] = useState(initialCompleted);
  const [submitting, setSubmitting] = useState(false);

  async function handleClick() {
    if (done || submitting) return;
    setSubmitting(true);
    const result = await markLessonComplete({ lessonId, levelSlug, weekNumber });
    setSubmitting(false);
    if (result?.completed) {
      setDone(true);
      onComplete?.();
    }
  }

  const isDone = done || initialCompleted;

  return (
    <button
      onClick={handleClick}
      disabled={isDone || submitting}
      className={`inline-flex h-12 items-center gap-2 rounded-full pl-4 pr-5 font-sans text-sm font-semibold shadow-sm transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
        isDone
          ? "bg-white/90 text-primary cursor-default"
          : "bg-white text-primary hover:bg-salt-mist hover:-translate-y-0.5 disabled:opacity-75 disabled:hover:translate-y-0"
      }`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
        {submitting ? (
          <Loader2 size={14} className="text-primary animate-spin" />
        ) : (
          <Check size={14} className="text-primary" strokeWidth={3} />
        )}
      </span>
      {isDone
        ? "Lesson complete"
        : submitting
          ? "Marking complete…"
          : "Mark lesson complete"}
    </button>
  );
}
