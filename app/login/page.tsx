"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, AlertCircle, AlertTriangle, CheckCircle,
  Loader2, X, Info,
} from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------
type LoginErrorType =
  | "email-not-found"
  | "invalid-password"
  | "email-not-verified"
  | "too-many-attempts"
  | { type: "general"; message: string }
  | null;

function parseLoginError(err: unknown): LoginErrorType {
  const e = err as Record<string, string>;
  const code = (e?.code ?? "").toLowerCase();
  const msg  = (e?.message ?? "").toLowerCase();

  if (code.includes("member-not-found") || code.includes("member_not_found") || msg.includes("not found"))
    return "email-not-found";
  if (code.includes("invalid-credentials") || code.includes("invalid_credentials"))
    return "invalid-password";
  if (code.includes("invalid-password") || msg.includes("password"))
    return "invalid-password";
  if (code.includes("email-not-verified") || code.includes("not_verified") || msg.includes("verif"))
    return "email-not-verified";
  if (code.includes("too-many") || code.includes("too_many") || msg.includes("too many") || msg.includes("rate"))
    return "too-many-attempts";
  return { type: "general", message: "Something went wrong. Please check your details and try again." };
}

// ---------------------------------------------------------------------------
// Reusable dismissible message boxes
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

function WarningBox({ children, onDismiss }: { children: React.ReactNode; onDismiss: () => void }) {
  return (
    <div className="animate-fade-up flex items-start gap-2 rounded-lg bg-semantic-yellow/10 border border-semantic-yellow/20 px-3 py-2.5">
      <AlertTriangle size={14} className="text-semantic-yellow mt-0.5 shrink-0" />
      <div className="flex-1 text-semantic-yellow text-xs leading-snug">{children}</div>
      <button type="button" onClick={onDismiss} className="text-semantic-yellow/50 hover:text-semantic-yellow transition-colors shrink-0 -mt-0.5 ml-1">
        <X size={13} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError]     = useState<LoginErrorType>(null);

  useEffect(() => {
    if (document.cookie.includes("_ms-mid")) router.push("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setSubmitting(true);

    try {
      const ms = getMemberstack()!;
      const result = await ms.loginMemberEmailPassword({ email, password });
      console.log("Auth success — full response:", JSON.stringify(result, null, 2));
      setLoginSuccess(true);
      setTimeout(() => {
        console.log("Redirecting to dashboard now");
        window.location.href = "/dashboard";
      }, 800);
    } catch (err: unknown) {
      console.log("Auth error full object:", JSON.stringify(err, null, 2));
      console.log("Auth error message:", (err as Record<string, string>)?.message);
      console.log("Auth error code:",   (err as Record<string, string>)?.code);
      console.log("Auth error type:",   (err as Record<string, string>)?.type);
      setLoginError(parseLoginError(err));
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-iron-depth flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-midnight-tidal border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl">

        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105">
            <Image src="/images/main-logo-white.svg" alt="Ngaru Pou" width={200} height={44} priority />
          </Link>
        </div>

        <h1 className="font-display text-4xl text-white mb-2">welcome back</h1>
        <p className="font-sans text-white/50 text-sm mb-6">
          Sign in to continue your learning journey
        </p>

        {/* Success banner */}
        {loginSuccess && (
          <div className="animate-fade-up flex items-center gap-2 mb-6 rounded-lg bg-semantic-green/10 border border-semantic-green/20 px-3 py-2.5">
            <CheckCircle size={14} className="text-semantic-green shrink-0" />
            <p className="text-semantic-green text-xs">Welcome back! Taking you to your dashboard…</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Email address</label>
            <input
              type="email"
              required
              disabled={submitting || loginSuccess}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError(null); }}
              placeholder="you@example.com"
              className={inputBase}
            />
            {loginError === "email-not-found" && (
              <div className="mt-2">
                <ErrorBox onDismiss={() => setLoginError(null)}>
                  No account found with this email.{" "}
                  <Link href="/signup" className="underline hover:no-underline">Sign up instead?</Link>
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
                disabled={submitting || loginSuccess}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
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
            {loginError === "invalid-password" && (
              <div className="mt-2">
                <ErrorBox onDismiss={() => setLoginError(null)}>
                  Incorrect password. Please try again.{" "}
                  <Link href="#" className="underline hover:no-underline">Forgot your password?</Link>
                </ErrorBox>
              </div>
            )}
          </div>

          {/* Email not verified — amber warning */}
          {loginError === "email-not-verified" && (
            <WarningBox onDismiss={() => setLoginError(null)}>
              <p>Please verify your email before logging in. Check your inbox for a verification link.</p>
              <button type="button" className="mt-1.5 flex items-center gap-1 text-semantic-yellow/80 hover:text-semantic-yellow transition-colors font-medium">
                <Info size={11} /> Resend verification email
              </button>
            </WarningBox>
          )}

          {/* Too many attempts or general error */}
          {(loginError === "too-many-attempts" || (loginError !== null && typeof loginError === "object")) && (
            <ErrorBox onDismiss={() => setLoginError(null)}>
              {loginError === "too-many-attempts"
                ? "Too many login attempts. Please wait a few minutes and try again."
                : (loginError as { type: "general"; message: string }).message}
            </ErrorBox>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || loginSuccess}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold transition-all duration-300 mt-1 disabled:cursor-not-allowed ${
              loginSuccess
                ? "bg-semantic-green text-white opacity-90"
                : "bg-primary hover:bg-primary-light text-white disabled:opacity-60"
            }`}
          >
            {loginSuccess ? (
              <><CheckCircle size={17} /> Signed in! Redirecting…</>
            ) : submitting ? (
              <><Loader2 size={17} className="animate-spin" /> Signing in…</>
            ) : "Log In"}
          </button>

        </form>

        <p className="text-center mt-4">
          <Link href="#" className="text-white/40 hover:text-primary text-sm transition-colors">
            Forgot your password?
          </Link>
        </p>

        <p className="text-center text-white/40 text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary-light font-medium transition-colors">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
