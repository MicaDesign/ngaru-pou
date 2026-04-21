"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, AlertCircle, Check, X, Loader2, Mail, Info,
} from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------
type SignupErrorType =
  | "email-exists"
  | "password-too-short"
  | "invalid-email"
  | { type: "general"; message: string }
  | null;

function parseSignupError(err: unknown): SignupErrorType {
  const code = (err as Record<string, string>)?.code?.toLowerCase() ?? "";
  const msg  = (err as Record<string, string>)?.message?.toLowerCase() ?? "";

  if (code.includes("email-already") || code.includes("email_already") || msg.includes("already") || msg.includes("exists"))
    return "email-exists";
  if (code.includes("too-short") || code.includes("too_short") || msg.includes("too short") || msg.includes("8 char"))
    return "password-too-short";
  if (code.includes("invalid-email") || code.includes("invalid_email") || msg.includes("invalid email"))
    return "invalid-email";
  return { type: "general", message: "Something went wrong. Please try again." };
}

// ---------------------------------------------------------------------------
// Password strength
// ---------------------------------------------------------------------------
function getPasswordStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.max(1, score) as 1 | 2 | 3 | 4;
}

const STRENGTH_LABEL  = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOUR = ["", "bg-semantic-red", "bg-semantic-yellow", "bg-secondary", "bg-semantic-green"];
const STRENGTH_TEXT   = ["", "text-semantic-red", "text-semantic-yellow", "text-secondary", "text-semantic-green"];

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const strength = getPasswordStrength(password);
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? STRENGTH_COLOUR[strength] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${STRENGTH_TEXT[strength]}`}>{STRENGTH_LABEL[strength]} password</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable error box (dismissible)
// ---------------------------------------------------------------------------
function ErrorBox({ children, onDismiss }: { children: React.ReactNode; onDismiss: () => void }) {
  return (
    <div className="animate-fade-up flex items-start gap-2 rounded-lg bg-semantic-red/10 border border-semantic-red/20 px-3 py-2.5">
      <AlertCircle size={14} className="text-semantic-red mt-0.5 shrink-0" />
      <div className="flex-1 text-semantic-red text-xs leading-snug">{children}</div>
      <button type="button" onClick={onDismiss} className="text-semantic-red/50 hover:text-semantic-red transition-colors shrink-0 -mt-0.5 ml-1">
        <X size={13} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success screen
// ---------------------------------------------------------------------------
function SuccessScreen({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div className="animate-fade-up flex flex-col items-center text-center gap-4 py-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Mail size={28} className="text-primary" />
      </div>

      <div>
        <h2 className="font-display text-3xl text-white mb-1">check your email</h2>
        <p className="text-white/50 text-sm">
          We sent a verification link to
        </p>
        <p className="text-secondary font-semibold text-sm mt-0.5">{email}</p>
      </div>

      <div className="w-full flex items-start gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-left">
        <Info size={14} className="text-white/40 mt-0.5 shrink-0" />
        <p className="text-white/50 text-xs leading-snug">
          The verification link expires in 24 hours. Check your spam folder if you don&apos;t see it.
        </p>
      </div>

      <Link
        href="/login"
        className="w-full flex items-center justify-center py-3 rounded-lg border border-white/20 text-white/70 hover:border-white/40 hover:text-white font-semibold text-sm transition-all duration-200"
      >
        Back to Login
      </Link>

      <button
        type="button"
        onClick={onReset}
        className="text-white/30 hover:text-white/60 text-xs transition-colors"
      >
        Wrong email? Go back
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const inputBase =
  "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

export default function SignupPage() {
  const router = useRouter();

  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]         = useState("");
  const [email,           setEmail]            = useState("");
  const [emailError,      setEmailError]       = useState("");
  const [password,        setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword]  = useState("");
  const [showPassword,    setShowPassword]     = useState(false);
  const [showConfirm,     setShowConfirm]      = useState(false);
  const [submitting,      setSubmitting]       = useState(false);
  const [signupError,     setSignupError]      = useState<SignupErrorType>(null);
  const [signupDone,      setSignupDone]       = useState(false);

  useEffect(() => {
    if (document.cookie.includes("_ms-mid")) router.push("/dashboard");
  }, [router]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  function validateEmail(value: string) {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailError) return;
    if (password !== confirmPassword) return;

    setSignupError(null);
    setSubmitting(true);
    try {
      const ms = getMemberstack()!;
      await ms.signupMemberEmailPassword({
        email,
        password,
        plans: [{ planId: "pln_free-plan-gt6r0336" }],
        customFields: { firstName, lastName },
      });
      setSignupDone(true);
    } catch (err: unknown) {
      console.log("Auth error full object:", JSON.stringify(err, null, 2));
      console.log("Auth error message:", (err as Record<string, string>)?.message);
      console.log("Auth error code:",   (err as Record<string, string>)?.code);
      console.log("Auth error type:",   (err as Record<string, string>)?.type);
      setSignupError(parseSignupError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (signupDone) {
    return (
      <div className="min-h-screen bg-iron-depth flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-midnight-tidal border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl">
          <div className="flex justify-center mb-8">
            <Image src="/images/main-logo-white.svg" alt="Ngaru Pou" width={200} height={44} priority />
          </div>
          <SuccessScreen email={email} onReset={() => setSignupDone(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-iron-depth flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-midnight-tidal border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl">
        <div className="flex justify-center mb-8">
          <Image src="/images/main-logo-white.svg" alt="Ngaru Pou" width={200} height={44} priority />
        </div>

        <h1 className="font-display text-4xl text-white mb-2">start your journey</h1>
        <p className="font-sans text-white/50 text-sm mb-8">
          Create your account to begin learning
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-1.5">First name</label>
              <input
                type="text"
                required
                disabled={submitting}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tāne"
                className={inputBase}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-1.5">Last name</label>
              <input
                type="text"
                required
                disabled={submitting}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Māhuta"
                className={inputBase}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Email address</label>
            <input
              type="email"
              required
              disabled={submitting}
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (signupError === "email-exists" || signupError === "invalid-email") setSignupError(null); setEmailError(""); }}
              onBlur={(e) => validateEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputBase}
            />
            {emailError && (
              <p className="animate-fade-up mt-1.5 text-xs text-semantic-red">{emailError}</p>
            )}
            {signupError === "email-exists" && (
              <div className="mt-2">
                <ErrorBox onDismiss={() => setSignupError(null)}>
                  An account with this email already exists.{" "}
                  <Link href="/login" className="underline hover:no-underline">Log in instead?</Link>
                </ErrorBox>
              </div>
            )}
            {signupError === "invalid-email" && (
              <div className="mt-2">
                <ErrorBox onDismiss={() => setSignupError(null)}>
                  Please enter a valid email address.
                </ErrorBox>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={submitting}
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (signupError === "password-too-short") setSignupError(null); }}
                placeholder="••••••••"
                className={`${inputBase} pr-12`}
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
            <PasswordStrengthBar password={password} />
            {signupError === "password-too-short" && (
              <div className="mt-2">
                <ErrorBox onDismiss={() => setSignupError(null)}>
                  Password must be at least 8 characters long.
                </ErrorBox>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                disabled={submitting}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputBase} pr-12`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {confirmPassword.length > 0 && (
                  passwordsMatch
                    ? <Check size={16} className="text-semantic-green" />
                    : <X size={16} className="text-semantic-red" />
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="text-white/40 hover:text-white/70 transition-colors ml-1"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {passwordsMismatch && (
              <p className="animate-fade-up mt-1.5 text-xs text-semantic-red">Passwords do not match.</p>
            )}
          </div>

          {/* General error */}
          {signupError !== null && typeof signupError === "object" && signupError.type === "general" && (
            <ErrorBox onDismiss={() => setSignupError(null)}>
              {signupError.message}
            </ErrorBox>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || passwordsMismatch || !!emailError}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-all duration-300 mt-2"
          >
            {submitting ? (
              <><Loader2 size={17} className="animate-spin" /> Creating account…</>
            ) : "Create Account"}
          </button>

        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
