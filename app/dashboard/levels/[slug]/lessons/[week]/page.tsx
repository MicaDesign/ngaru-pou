import { notFound } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import LessonView from "@/components/LessonView";
import { getLevelBySlug, getLessonsForLevel } from "@/lib/airtable";

type Props = { params: { slug: string; week: string } };

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
      <LessonView level={level} lessons={lessons} lesson={lesson} />
    </AuthGuard>
  );
}
