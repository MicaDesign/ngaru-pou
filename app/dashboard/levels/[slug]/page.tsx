import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { getLevelBySlug, getLessonsForLevel } from "@/lib/airtable";

type Props = { params: { slug: string } };

// Mirrors the placeholder set used on the levels landing page.
const PLACEHOLDER_IMAGES = [
  "/images/maori-kapa-haka-group.avif",
  "/images/3-moari-girls.avif",
];

export default async function LevelPage({ params }: Props) {
  const level = await getLevelBySlug(params.slug);
  if (!level) notFound();

  const lessons = await getLessonsForLevel(level);

  const bullets = (text: string) =>
    text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal">
        <section className="site-container py-16 md:py-20">
          <Link
            href="/dashboard"
            className="font-sans text-xs uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
          >
            ← back to dashboard
          </Link>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 md:items-start gap-8 md:gap-10">
            <div className="md:col-span-2 relative aspect-square rounded-xl overflow-hidden bg-iron-depth">
              <Image
                src={
                  level.thumbnail?.[0]?.url ??
                  PLACEHOLDER_IMAGES[
                    level.order
                      ? (level.order - 1) % PLACEHOLDER_IMAGES.length
                      : 0
                  ]
                }
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain"
                priority
              />
            </div>

            <div className="md:col-span-3 flex flex-col gap-8">
              <div className="flex items-baseline gap-4 flex-wrap">
                <h1 className="font-display text-5xl md:text-6xl text-white">
                  {level.name}
                </h1>
                {level.ageRange && (
                  <span className="font-sans text-sm text-primary bg-primary/10 rounded-full px-3 py-1">
                    {level.ageRange}
                  </span>
                )}
              </div>

              {level.objectives && (
                <div>
                  <h2 className="font-display text-2xl text-white mb-4">
                    objectives
                  </h2>
                  <ul className="space-y-2">
                    {bullets(level.objectives).map((item, i) => (
                      <li
                        key={i}
                        className="font-sans text-white/70 leading-relaxed flex gap-3"
                      >
                        <span className="text-primary shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {level.keyFeatures && (
                <div>
                  <h2 className="font-display text-2xl text-white mb-4">
                    key features
                  </h2>
                  <ul className="space-y-2">
                    {bullets(level.keyFeatures).map((item, i) => (
                      <li
                        key={i}
                        className="font-sans text-white/70 leading-relaxed flex gap-3"
                      >
                        <span className="text-secondary shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="font-display text-3xl text-white mb-6">lessons</h2>

            {lessons.length === 0 ? (
              <p className="font-sans text-white/50">
                Lessons will appear here once they are published.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson) => {
                  const locked = !lesson.isPublished;
                  const card = (
                    <div
                      className={`group h-full rounded-xl border p-6 transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] ${
                        locked
                          ? "bg-iron-depth/40 border-white/5"
                          : "bg-iron-depth border-white/10 hover:border-primary hover:-translate-y-1"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`font-sans text-xs uppercase tracking-widest ${
                            locked ? "text-white/30" : "text-primary"
                          }`}
                        >
                          week {lesson.weekNumber}
                        </span>
                        {locked ? (
                          <Lock size={16} className="text-white/30" />
                        ) : (
                          <ArrowRight
                            size={18}
                            className="text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all"
                          />
                        )}
                      </div>
                      <h3
                        className={`font-display text-xl leading-tight ${
                          locked ? "text-white/40" : "text-white"
                        }`}
                      >
                        {lesson.title || "Untitled lesson"}
                      </h3>
                      {lesson.bracketBeingTaught && (
                        <p
                          className={`mt-3 font-sans text-sm ${
                            locked ? "text-white/30" : "text-white/60"
                          }`}
                        >
                          {lesson.bracketBeingTaught}
                        </p>
                      )}
                    </div>
                  );

                  if (locked) {
                    return (
                      <div key={lesson.id} aria-disabled="true">
                        {card}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/levels/${level.slug}/lessons/${lesson.weekNumber}`}
                    >
                      {card}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
