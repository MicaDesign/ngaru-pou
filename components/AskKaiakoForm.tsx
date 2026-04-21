"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export default function AskKaiakoForm({ lessonId }: { lessonId: string }) {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setStatus("sending");

    // TODO: wire to messaging endpoint in a future phase
    void lessonId;
    await new Promise((r) => setTimeout(r, 600));

    setStatus("sent");
    setQuestion("");
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
          if (status === "sent") setStatus("idle");
        }}
        rows={4}
        placeholder="Pātai mai — ask your kaiako anything about this lesson…"
        className="w-full rounded-lg bg-midnight-tidal border border-white/10 px-4 py-3 font-sans text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
      />
      <div className="flex items-center justify-between">
        <p className="font-sans text-xs text-white/40">
          {status === "sent"
            ? "Kia ora — your question has been sent."
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
