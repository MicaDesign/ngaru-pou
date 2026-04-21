import AuthGuard from "@/components/AuthGuard";
import TeacherDashboardView from "@/components/TeacherDashboardView";
import { getLevels } from "@/lib/airtable";

export default async function TeacherDashboardPage() {
  const levels = await getLevels();

  return (
    <AuthGuard>
      <TeacherDashboardView levels={levels} />
    </AuthGuard>
  );
}
