"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";
import { createQuestion } from "@/lib/questions";

type Status = "idle" | "sending" | "sent" | "error";

type Props = {
  lessonId: string;
  levelSlug: string;
  weekNumber: number;
};

function pickName(member: {
  customFields?: Record<string, unknown>;
  auth?: { email?: string };
}): string {
  const cf = member.customFields ?? {};
  const first = typeof cf["first-name"] === "string" ? cf["first-name"] : "";
  const last = typeof cf["last-name"] === "string" ? cf["last-name"] : "";
  const full = [first, last].filter(Boolean).join(" ").trim();
  return full || member.auth?.email || "Unknown student";
}

export default function AskKaiakoForm({ levelSlug, weekNumber }: Props) {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setStatus("sending");

    try {
      const ms = getMemberstack();
      if (!ms) throw new Error("MemberStack unavailable");
      const { data: member } = await ms.getCurrentMember();
      if (!member) throw new Error("Not logged in");

      const result = await createQuestion({
        studentId: member.id,
        studentName: pickName(member),
        studentEmail: member.auth?.email ?? "",
        levelSlug,
        weekNumber,
        question: question.trim(),
      });

      if (!result) throw new Error("Failed to create question");

      setStatus("sent");
      setQuestion("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block font-sans text-xs uppercase tracking-widest text-white/50">
        Your question
      </label>
      <textarea
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          if (status === "sent" || status === "error") setStatus("idle");
        }}
        rows={4}
        placeholder="Pātai mai — ask your kaiako anything about this lesson…"
        className="w-full rounded-lg bg-midnight-tidal border border-white/10 px-4 py-3 font-sans text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
      />
      <div className="flex items-center justify-between">
        <p className="font-sans text-xs text-white/40">
          {status === "sent"
            ? "Kia ora — your question has been sent to your kaiako."
            : status === "error"
              ? "Something went wrong. Please try again."
              : "Your kaiako will respond within 24 hours."}
        </p>
        <button
          type="submit"
          disabled={status === "sending" || !question.trim()}
          className="inline-flex h-12 items-center gap-2 rounded-lg px-5 bg-primary text-white font-sans text-sm font-medium transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-primary"
        >
          {status === "sending" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {status === "sending" ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
