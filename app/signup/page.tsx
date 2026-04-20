"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

function getSignupError(err: unknown): string {
  const code = (err as Record<string, string>)?.code?.toLowerCase() ?? "";
  const msg = (err as Record<string, string>)?.message?.toLowerCase() ?? "";

  if (code.includes("email-already-in-use") || code.includes("email_already") || msg.includes("already") || msg.includes("exists"))
    return "An account with this email already exists. Would you like to log in instead?";
  if (code.includes("invalid-password-too-short") || code.includes("too-short") || code.includes("too_short") || msg.includes("too short") || msg.includes("8 char"))
    return "Your password must be at least 8 characters long.";
  if (code.includes("invalid-email") || code.includes("invalid_email") || msg.includes("invalid email"))
    return "Please enter a valid email address.";

  return "Something went wrong. Please try again.";
}

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect already-logged-in users without touching the SDK
  useEffect(() => {
    if (document.cookie.includes("_ms-mid")) {
      router.push("/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      const ms = getMemberstack()!;
      await ms.signupMemberEmailPassword({
        email,
        password,
        customFields: { firstName, lastName },
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      console.log("Auth error full object:", JSON.stringify(err, null, 2));
      console.log("Auth error message:", (err as Record<string, string>)?.message);
      console.log("Auth error code:", (err as Record<string, string>)?.code);
      console.log("Auth error type:", (err as Record<string, string>)?.type);
      setError(getSignupError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-iron-depth flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-midnight-tidal border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/main-logo-white.svg"
            alt="Ngaru Pou"
            width={200}
            height={44}
            priority
          />
        </div>

        <h1 className="font-display text-4xl text-white mb-2">start your journey</h1>
        <p className="font-sans text-white/50 text-sm mb-8">
          Create your account to begin learning
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                First name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tāne"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Last name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Māhuta"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-semantic-red/10 border border-semantic-red/20 px-3 py-2.5">
              <AlertCircle size={16} className="text-semantic-red mt-0.5 shrink-0" />
              <p className="text-semantic-red text-sm leading-snug">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-all duration-300 mt-2"
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
