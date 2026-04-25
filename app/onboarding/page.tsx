import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Users, ArrowRight } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-midnight-tidal px-6 py-12 md:py-16 flex flex-col items-center">
        <Link href="/" className="mb-12 md:mb-16 inline-block transition-transform duration-200 hover:scale-105">
          <Image
            src="/images/main-logo-white.svg"
            alt="Ngaru Pou"
            width={200}
            height={44}
            priority
          />
        </Link>

        <div className="w-full max-w-4xl text-center mb-12 md:mb-16">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] tracking-[0.02em] mb-4">
            welcome to ngaru pou
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/60">
            To get started, let us know who you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Link
            href="/onboarding/kaiako-request"
            className="group relative bg-iron-depth border border-white/[0.11] rounded-2xl p-8 md:p-10 transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-1 hover:scale-105 hover:border-primary/50 hover:shadow-[0_18px_40px_rgba(5,10,28,0.4)]"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 transition-colors group-hover:bg-primary/20">
              <GraduationCap size={28} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-3">
              i am a kaiako
            </h2>
            <p className="font-sans text-white/60 leading-relaxed mb-6">
              Request teacher access to manage students and view all
              progress.
            </p>
            <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary transition-colors group-hover:text-primary-light">
              Request access
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>

          <Link
            href="/enrolment/welcome"
            className="group relative bg-iron-depth border border-white/[0.11] rounded-2xl p-8 md:p-10 transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-1 hover:scale-105 hover:border-primary/50 hover:shadow-[0_18px_40px_rgba(5,10,28,0.4)]"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 transition-colors group-hover:bg-primary/20">
              <Users size={28} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-3">
              i am a parent
            </h2>
            <p className="font-sans text-white/60 leading-relaxed mb-6">
              Enrol your children and manage their learning journey.
            </p>
            <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-primary transition-colors group-hover:text-primary-light">
              Begin enrolment
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
}
