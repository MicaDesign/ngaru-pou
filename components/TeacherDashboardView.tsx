"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Users,
  MessageSquare,
  Send,
  Check,
  ShieldAlert,
  UserCheck,
  X,
  AtSign,
  Cake,
  HeartPulse,
  Settings,
  MailOpen,
  Phone,
  Baby,
} from "lucide-react";
import {
  setEnrollmentOpen,
  getSiteSettings,
  saveAnnouncementSettings,
  getAllEois,
  type EoiEntry,
  type SiteSettings,
} from "@/lib/settings";
import {
  getMemberAvatarUrl,
  uploadMemberAvatar,
  getAllStudentAvatarUrls,
} from "@/lib/avatars";
import AvatarUpload from "@/components/AvatarUpload";
import Avatar from "@/components/Avatar";
import { getMemberstack } from "@/lib/memberstack";
import { isKaiako } from "@/lib/kaiako";
import {
  getAllQuestions,
  answerQuestion,
  type Question,
} from "@/lib/questions";
import {
  getPendingKaiakoProfiles,
  updateKaiakoProfileStatus,
  fullName as kaiakoFullName,
  type KaiakoProfile,
} from "@/lib/kaiakoProfiles";
import {
  getAllStudentProfiles,
  fullName as studentFullName,
  ageInYears,
  type ChildProfile,
} from "@/lib/studentProfiles";
import type { Level } from "@/lib/airtable";

const LEVEL_LABELS: Record<string, string> = {
  "te-pumanawa": "Te Pūmanawa",
  "te-pukenga-rau": "Te Pūkenga Rau",
  "te-pukenga": "Te Pūkenga",
};

type Props = {
  levels: Level[];
};

type Member = {
  id?: string;
  auth?: { email?: string };
  customFields?: Record<string, unknown>;
  planConnections?: { planId?: string; active?: boolean }[];
} | null;

function getFirstName(member: Member): string {
  const cf = member?.customFields;
  const v = cf?.["first-name"];
  if (typeof v === "string" && v.trim()) return v.trim();
  const email = member?.auth?.email ?? "";
  return email.split("@")[0] ?? "";
}

function getLastName(member: Member): string {
  const v = member?.customFields?.["last-name"];
  return typeof v === "string" ? v.trim() : "";
}

type TabId = "students" | "inbox" | "requests" | "eoi" | "settings";

export default function TeacherDashboardView({ levels }: Props) {
  const [member, setMember] = useState<Member>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("students");
  const [students, setStudents] = useState<ChildProfile[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pendingKaiako, setPendingKaiako] = useState<KaiakoProfile[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [studentAvatars, setStudentAvatars] = useState<Record<string, string>>({});
  const [enrollmentOpen, setEnrollmentOpenState] = useState<boolean>(true);
  const [togglingEnrollment, setTogglingEnrollment] = useState(false);
  const [eois, setEois] = useState<EoiEntry[]>([]);
  const [announcement, setAnnouncement] = useState<{
    visible: boolean;
    text: string;
    link: string;
    style: SiteSettings["announcementStyle"];
  }>({ visible: false, text: "", link: "", style: "info" });
  const [announcementSaving, setAnnouncementSaving] = useState(false);
  const [announcementSaved, setAnnouncementSaved] = useState(false);
  // Profile editing
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

        if (!isKaiako(data)) {
          setDenied(true);
          setAuthLoading(false);
          window.location.href = "/dashboard";
          return;
        }

        setMember(data);
        setProfileFirstName(getFirstName(data));
        setProfileLastName(getLastName(data));
        setAuthLoading(false);

        const [allStudents, allQuestions, pendingProfiles, siteSettings, eoiList, memberAvatar, studentAvatarMap] = await Promise.all([
          getAllStudentProfiles(),
          getAllQuestions(),
          getPendingKaiakoProfiles(),
          getSiteSettings(),
          getAllEois(),
          getMemberAvatarUrl(data.id),
          getAllStudentAvatarUrls(),
        ]);
        if (cancelled) return;

        setStudents(allStudents);
        setQuestions(allQuestions);
        setPendingKaiako(pendingProfiles);
        setAvatarUrl(memberAvatar);
        setStudentAvatars(studentAvatarMap);
        setEnrollmentOpenState(siteSettings.enrollmentOpen);
        setAnnouncement({
          visible: siteSettings.announcementVisible,
          text: siteSettings.announcementText,
          link: siteSettings.announcementLink,
          style: siteSettings.announcementStyle,
        });
        setEois(eoiList);
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
    return () => { cancelled = true; };
  }, []);

  const unansweredQuestions = useMemo(
    () => questions.filter((q) => !q.answered),
    [questions],
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const answeredCount = questions.length - unansweredQuestions.length;

  const levelBySlug = useMemo(() => {
    const map: Record<string, Level> = {};
    for (const l of levels) map[l.slug] = l;
    return map;
  }, [levels]);

  function handleAnswered(q: Question) {
    setQuestions((prev) =>
      prev.map((item) =>
        item.id === q.id ? { ...item, answered: true, answer: q.answer } : item,
      ),
    );
  }

  function handleKaiakoActioned(profileId: string) {
    setPendingKaiako((prev) => prev.filter((p) => p.id !== profileId));
  }

  async function handleSaveProfile() {
    if (profileSaving) return;
    setProfileSaving(true);
    setProfileError(null);
    try {
      const ms = getMemberstack();
      if (!ms) throw new Error("Not signed in");
      await ms.updateMember({ customFields: { "first-name": profileFirstName.trim(), "last-name": profileLastName.trim() } });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch (err: unknown) {
      setProfileError((err as Record<string, string>)?.message ?? "Failed to save. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChangePassword() {
    if (passwordSaving) return;
    if (newPassword !== confirmPassword) { setPasswordError("New passwords don't match."); return; }
    if (newPassword.length < 8) { setPasswordError("New password must be at least 8 characters."); return; }
    setPasswordSaving(true);
    setPasswordError(null);
    try {
      const ms = getMemberstack();
      if (!ms) throw new Error("Not signed in");
      await ms.updateMember({ auth: { password: currentPassword, newPassword } });
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: unknown) {
      setPasswordError((err as Record<string, string>)?.message ?? "Incorrect current password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleSaveAnnouncement() {
    if (announcementSaving) return;
    setAnnouncementSaving(true);
    setAnnouncementSaved(false);
    try {
      await saveAnnouncementSettings(announcement);
      setAnnouncementSaved(true);
      setTimeout(() => setAnnouncementSaved(false), 2500);
    } finally {
      setAnnouncementSaving(false);
    }
  }

  async function handleToggleEnrollment() {
    if (togglingEnrollment) return;
    setTogglingEnrollment(true);
    const next = !enrollmentOpen;
    try {
      await setEnrollmentOpen(next);
      setEnrollmentOpenState(next);
    } finally {
      setTogglingEnrollment(false);
    }
  }

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
          <h1 className="font-display text-3xl text-white mb-2">redirecting…</h1>
          <p className="font-sans text-white/60">
            The kaiako dashboard is for teachers only.
          </p>
        </div>
      </div>
    );
  }

  const firstName = getFirstName(member);

  const tabs: { id: TabId; label: string; icon: React.ReactNode; count?: number; countAlways?: boolean; alert?: boolean }[] = [
    { id: "students", label: "Students", icon: <Users size={15} />, count: students.length, countAlways: true },
    { id: "inbox", label: "Inbox", icon: <MessageSquare size={15} />, count: unansweredQuestions.length, countAlways: true },
    { id: "requests", label: "Requests", icon: <UserCheck size={15} />, count: pendingKaiako.length, countAlways: false, alert: pendingKaiako.length > 0 },
    { id: "eoi", label: "EOI", icon: <MailOpen size={15} />, count: eois.length, countAlways: false },
    { id: "settings", label: "Settings", icon: <Settings size={15} /> },
  ];

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-midnight-tidal">
      <section className="site-container py-16 md:py-20">
        {/* Hero */}
        <div className="rounded-2xl bg-primary shadow-xl shadow-primary/20 px-7 py-8 md:px-10 md:py-10">
          <div className="flex items-center gap-6">
            <Avatar src={avatarUrl} name={firstName || "Kaiako"} size={72} />
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/75 mb-2">
                Kaiako dashboard
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-white leading-[1.05]">
                kia ora{firstName ? `, ${firstName}` : ""}
              </h1>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const showBadge = tab.count !== undefined && (tab.countAlways || (tab.count ?? 0) > 0);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-sm font-medium transition-colors border ${
                  isActive
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-iron-depth border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
                {showBadge && (
                  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 font-sans text-[11px] font-semibold ${
                    tab.alert
                      ? "bg-semantic-yellow/20 text-semantic-yellow"
                      : isActive
                        ? "bg-primary/30 text-primary"
                        : "bg-white/10 text-white/50"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === "students" && (
            <StudentsSection
              students={students}
              loading={dataLoading}
              levelBySlug={levelBySlug}
              studentAvatars={studentAvatars}
            />
          )}
          {activeTab === "inbox" && (
            <InboxSection
              questions={unansweredQuestions}
              allQuestions={questions}
              onAnswered={handleAnswered}
              loading={dataLoading}
              levelNameBySlug={(slug) => levelBySlug[slug]?.name ?? slug}
            />
          )}
          {activeTab === "requests" && (
            <PendingKaiakoSection
              requests={pendingKaiako}
              loading={dataLoading}
              callerId={member?.id ?? ""}
              onActioned={handleKaiakoActioned}
            />
          )}
          {activeTab === "eoi" && (
            <EoiSection eois={eois} loading={dataLoading} />
          )}
          {activeTab === "settings" && (
            <div className="rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-primary" />
                <h2 className="font-display text-2xl text-white">settings</h2>
              </div>

              {/* Avatar */}
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-3">Profile photo</p>
                <div className="flex items-center gap-5 rounded-xl bg-midnight-tidal border border-white/10 px-5 py-4">
                  {member?.id && (
                    <AvatarUpload
                      currentUrl={avatarUrl}
                      name={profileFirstName || "Kaiako"}
                      size={64}
                      onUpload={(file) => uploadMemberAvatar(member.id!, file)}
                      onSaved={setAvatarUrl}
                    />
                  )}
                  <p className="font-sans text-xs text-white/45">Click the photo to upload a new one.</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-3">Name</p>
                <div className="rounded-xl bg-midnight-tidal border border-white/10 px-5 py-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-xs text-white/40 uppercase tracking-widest">First name</label>
                      <input
                        type="text"
                        value={profileFirstName}
                        onChange={(e) => setProfileFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full bg-iron-depth border border-white/10 rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-xs text-white/40 uppercase tracking-widest">Last name</label>
                      <input
                        type="text"
                        value={profileLastName}
                        onChange={(e) => setProfileLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full bg-iron-depth border border-white/10 rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                  {profileError && <p className="font-sans text-xs text-semantic-red">{profileError}</p>}
                  <div className="flex items-center justify-end gap-3">
                    {profileSaved && (
                      <span className="font-sans text-xs text-semantic-green flex items-center gap-1">
                        <Check size={12} /> Saved
                      </span>
                    )}
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-sans text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {profileSaving ? <Loader2 size={13} className="animate-spin" /> : null}
                      {profileSaving ? "Saving…" : "Save name"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-3">Change password</p>
                <div className="rounded-xl bg-midnight-tidal border border-white/10 px-5 py-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs text-white/40 uppercase tracking-widest">Current password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-iron-depth border border-white/10 rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs text-white/40 uppercase tracking-widest">New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-iron-depth border border-white/10 rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs text-white/40 uppercase tracking-widest">Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-iron-depth border border-white/10 rounded-lg px-3 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  {passwordError && <p className="font-sans text-xs text-semantic-red">{passwordError}</p>}
                  <div className="flex items-center justify-end gap-3">
                    {passwordSaved && (
                      <span className="font-sans text-xs text-semantic-green flex items-center gap-1">
                        <Check size={12} /> Password updated
                      </span>
                    )}
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-sans text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordSaving ? <Loader2 size={13} className="animate-spin" /> : null}
                      {passwordSaving ? "Updating…" : "Update password"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Enrollment toggle */}
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-3">Enrolments</p>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-midnight-tidal border border-white/10 px-5 py-4">
                  <div>
                    <p className="font-sans text-sm font-medium text-white">New enrolments open</p>
                    <p className="font-sans text-xs text-white/50 mt-0.5">
                      {enrollmentOpen
                        ? "Parents can sign up and enrol children."
                        : "Registrations closed — visitors see an expression of interest form."}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleEnrollment}
                    disabled={togglingEnrollment || dataLoading}
                    aria-label={enrollmentOpen ? "Close enrolments" : "Open enrolments"}
                    className={`relative shrink-0 h-7 w-12 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      enrollmentOpen ? "bg-semantic-green" : "bg-white/15"
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${enrollmentOpen ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              {/* Announcement banner */}
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-3">Site announcement</p>
                <div className="rounded-xl bg-midnight-tidal border border-white/10 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-sans text-sm font-medium text-white">Show announcement bar</p>
                      <p className="font-sans text-xs text-white/50 mt-0.5">Displays a slim banner at the top of every page.</p>
                    </div>
                    <button
                      onClick={() => setAnnouncement((a) => ({ ...a, visible: !a.visible }))}
                      disabled={dataLoading}
                      aria-label="Toggle announcement banner"
                      className={`relative shrink-0 h-7 w-12 rounded-full transition-colors duration-200 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        announcement.visible ? "bg-primary" : "bg-white/15"
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${announcement.visible ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs text-white/40 uppercase tracking-widest">Message</label>
                    <input
                      type="text"
                      value={announcement.text}
                      onChange={(e) => setAnnouncement((a) => ({ ...a, text: e.target.value }))}
                      placeholder="e.g. Term 2 enrolments are now open!"
                      className="w-full bg-iron-depth border border-white/10 rounded-lg px-4 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs text-white/40 uppercase tracking-widest">Link <span className="normal-case text-white/30">(optional)</span></label>
                    <input
                      type="text"
                      value={announcement.link}
                      onChange={(e) => setAnnouncement((a) => ({ ...a, link: e.target.value }))}
                      placeholder="/enrolment/welcome or https://…"
                      className="w-full bg-iron-depth border border-white/10 rounded-lg px-4 py-2.5 font-sans text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs text-white/40 uppercase tracking-widest">Colour</label>
                    <div className="flex gap-2">
                      {(["info", "success", "warning"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setAnnouncement((a) => ({ ...a, style: s }))}
                          className={`flex-1 py-2 rounded-lg font-sans text-xs capitalize border transition-colors ${
                            announcement.style === s
                              ? s === "info" ? "bg-primary/20 border-primary text-primary"
                                : s === "success" ? "bg-semantic-green/20 border-semantic-green text-semantic-green"
                                : "bg-semantic-yellow/20 border-semantic-yellow text-semantic-yellow"
                              : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                          }`}
                        >
                          {s === "info" ? "Teal" : s === "success" ? "Green" : "Yellow"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-1">
                    {announcementSaved && (
                      <span className="font-sans text-xs text-semantic-green flex items-center gap-1">
                        <Check size={12} /> Saved
                      </span>
                    )}
                    <button
                      onClick={handleSaveAnnouncement}
                      disabled={announcementSaving || dataLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-sans text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {announcementSaving ? <Loader2 size={13} className="animate-spin" /> : null}
                      {announcementSaving ? "Saving…" : "Save announcement"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StudentsSection({
  students,
  loading,
  levelBySlug,
  studentAvatars,
}: {
  students: ChildProfile[];
  loading: boolean;
  levelBySlug: Record<string, Level>;
  studentAvatars: Record<string, string>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Users size={20} className="text-primary" />
        <h2 className="font-display text-2xl text-white">students</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="text-white/30 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <p className="font-sans text-sm text-white/50 leading-relaxed">
          No enrolled students yet. Students will appear here once a parent
          completes enrolment.
        </p>
      ) : (
        <ul className="divide-y divide-white/10">
          {students.map((s) => (
            <StudentCard key={s.id} student={s} levelBySlug={levelBySlug} avatarUrl={studentAvatars[s.id] ?? null} />
          ))}
        </ul>
      )}
    </div>
  );
}

function StudentCard({
  student,
  levelBySlug,
  avatarUrl,
}: {
  student: ChildProfile;
  levelBySlug: Record<string, Level>;
  avatarUrl: string | null;
}) {
  const level = levelBySlug[student.level];
  const levelLabel = level?.name ?? LEVEL_LABELS[student.level] ?? student.level;
  const age = ageInYears(student.dateOfBirth);

  return (
    <li className="py-4">
      <div className="flex items-start gap-3 flex-wrap">
        <Avatar src={avatarUrl} name={studentFullName(student)} size={36} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-sans text-base font-medium text-white">
            {studentFullName(student)}
          </p>
          {levelLabel && (
            <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 font-sans text-xs text-primary mt-1">
              {levelLabel}
            </span>
          )}
        </div>
      </div>

      <ul className="mt-2 space-y-1">
        {age !== null && (
          <li className="inline-flex items-center gap-2 font-sans text-xs text-white/55">
            <Cake size={12} className="text-white/40 shrink-0" />
            {age} {age === 1 ? "year" : "years"} old
          </li>
        )}
        {student.username && (
          <li className="flex items-center gap-2 font-sans text-xs text-white/55">
            <AtSign size={12} className="text-white/40 shrink-0" />
            {student.username}
          </li>
        )}
      </ul>

      {student.medicalNotes && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-semantic-yellow/10 border border-semantic-yellow/20 px-3 py-2">
          <HeartPulse size={12} className="text-semantic-yellow mt-0.5 shrink-0" />
          <p className="font-sans text-xs text-white/70 leading-snug">
            {student.medicalNotes}
          </p>
        </div>
      )}
    </li>
  );
}

function PendingKaiakoSection({
  requests,
  loading,
  callerId,
  onActioned,
}: {
  requests: KaiakoProfile[];
  loading: boolean;
  callerId: string;
  onActioned: (profileId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-semantic-yellow/25 bg-iron-depth p-7 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <UserCheck size={20} className="text-semantic-yellow" />
        <h2 className="font-display text-2xl text-white">kaiako requests</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="text-white/30 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <p className="font-sans text-sm text-white/50 leading-relaxed">
          No pending requests.
        </p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <KaiakoRequestCard
              key={req.id}
              profile={req}
              callerId={callerId}
              onActioned={onActioned}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function KaiakoRequestCard({
  profile,
  callerId,
  onActioned,
}: {
  profile: KaiakoProfile;
  callerId: string;
  onActioned: (profileId: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"approved" | "denied" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: "approve" | "deny") {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (action === "approve") {
        const res = await fetch("/api/teacher/approve-kaiako", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-member-id": callerId,
          },
          body: JSON.stringify({ memberId: profile.memberId, action }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `Request failed (${res.status})`);
        }
      }
      await updateKaiakoProfileStatus(profile.id, action === "approve" ? "approved" : "denied");
      setDone(action === "approve" ? "approved" : "denied");
      setTimeout(() => onActioned(profile.id), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const name = kaiakoFullName(profile);

  return (
    <li className="rounded-xl border border-white/10 bg-midnight-tidal p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <div>
          <p className="font-sans text-sm font-semibold text-white">{name || "Unknown"}</p>
          {profile.email && (
            <p className="font-sans text-xs text-white/45 mt-0.5">{profile.email}</p>
          )}
        </div>
        {done && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-medium ${
            done === "approved"
              ? "bg-semantic-green/15 text-semantic-green"
              : "bg-semantic-red/15 text-semantic-red"
          }`}>
            {done === "approved" ? <Check size={12} /> : <X size={12} />}
            {done}
          </span>
        )}
      </div>

      {profile.experience && (
        <p className="font-sans text-sm text-white/70 leading-relaxed mb-4 whitespace-pre-line">
          {profile.experience}
        </p>
      )}

      {error && (
        <p className="font-sans text-xs text-semantic-red mb-3">{error}</p>
      )}

      {!done && (
        <div className="flex gap-3">
          <button
            onClick={() => handleAction("approve")}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-semantic-green/15 border border-semantic-green/30 text-semantic-green font-sans text-sm font-medium hover:bg-semantic-green/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            Approve
          </button>
          <button
            onClick={() => handleAction("deny")}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-white/60 font-sans text-sm font-medium hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={13} />
            Deny
          </button>
        </div>
      )}
    </li>
  );
}

function InboxSection({
  questions,
  allQuestions,
  onAnswered,
  loading,
  levelNameBySlug,
}: {
  questions: Question[];
  allQuestions: Question[];
  onAnswered: (q: Question) => void;
  loading: boolean;
  levelNameBySlug: (slug: string) => string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={20} className="text-primary" />
        <h2 className="font-display text-2xl text-white">ask the kaiako inbox</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="text-white/30 animate-spin" />
        </div>
      ) : questions.length === 0 ? (
        <div className="py-6">
          <p className="font-sans text-sm text-white/60">
            {allQuestions.length === 0
              ? "No questions yet. Student questions will land here when they use the Ask the Kaiako form on a lesson."
              : "You're all caught up — no unanswered questions."}
          </p>
        </div>
      ) : (
        <ul className="space-y-5">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onAnswered={onAnswered}
              levelNameBySlug={levelNameBySlug}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  onAnswered,
  levelNameBySlug,
}: {
  question: Question;
  onAnswered: (q: Question) => void;
  levelNameBySlug: (slug: string) => string;
}) {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || submitting) return;
    setSubmitting(true);
    const result = await answerQuestion({ questionId: question.id, answer: reply.trim() });
    setSubmitting(false);
    if (result) {
      setDone(true);
      onAnswered({ ...question, answer: reply.trim(), answered: true });
    }
  }

  const levelName = levelNameBySlug(question.levelSlug);

  return (
    <li className="rounded-xl border border-white/10 bg-midnight-tidal p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p className="font-sans text-sm font-semibold text-white">
          {question.studentName || "Unknown student"}
        </p>
        <p className="font-sans text-xs uppercase tracking-widest text-white/40">
          {levelName}
          {question.weekNumber ? ` · wk ${question.weekNumber}` : ""}
        </p>
      </div>
      <p className="font-sans text-white/80 leading-relaxed mb-4 whitespace-pre-line">
        {question.question}
      </p>

      {done ? (
        <div className="flex items-center gap-2 text-sm font-sans text-semantic-green">
          <Check size={16} />
          Reply sent
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block font-sans text-xs uppercase tracking-widest text-white/50">
            Your reply
          </label>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Kia ora — type your reply…"
            className="w-full rounded-lg bg-iron-depth border border-white/10 px-4 py-3 font-sans text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !reply.trim()}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-4 bg-primary text-white font-sans text-sm font-medium transition-all duration-300 ease-[cubic-bezier(.165,.84,.44,1)] hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-primary"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? "Sending…" : "Send reply"}
            </button>
          </div>
        </form>
      )}
    </li>
  );
}

function EoiSection({ eois, loading }: { eois: EoiEntry[]; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-iron-depth p-7 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <MailOpen size={20} className="text-primary" />
        <h2 className="font-display text-2xl text-white">expressions of interest</h2>
        {eois.length > 0 && (
          <span className="ml-auto inline-flex items-center justify-center h-6 min-w-6 rounded-full bg-primary/15 text-primary font-sans text-xs font-medium px-2">
            {eois.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="text-white/30 animate-spin" />
        </div>
      ) : eois.length === 0 ? (
        <p className="font-sans text-sm text-white/50 leading-relaxed">
          No expressions of interest yet. They appear here when enrolments are closed and parents fill in the interest form.
        </p>
      ) : (
        <ul className="divide-y divide-white/10 max-h-96 overflow-y-auto">
          {eois.map((e) => (
            <li key={e.id} className="py-4">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                <p className="font-sans text-sm font-medium text-white">
                  {e.firstName} {e.lastName}
                </p>
                <p className="font-sans text-xs text-white/35">
                  {new Date(e.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <a
                  href={`mailto:${e.email}`}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-primary hover:text-primary-light transition-colors"
                >
                  <MailOpen size={11} />
                  {e.email}
                </a>
                {e.phone && (
                  <span className="inline-flex items-center gap-1.5 font-sans text-xs text-white/50">
                    <Phone size={11} />
                    {e.phone}
                  </span>
                )}
                {e.childrenCount && (
                  <span className="inline-flex items-center gap-1.5 font-sans text-xs text-white/50">
                    <Baby size={11} />
                    {e.childrenCount} {Number(e.childrenCount) === 1 ? "child" : "children"}
                  </span>
                )}
              </div>
              {e.message && (
                <p className="font-sans text-xs text-white/55 leading-snug mt-2 italic">
                  &ldquo;{e.message}&rdquo;
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TeacherDashboardLink() {
  return (
    <Link
      href="/dashboard/teacher"
      className="inline-flex items-center gap-2 font-sans text-sm text-primary hover:text-primary-light transition-colors"
    >
      Open kaiako dashboard →
    </Link>
  );
}
