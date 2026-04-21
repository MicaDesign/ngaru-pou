"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";
import {
  getAnsweredQuestionsForLesson,
  type Question,
} from "@/lib/questions";

type Props = {
  levelSlug: string;
  weekNumber: number;
};

export default function KaiakoReplies({ levelSlug, weekNumber }: Props) {
  const [replies, setReplies] = useState<Question[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const ms = getMemberstack();
      if (!ms) return;
      try {
        const { data: member } = await ms.getCurrentMember();
        if (!member || cancelled) return;
        const results = await getAnsweredQuestionsForLesson({
          studentId: member.id,
          levelSlug,
          weekNumber,
        });
        if (!cancelled) {
          setReplies(results);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [levelSlug, weekNumber]);

  if (!loaded || replies.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <MessageCircle size={20} className="text-primary" />
        <h2 className="font-display text-2xl text-white">
          replies from your kaiako
        </h2>
      </div>

      <ul className="space-y-4">
        {replies.map((q) => (
          <li
            key={q.id}
            className="rounded-xl border border-white/10 bg-iron-depth p-5 md:p-6 space-y-4"
          >
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-2">
                Your question
              </p>
              <p className="font-sans text-white/60 leading-relaxed whitespace-pre-line">
                {q.question}
              </p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 md:p-5">
              <p className="font-sans text-xs uppercase tracking-widest text-primary mb-2">
                Kaiako reply
              </p>
              <p className="font-sans text-white/90 leading-relaxed whitespace-pre-line">
                {q.answer}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
