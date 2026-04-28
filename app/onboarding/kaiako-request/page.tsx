"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { useMember } from "@/components/MemberstackProvider";
import { getMemberstack } from "@/lib/memberstack";
import { createKaiakoProfile } from "@/lib/kaiakoProfiles";

export default function KaiakoRequestPage() {
  return (
    <AuthGuard>
      <KaiakoRequestForm />
    </AuthGuard>
  );
}

function KaiakoRequestForm() {
  const { member } = useMember();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!member) return;
    const first = typeof member.customFields?.["first-name"] === "string"
      ? member.customFields["first-name"]
      : "";
    const last = typeof member.customFields?.["last-name"] === "string"
      ? member.customFields["last-name"]
      : "";
    if (first) setFirstName(first);
    if (last) setLastName(last);
    if (member.auth?.email) setEmail(member.auth.email);
  }, [member]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const ms = getMemberstack();
      if (!ms) throw new Error("Sign-in service unavailable. Please refresh.");

      const { data: me } = await ms.getCurrentMember();
      if (!me?.id) throw new Error("Could not load your account. Please refresh and try again.");

      const ok = await createKaiakoProfile({
        memberId: me.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        experience: experience.trim(),
      });

      if (!ok) throw new Error("Could not save your request. Please try again.");

      setSubmitted(true);
    } catch (err) {
      console.error("kaiako-request submit failed", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-iron-depth flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-midnight-tidal border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl">
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105">
            <Image
              src="/images/main-logo-white.svg"
              alt="Ngaru Pou"
              width={180}
              height={40}
              priority
            />
          </Link>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-semantic-green/15 text-semantic-green mb-5">
              <CheckCircle size={28} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-white mb-3">
              request received
            </h1>
            <p className="font-sans text-white/60 leading-relaxed mb-6">
              Your request has been received. Current kaiako will review your
              application and you will be notified once approved.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary hover:bg-primary-light text-white font-sans font-medium text-sm transition-colors"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl md:text-4xl text-white mb-2">
              request kaiako access
            </h1>
            <p className="font-sans text-white/50 text-sm mb-6">
              Tell us a little about yourself so the current kaiako can review
              your request.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={submitting}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={submitting}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  disabled={submitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Tell us about your experience with Te Ao Haka and kaiako
                  roles
                </label>
                <textarea
                  required
                  disabled={submitting}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Your background, involvement with kapa haka, any tutoring or teaching experience…"
                  rows={6}
                  className={inputBase}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-semantic-red/10 border border-semantic-red/25 px-4 py-3">
                  <AlertCircle size={16} className="text-semantic-red mt-0.5 shrink-0" />
                  <span className="block text-semantic-red text-sm leading-snug">
                    {error}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Sending request…
                  </>
                ) : (
                  "Submit request"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
