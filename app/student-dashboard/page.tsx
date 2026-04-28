import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, BookOpen, Target } from "lucide-react";
import { readStudentSessionFromCookies } from "@/lib/studentSession";
import { getLevelBySlug } from "@/lib/airtable";
import type { Level } from "@/lib/airtable";

const LEVEL_LABELS: Record<string, string> = {
  "te-pumanawa": "Te Pūmanawa",
  "te-pukenga-rau": "Te Pūkenga Rau",
  "te-pukenga": "Te Pūkenga",
};

export default async function StudentDashboardPage() {
  const session = readStudentSessionFromCookies();
  if (!session) {
    redirect("/student-login");
  }

  const level = session.level ? await getLevelBySlug(session.level) : null;

  return (
    <div className="min-h-screen bg-midnight-tidal">
      <div className="site-container py-10 md:py-16">
        <div className="flex justify-center mb-10">
          <Link
            href="/"
            className="inline-block transition-transform duration-200 hover:scale-105"
          >
            <Image
              src="/images/main-logo-white.svg"
              alt="Ngaru Pou"
              width={180}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Hero banner */}
        <div className="rounded-2xl bg-primary shadow-xl shadow-primary/20 px-7 py-8 md:px-10 md:py-10 mb-8">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/75 mb-2">
            Student dashboard
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white leading-[1.05]">
            kia ora{session.first_name ? `, ${session.first_name}` : ""}
          </h1>
          {level && (
            <p className="font-sans text-white/80 mt-3">
              You&apos;re enrolled in{" "}
              <span className="font-semibold text-white">{level.name}</span>
            </p>
          )}
        </div>

        {/* Level card */}
        {level ? (
          <LevelCard level={level} />
        ) : (
          <PlaceholderCard levelSlug={session.level} />
        )}

        <div className="flex justify-center mt-8">
          <form action="/api/student-logout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-2 font-sans text-sm text-white/50 hover:text-white transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function LevelCard({ level }: { level: Level }) {
  const thumbnail = level.thumbnail?.[0]?.url;
  const objectives = level.objectives
    ? level.objectives
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];

  return (
    <div className="rounded-2xl border border-white/10 bg-iron-depth overflow-hidden">
      {thumbnail && (
        <div className="relative aspect-[21/6] bg-midnight-tidal">
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-iron-depth via-iron-depth/30 to-transparent" />
        </div>
      )}

      <div className="p-7 md:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary mb-1">
              Your level
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white">
              {level.name}
            </h2>
          </div>
          {level.ageRange && (
            <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-3 py-1 font-sans text-xs text-primary">
              {level.ageRange}
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {objectives.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-primary shrink-0" />
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/60">
                  What you&apos;ll learn
                </p>
              </div>
              <ul className="space-y-2">
                {objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="font-sans text-sm text-white/75 leading-snug">
                      {obj}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-midnight-tidal p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-secondary shrink-0" />
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/60">
                Lessons
              </p>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Your lessons are being prepared by your kaiako and will be
              available here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard({ levelSlug }: { levelSlug: string }) {
  const label = LEVEL_LABELS[levelSlug] ?? levelSlug;
  return (
    <div className="rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-9">
      <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary mb-1">
        Your level
      </p>
      <h2 className="font-display text-3xl text-white mb-4">{label}</h2>
      <p className="font-sans text-sm text-white/60 leading-relaxed">
        Your lessons are being prepared by your kaiako and will be available
        here soon.
      </p>
    </div>
  );
}
