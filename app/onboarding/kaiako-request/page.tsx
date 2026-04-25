"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { useMember } from "@/components/MemberstackProvider";

export default function KaiakoRequestPage() {
  return (
    <AuthGuard>
      <KaiakoRequestForm />
    </AuthGuard>
  );
}

function KaiakoRequestForm() {
  const { member } = useMember();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!member) return;
    const first = member.customFields?.["first-name"] ?? "";
    const last = member.customFields?.["last-name"] ?? "";
    const combined = `${first} ${last}`.trim();
    if (combined) setFullName(combined);
    if (member.auth?.email) setEmail(member.auth.email);
  }, [member]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
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
              Your request has been received. Current kaiako will review
              your application and you will be notified by email.
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
              Tell us a little about yourself so the current kaiako can
              review your request.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className={inputBase}
                />
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
                  Tell us about your experience with Te Ao Haka and
                  kaiako roles
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-primary hover:bg-primary-light text-white font-semibold transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Sending
                    request…
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
