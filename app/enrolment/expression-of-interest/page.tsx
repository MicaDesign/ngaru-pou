"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { submitEoi } from "@/lib/settings";

export default function ExpressionOfInterestPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    childrenCount: "1",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) return;
    setSubmitting(true);
    setError("");
    try {
      await submitEoi(form);
      setDone(true);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="min-h-screen bg-midnight-tidal px-6 py-12 md:py-16 flex flex-col items-center">
      <Link href="/" className="mb-12 inline-block transition-transform duration-200 hover:scale-105">
        <Image src="/images/main-logo-white.svg" alt="Ngaru Pou" width={180} height={40} priority />
      </Link>

      <div className="w-full max-w-xl">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 font-sans text-sm text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        {done ? (
          <div className="bg-iron-depth border border-white/[0.11] rounded-2xl p-10 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-6">
              <CheckCircle size={32} />
            </div>
            <h1 className="font-display text-4xl text-white mb-3">kia ora!</h1>
            <p className="font-sans text-white/60 leading-relaxed mb-8">
              Thank you for your interest in Ngaru Pou. We&apos;ve received your details and will be in touch as soon as spaces become available.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-sans text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Return to home
            </Link>
          </div>
        ) : (
          <div className="bg-iron-depth border border-white/[0.11] rounded-2xl p-8 md:p-10">
            <h1 className="font-display text-4xl md:text-5xl text-white mb-3">
              register your interest
            </h1>
            <p className="font-sans text-white/60 leading-relaxed mb-8">
              Enrolments are currently closed for this year. Fill in your details below and we&apos;ll reach out when spaces open up.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs text-white/50 uppercase tracking-widest">First name *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className={inputClass}
                    placeholder="Jane"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs text-white/50 uppercase tracking-widest">Last name *</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className={inputClass}
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-white/50 uppercase tracking-widest">Email address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  placeholder="jane@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-white/50 uppercase tracking-widest">Phone number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="021 000 0000"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-white/50 uppercase tracking-widest">Number of children</label>
                <select
                  value={form.childrenCount}
                  onChange={(e) => update("childrenCount", e.target.value)}
                  className={inputClass + " appearance-none cursor-pointer"}
                >
                  <option value="1">1 child</option>
                  <option value="2">2 children</option>
                  <option value="3">3 children</option>
                  <option value="4+">4 or more children</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs text-white/50 uppercase tracking-widest">Anything else you&apos;d like us to know?</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={inputClass + " resize-none"}
                  placeholder="Ages of your children, level of interest, questions…"
                />
              </div>

              {error && (
                <p className="font-sans text-sm text-semantic-red">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !form.firstName || !form.lastName || !form.email}
                className="mt-2 w-full py-3 rounded-xl bg-primary text-white font-sans text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit expression of interest"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
