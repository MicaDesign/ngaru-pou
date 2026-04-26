import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { readStudentSessionFromCookies } from "@/lib/studentSession";

const LEVEL_LABELS: Record<string, string> = {
  "te-pumanawa": "Te Pūmanawa",
  "te-pukenga-rau": "Te Pūkenga Rau",
  "te-pukenga": "Te Pūkenga",
};

export default function StudentDashboardPage() {
  const session = readStudentSessionFromCookies();
  if (!session) {
    redirect("/student-login");
  }

  const greetingName =
    session.first_name?.trim() || session.username || "";
  const levelLabel = LEVEL_LABELS[session.level] ?? session.level;

  return (
    <div className="min-h-screen bg-iron-depth flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <div className="flex justify-center mb-8">
          <Link
            href="/"
            className="inline-block transition-transform duration-200 hover:scale-105"
          >
            <Image
              src="/images/main-logo-white.svg"
              alt="Ngaru Pou"
              width={200}
              height={44}
              priority
            />
          </Link>
        </div>

        <div className="bg-midnight-tidal border border-secondary/30 rounded-3xl p-8 md:p-12 shadow-xl text-center">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-secondary mb-3">
            Student dashboard
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-[1.05]">
            kia ora{greetingName ? `, ${greetingName}` : ""}
          </h1>

          {levelLabel && (
            <span className="inline-flex items-center rounded-full bg-secondary/10 border border-secondary/30 px-3 py-1 font-sans text-xs text-secondary mb-6">
              {levelLabel}
            </span>
          )}

          <p className="font-sans text-white/65 text-lg leading-relaxed max-w-md mx-auto">
            Your learning dashboard is coming soon.
          </p>
        </div>

        <div className="flex justify-center mt-6">
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
