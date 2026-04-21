import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { getLevels } from "@/lib/airtable";
import type { Level } from "@/lib/airtable";

// Placeholder images cycle through the available assets until level-specific art is added.
const PLACEHOLDER_IMAGES = [
  "/images/maori-kapa-haka-group.avif",
  "/images/3-moari-girls.avif",
];

function bullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function LevelCard({ level, index }: { level: Level; index: number }) {
  const objectives = bullets(level.objectives).slice(0, 2);
  const image =
    level.thumbnail?.[0]?.url ??
    PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

  return (
    <Link
      href={`/dashboard/levels/${level.slug}`}
      className="group block rounded-2xl border border-white/20 overflow-hidden bg-midnight-tidal hover:border-primary transition-colors"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-80 aspect-[16/10] md:aspect-auto md:self-stretch shrink-0 bg-iron-depth">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover"
          />
        </div>

        <div className="flex-1 p-7 md:p-9 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-primary">
              Level {index + 1}
            </p>
            {level.ageRange && (
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-3 py-1 font-sans text-xs font-medium text-primary">
                {level.ageRange}
              </span>
            )}
          </div>

          <h2 className="font-display text-4xl md:text-5xl text-white leading-[1.05]">
            {level.name}
          </h2>

          {objectives.length > 0 && (
            <ul className="space-y-2">
              {objectives.map((item, i) => (
                <li
                  key={i}
                  className="font-sans text-white/70 leading-relaxed flex gap-3"
                >
                  <span className="text-primary shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          <span className="mt-auto inline-flex h-12 items-center gap-2 self-start rounded-lg bg-primary text-white font-sans font-medium px-5 transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] group-hover:bg-primary-light group-hover:-translate-y-0.5">
            Start learning
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function LevelsPage() {
  const levels = await getLevels();

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

          <h1 className="font-display text-5xl md:text-6xl text-white mt-6 mb-3">
            choose your level
          </h1>
          <p className="font-sans text-white/60 max-w-2xl leading-relaxed mb-12">
            Each level builds on the last. Start at the beginning or jump in
            wherever fits your tamariki.
          </p>

          {levels.length === 0 ? (
            <p className="font-sans text-white/50">
              Levels will appear here once they&apos;re added to Airtable.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {levels.map((level, i) => (
                <LevelCard key={level.id} level={level} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AuthGuard>
  );
}
