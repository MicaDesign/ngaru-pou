"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function MarkCompleteButton({ lessonId }: { lessonId: string }) {
  const [done, setDone] = useState(false);

  // TODO Phase 6: persist to MemberStack custom fields keyed by lessonId
  void lessonId;

  return (
    <button
      onClick={() => setDone(true)}
      disabled={done}
      className={`inline-flex h-12 items-center gap-2 rounded-full pl-4 pr-5 font-sans text-sm font-semibold shadow-sm transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
        done
          ? "bg-white/90 text-primary cursor-default"
          : "bg-white text-primary hover:bg-salt-mist hover:-translate-y-0.5"
      }`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
        <Check size={14} className="text-primary" strokeWidth={3} />
      </span>
      {done ? "Lesson complete" : "Mark lesson complete"}
    </button>
  );
}
