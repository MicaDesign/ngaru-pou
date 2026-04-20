"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";

function getLoginError(err: unknown): string {
  const code = (err as Record<string, string>)?.code?.toLowerCase() ?? "";
  const msg = (err as Record<string, string>)?.message?.toLowerCase() ?? "";

  if (code.includes("member-not-found") || code.includes("member_not_found") || msg.includes("not found"))
    return "No account found with that email address. Would you like to sign up?";
  if (code.includes("invalid-credentials") || code.includes("invalid_credentials"))
    return "Incorrect email or password. Please try again or reset your password.";
  if (code.includes("invalid-password") || code.includes("invalid_password") || msg.includes("password"))
    return "Incorrect password. Please try again or reset your password.";
  if (code.includes("email-not-verified") || code.includes("email_not_verified") || msg.includes("verif"))
    return "Please verify your email before logging in. Check your inbox for a verification link.";
  if (code.includes("too-many") || code.includes("too_many") || msg.includes("too many"))
    return "Too many login attempts. Please wait a few minutes and try again.";

  return "Something went wrong. Please check your details and try again.";
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    setSubmitting(true);
    try {
      const ms = getMemberstack()!;
      await ms.loginMemberEmailPassword({ email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      console.log("Auth error full object:", JSON.stringify(err, null, 2));
      console.log("Auth error message:", (err as Record<string, string>)?.message);
      console.log("Auth error code:", (err as Record<string, string>)?.code);
      console.log("Auth error type:", (err as Record<string, string>)?.type);
      setError(getLoginError(err));
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

        <h1 className="font-display text-4xl text-white mb-2">welcome back</h1>
        <p className="font-sans text-white/50 text-sm mb-8">
          Sign in to continue your learning journey
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {submitting ? "Signing in…" : "Log In"}
          </button>
        </form>

        <p className="text-center mt-4">
          <Link
            href="#"
            className="text-white/40 hover:text-primary text-sm transition-colors"
          >
            Forgot your password?
          </Link>
        </p>

        <p className="text-center text-white/40 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
