"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  Users,
  ShieldAlert,
  AtSign,
  Cake,
  ArrowRight,
  HeartPulse,
} from "lucide-react";
import { getMemberstack } from "@/lib/memberstack";
import { isParent } from "@/lib/parent";
import {
  getChildrenForParent,
  ageInYears,
  fullName,
  type ChildProfile,
} from "@/lib/studentProfiles";
import type { Level } from "@/lib/airtable";

type Props = {
  levels: Level[];
};

type Member = {
  id?: string;
  auth?: { email?: string };
  customFields?: Record<string, unknown>;
  planConnections?: {
    planId?: string;
    active?: boolean;
    payment?: { priceId?: string } | null;
  }[];
} | null;

function getFirstName(member: Member): string {
  const cf = member?.customFields;
  const v = cf?.["first-name"];
  if (typeof v === "string" && v.trim()) return v.trim();
  const email = member?.auth?.email ?? "";
  return email.split("@")[0] ?? "";
}

export default function ParentDashboardView({ levels }: Props) {
  const [member, setMember] = useState<Member>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const ms = getMemberstack();
    if (!ms) {
      window.location.href = "/login";
      return;
    }

    async function run() {
      try {
        const { data } = await ms.getCurrentMember();
        if (!data) {
          window.location.href = "/login";
          return;
        }
        if (cancelled) return;

        if (!isParent(data)) {
          setDenied(true);
          setAuthLoading(false);
          window.location.href = "/dashboard";
          return;
        }

        setMember(data);
        setAuthLoading(false);

        if (!data.id) {
          setDataLoading(false);
          return;
        }

        const kids = await getChildrenForParent(data.id);
        if (cancelled) return;
        setChildren(kids);
        setDataLoading(false);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setAuthLoading(false);
          setDataLoading(false);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const levelBySlug = useMemo(() => {
    const map: Record<string, Level> = {};
    for (const l of levels) map[l.slug] = l;
    return map;
  }, [levels]);

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal flex items-center justify-center">
        <Loader2 size={28} className="text-white/30 animate-spin" />
      </div>
    );
  }

  if (denied) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <ShieldAlert size={36} className="text-semantic-yellow mx-auto mb-4" />
          <h1 className="font-display text-3xl text-white mb-2">
            redirecting…
          </h1>
          <p className="font-sans text-white/60">
            The parent dashboard is for enrolled whānau only.
          </p>
        </div>
      </div>
    );
  }

  const firstName = getFirstName(member);

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal">
      <section className="site-container py-16 md:py-20">
        <div className="rounded-2xl bg-primary shadow-xl shadow-primary/20 px-7 py-8 md:px-10 md:py-10">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/75 mb-2">
            Parent dashboard
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white leading-[1.05]">
            kia ora{firstName ? `, ${firstName}` : ""}
          </h1>
          <div className="mt-4 flex flex-wrap gap-5 text-sm font-sans text-white/85">
            <span className="inline-flex items-center gap-2">
              <Users size={14} />
              {children.length} tamaiti enrolled
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users size={20} className="text-primary" />
            <h2 className="font-display text-2xl text-white">your tamariki</h2>
          </div>

          {dataLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="text-white/30 animate-spin" />
            </div>
          ) : children.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {children.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  level={levelBySlug[child.level]}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-white/10 bg-midnight-tidal p-6">
      <p className="font-sans text-sm text-white/60 leading-relaxed mb-4">
        No tamariki on file yet. If you&apos;ve just paid, your child profiles
        may still be saving — refresh in a moment, or finish the enrolment flow
        below.
      </p>
      <Link
        href="/enrolment/child-details"
        className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-light text-white font-sans text-sm font-semibold px-4 py-2.5 transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:-translate-y-0.5"
      >
        Add child details
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function ChildCard({
  child,
  level,
}: {
  child: ChildProfile;
  level?: Level;
}) {
  const age = ageInYears(child.dateOfBirth);
  const thumbnail = level?.thumbnail?.[0]?.url;

  return (
    <div className="rounded-xl border border-white/10 bg-midnight-tidal overflow-hidden">
      <div className="relative aspect-[16/8] bg-iron-depth">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-tidal via-midnight-tidal/40 to-transparent" />
        <div className="absolute left-5 bottom-4 right-5">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-primary mb-1">
            {level?.name ?? child.level}
          </p>
          <h3 className="font-display text-2xl text-white leading-tight">
            {fullName(child)}
          </h3>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <ul className="space-y-2 font-sans text-sm text-white/75">
          {age !== null && (
            <li className="inline-flex items-center gap-2">
              <Cake size={14} className="text-primary shrink-0" />
              {age} {age === 1 ? "year" : "years"} old
            </li>
          )}
          {child.username && (
            <li className="inline-flex items-center gap-2">
              <AtSign size={14} className="text-primary shrink-0" />
              <span className="truncate">{child.username}</span>
            </li>
          )}
          {level?.ageRange && (
            <li className="inline-flex items-center gap-2 text-white/55">
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-xs text-primary">
                {level.ageRange}
              </span>
            </li>
          )}
        </ul>

        {child.medicalNotes && (
          <div className="flex items-start gap-2 rounded-lg bg-semantic-yellow/10 border border-semantic-yellow/25 px-3 py-2.5">
            <HeartPulse
              size={14}
              className="text-semantic-yellow mt-0.5 shrink-0"
            />
            <p className="font-sans text-xs text-white/80 leading-snug">
              <span className="block uppercase tracking-widest text-[10px] text-semantic-yellow mb-0.5">
                Medical notes
              </span>
              {child.medicalNotes}
            </p>
          </div>
        )}

        {level && (
          <Link
            href={`/dashboard/levels/${level.slug}`}
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-primary hover:text-primary-light transition-colors pt-1"
          >
            View {level.name} curriculum
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
