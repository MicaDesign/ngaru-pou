import { notFound } from "next/navigation";
import { Play, Download, FileText } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import LessonSidebar from "@/components/LessonSidebar";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import AskKaiakoForm from "@/components/AskKaiakoForm";
import { getLevelBySlug, getLessonsForLevel } from "@/lib/airtable";
import type { Lesson, ScheduleRow } from "@/lib/airtable";

type Props = { params: { slug: string; week: string } };

function bullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function ScheduleTable({ rows }: { rows: ScheduleRow[] }) {
  if (!rows.length) {
    return (
      <p className="font-sans text-sm text-white/40">
        No schedule set for this lesson yet.
      </p>
    );
  }
  return (
    <table className="w-full font-sans text-base">
      <thead>
        <tr className="border-b border-white/10">
          <th className="text-left py-3 pr-4 font-semibold text-white/50 text-sm uppercase tracking-widest w-24">
            Time
          </th>
          <th className="text-left py-3 font-semibold text-white/50 text-sm uppercase tracking-widest">
            Activity
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-white/5 last:border-b-0 align-top"
          >
            <td className="py-4 pr-4 text-primary font-medium whitespace-nowrap">
              {row.timeSlot}
            </td>
            <td className="py-4 text-white/85 leading-relaxed">
              {row.activity}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="font-display text-2xl text-white mb-4">{title}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="font-sans text-white/70 leading-relaxed flex gap-3"
          >
            <span className="text-primary shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LessonContent({
  lesson,
  lyricsUrl,
}: {
  lesson: Lesson;
  lyricsUrl: string;
}) {
  return (
    <div className="space-y-10">
      <div className="aspect-video w-full rounded-xl bg-iron-depth border border-white/5 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="relative flex flex-col items-center gap-3 text-white/50">
          <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <Play size={26} className="text-white ml-1" fill="currentColor" />
          </div>
          <p className="font-sans text-sm">
            {lesson.videos[0]?.title || "Video coming soon"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-primary shadow-xl shadow-primary/20 px-6 py-7 md:px-9 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/80">
            Week {lesson.weekNumber}
            {lesson.bracketBeingTaught ? ` · ${lesson.bracketBeingTaught}` : ""}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-white mt-2 leading-tight">
            {lesson.title}
          </h2>
        </div>
        <MarkCompleteButton lessonId={lesson.id} />
      </div>

      {lesson.warmUp && (
        <section>
          <h2 className="font-display text-2xl text-white mb-4">warm up</h2>
          <p className="font-sans text-white/70 leading-relaxed whitespace-pre-line">
            {lesson.warmUp}
          </p>
        </section>
      )}

      <Section title="objectives" items={bullets(lesson.objectives)} />
      <Section title="key features" items={bullets(lesson.keyFeatures)} />
      <Section title="key vocabulary" items={bullets(lesson.keyVocabulary)} />

      <section className="lg:hidden">
        <h2 className="font-display text-3xl text-white mb-5">schedule</h2>
        <ScheduleTable rows={lesson.schedule} />
      </section>

      {lesson.teacherNotes && (
        <section>
          <h2 className="font-display text-2xl text-white mb-4">
            teacher notes
          </h2>
          <p className="font-sans text-white/70 leading-relaxed whitespace-pre-line">
            {lesson.teacherNotes}
          </p>
        </section>
      )}

      {lyricsUrl && (
        <a
          href={lyricsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-sm text-primary hover:text-primary-light transition-colors"
        >
          <Download size={16} />
          Download lyrics
        </a>
      )}

      <section className="rounded-xl bg-iron-depth border border-white/5 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <FileText size={20} className="text-primary" />
          <h2 className="font-display text-2xl text-white">ask the kaiako</h2>
        </div>
        <AskKaiakoForm lessonId={lesson.id} />
      </section>
    </div>
  );
}

export default async function LessonPage({ params }: Props) {
  const weekNum = Number.parseInt(params.week, 10);
  if (!Number.isFinite(weekNum) || weekNum < 1) notFound();

  const level = await getLevelBySlug(params.slug);
  if (!level) notFound();

  const lessons = await getLessonsForLevel(level);
  const lesson = lessons.find((l) => l.weekNumber === weekNum);
  if (!lesson) notFound();
  // TODO: re-enable publish gate once Airtable "Is Published" is set per lesson.
  // if (!lesson.isPublished) notFound();

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal">
        <LessonSidebar
          levelSlug={level.slug}
          levelName={level.name}
          lessons={lessons}
          currentWeek={weekNum}
        />

        <div className="lg:ml-64">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 xl:gap-12 px-6 md:px-10 py-10">
            <main className="flex-1 min-w-0">
              <LessonContent
                lesson={lesson}
                lyricsUrl={lesson.lyricsDownloadUrl}
              />
            </main>

            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-28 rounded-xl bg-iron-depth border border-white/5 p-7">
                <h3 className="font-display text-2xl text-white mb-5">
                  schedule
                </h3>
                <ScheduleTable rows={lesson.schedule} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
