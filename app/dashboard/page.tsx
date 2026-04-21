import AuthGuard from "@/components/AuthGuard";
import DashboardView from "@/components/DashboardView";
import { getLevels, getLessonsBasic } from "@/lib/airtable";
import type { LessonBasic } from "@/lib/airtable";

export default async function DashboardPage() {
  const levels = await getLevels();

  const entries = await Promise.all(
    levels.map(
      async (level) => [level.slug, await getLessonsBasic(level)] as const,
    ),
  );
  const lessonsByLevel: Record<string, LessonBasic[]> = Object.fromEntries(entries);

  return (
    <AuthGuard>
      <DashboardView levels={levels} lessonsByLevel={lessonsByLevel} />
    </AuthGuard>
  );
}
