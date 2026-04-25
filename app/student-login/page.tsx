"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function StudentLoginPage() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Student login attempt:", { username, pin });
  }

  const inputBase =
    "w-full bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-white text-lg placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-iron-depth flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105">
            <Image
              src="/images/main-logo-white.svg"
              alt="Ngaru Pou"
              width={200}
              height={44}
              priority
            />
          </Link>
        </div>

        <div className="bg-midnight-tidal border border-secondary/30 rounded-3xl p-8 md:p-10 shadow-xl">
          <h1 className="font-display text-4xl md:text-5xl text-white mb-2 text-center">
            kia ora!
          </h1>
          <p className="font-sans text-white/60 text-center mb-8">
            Sign in with your username and PIN to continue learning.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-base font-medium text-white/80 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your username"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-base font-medium text-white/80 mb-2">
                4-digit PIN
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                autoComplete="off"
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="••••"
                className={`${inputBase} tracking-[0.5em] text-center`}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-secondary hover:bg-lagoon-drift text-midnight-tidal font-bold text-lg transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5 mt-2"
            >
              Sign In
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-white/50 text-sm font-sans">
          Are you a parent?{" "}
          <Link
            href="/login"
            className="text-secondary hover:text-lagoon-drift font-medium inline-flex items-center gap-1 transition-colors"
          >
            Login here <ArrowRight size={13} />
          </Link>
        </p>
      </div>
    </div>
  );
}
