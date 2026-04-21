# Ngaru Pou — Claude Context

## Project Overview
A culturally grounded e-learning platform for Māori students. Built for a client. Supports te ao Māori and te ao whānui learning through interactive lessons, real-world skills, and culturally relevant content.

## Live URLs
- Production: https://ngaru-pou.vercel.app
- GitHub: https://github.com/MicaDesign/ngaru-pou

## Local Development
- Project folder: ~/MicaProjects/NgaruPou/ngaru-pou
- Webflow reference (DO NOT use code from): ~/MicaProjects/NgaruPou/webflow-reference/ngaru-pou.webflow/
- Start dev server: npm run dev
- View locally: http://localhost:3000
- Build check: npm run build

## Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS (custom design tokens)
- Hosting: Vercel (auto-deploys on git push)
- Version control: GitHub (MicaDesign/ngaru-pou)
- Auth: MemberStack 2.0
- Curriculum CMS: Airtable (not yet integrated)
- Video: Vimeo (not yet integrated)
- Icons: lucide-react
- Animations: Framer Motion

## Design System

### Colours (Tailwind tokens in tailwind.config.ts)
- midnight-tidal: #050a1c — darkest bg, near-black
- iron-depth: #0f1c3f — deep navy, secondary dark bg
- primary: #2ca3bb — primary brand teal
- secondary: #3cbca7 — secondary teal/green
- lagoon-drift: #60cad8 — light teal accent
- salt-mist: #e1f2ff — very light blue, highlight bg
- semantic-yellow: #edb200 — warning/badge
- semantic-green: #00c758 — success
- semantic-red: #fb2c36 — error/alert

### Typography
- Display/Heading: Nga Mihi (self-hosted at app/fonts/NgaMihi.ttf)
  - ALWAYS lowercase — text-transform: lowercase applied globally
  - Tailwind class: font-display
  - Used for: hero headings, section titles, page headings
- Body/UI: Inter (Google Fonts)
  - Tailwind class: font-sans
  - Used for: body text, buttons, inputs, nav links, all UI text

### Component Rules
- Tailwind classes only — no inline styles ever
- All colours via named tokens — no raw hex values
- Responsive: mobile-first
- Animations: Framer Motion for scroll reveals, hover transitions
- Button variants: "primary" (filled teal) and "ghost" (transparent, white border)

## Project Structure
- app/ — Next.js app router pages
- app/layout.tsx — root layout with Nav, Footer, MemberstackProvider, LayoutShell
- app/page.tsx — homepage (composition of section components)
- app/login/page.tsx — login page with full UX feedback states
- app/signup/page.tsx — signup page with password strength, confirmation screen
- app/dashboard/page.tsx — server page that fetches levels + basic lessons and delegates to DashboardView (which renders the student or kaiako view based on plan)
- app/dashboard/teacher/page.tsx — direct URL for the kaiako dashboard; renders TeacherDashboardView, which client-side gates to Kaiako plan members and redirects others to /dashboard
- app/dashboard/levels/page.tsx — levels landing page (vertical stack of level cards pulling from Airtable)
- app/dashboard/levels/[slug]/page.tsx — level overview page (server component, fetches Airtable data)
- app/dashboard/levels/[slug]/lessons/[week]/page.tsx — lesson page with video placeholder, teal banner, sections, fixed left sidebar, sticky right schedule sidebar
- app/verified/page.tsx — email verification success page
- app/not-found.tsx — branded 404 page with centred koru mark and diagonal accent lines
- components/ — reusable UI components
- components/Nav.tsx — site navigation (shows different buttons when logged in vs out)
- components/Footer.tsx — site footer
- components/Button.tsx — primary/ghost button variants
- components/MemberstackProvider.tsx — MemberStack context provider
- components/LayoutShell.tsx — hides Nav/Footer on login/signup/verified routes
- components/AuthGuard.tsx — client wrapper that checks MemberStack on mount, redirects to /login if no member
- components/DashboardView.tsx — client dashboard that branches on plan: student view (welcome hero, progress tracker) or TeacherDashboardView for Kaiako members
- components/TeacherDashboardView.tsx — kaiako dashboard UI: teal hero, students section (aggregated from lesson_progress), and Ask the Kaiako inbox with reply form
- components/LessonView.tsx — client wrapper for the lesson page that fetches progress and hands state to the sidebar and mark-complete button
- components/LessonSidebar.tsx — fixed left lesson nav (flat list, per-item dividers, lock/completion states)
- components/MarkCompleteButton.tsx — white pill that writes to the lesson_progress Data Table via lib/progress
- components/AskKaiakoForm.tsx — student form that writes to the kaiako_questions Data Table via lib/questions
- components/HeroSection.tsx — homepage hero
- components/KaupapaSection.tsx — "Our Kaupapa" 4-pillar section
- components/IdentitySection.tsx — "For Rangatahi / For Whānau" section
- components/EngageSection.tsx — "Engage. Learn. Achieve." feature grid
- components/CommunitySection.tsx — "Supporting Tamariki" section
- components/HeroCTAs.tsx — hero CTA buttons (client component)
- lib/airtable.ts — server-side Airtable client with typed fetchers (getLevelBySlug, getLessonsBasic, getLessonsForLevel, getLessonByWeek) and 5-min ISR caching
- lib/memberstack.ts — MemberStack singleton client (lazy loaded, browser only)
- lib/kaiako.ts — Kaiako plan ID constant + isKaiako(member) helper that inspects planConnections for an active connection to the kaiako plan
- lib/progress.ts — lesson_progress Data Table client (getLessonProgress, getCompletedWeeksForLevel, ensureProgressRecord, markLessonComplete, getProgressByMemberId for the kaiako view). Writes `member_id` as a data field so the teacher can filter by student.
- lib/studentRegistry.ts — student_registry Data Table client. ensureStudentRegistered(member) runs on every student's dashboard/lesson visit and creates a row if one doesn't exist; getStudents() returns the full roster for the teacher dashboard.
- lib/teacherMembers.ts — client fetcher for /api/teacher/members. Returns the authoritative member list from the MemberStack Admin REST API (names + emails + plans).
- app/api/teacher/members/route.ts — server route that calls the MemberStack Admin REST API with X-API-KEY auth. Verifies the caller is Kaiako via GET /members/{id}, then returns GET /members for the teacher dashboard roster.
- lib/questions.ts — kaiako_questions Data Table client (createQuestion from the student form, getUnansweredQuestions / getAllQuestions / answerQuestion / getAnsweredQuestionsForLesson)
- middleware.ts — passthrough only (auth protection is client-side via MemberStack SDK)
- public/images/ — logo SVGs and site images
- public/fonts/ — self-hosted font files

## Environment Variables
Required in .env.local (never commit this file):
- NEXT_PUBLIC_MEMBERSTACK_KEY=pk_b262170f0a74caaa56d4
- AIRTABLE_TOKEN=<personal access token> — server-side only, no NEXT_PUBLIC prefix (used by lib/airtable.ts in server components)
- MEMBERSTACK_SECRET_KEY=<secret key from MemberStack Dev Tools> — server-side only, used by `app/api/teacher/members/route.ts` to call the Admin REST API with `X-API-KEY` auth

Also set all three in Vercel dashboard: Settings → Environment Variables (required for the level pages, lesson pages, and teacher roster to work in production)

## Services & Credentials
- MemberStack: app.memberstack.com
  - Plan: Basic 2.0
  - Public key: pk_b262170f0a74caaa56d4
  - Free Plan ID (student): pln_free-plan-gt6r0336 — auto-assigned on signup
  - Kaiako Plan ID (teacher): pln_kaiako-4gi90evx — when active on a member, the dashboard renders the teacher view
  - Auth is CLIENT-SIDE only — MemberStack uses localStorage not cookies
  - Protected pages check auth via getMemberstack().getCurrentMember() on mount
  - Data Tables (configure in MemberStack admin):
    - `lesson_progress` — fields: lesson_id (text), level_slug (text), week_number (number), completed (boolean), completed_at (text), reflection_answers (text), **member_id (text)** — the student's MemberStack ID, written explicitly on create so the Kaiako can filter records with `where: { member_id: { equals: id } }`. Read rule must permit Kaiako plan members to read across members (e.g. "Any Member" read) so the teacher dashboard can see each student's progress.
    - `kaiako_questions` — fields: student_id (text), student_name (text), student_email (text), level_slug (text), week_number (number), question (text), answered (boolean), answer (text). Create rule: any authenticated member. Read rule: Kaiako plan members read all; students read their own. Update rule: Kaiako plan members can update all (to post answers).
    - `student_registry` — fields: member_id (text), first_name (text), last_name (text), email (text). Read rule: **Any Member** (so the Kaiako can see the full student roster). Create rule: any authenticated member. Students self-register on their first visit to `/dashboard` or any lesson page via `ensureStudentRegistered` in `lib/studentRegistry.ts` (idempotent — checks for an existing row before creating). Teachers are skipped.
  - **Admin REST API** — auth is `X-API-KEY: <MEMBERSTACK_SECRET_KEY>` (NOT `Authorization: Bearer <key>` — Bearer returns `validation/invalid-secret-key` on this plan). Used by `app/api/teacher/members/route.ts` to fetch the authoritative member roster at `GET https://admin.memberstack.com/members`. The route also calls `GET /members/{id}` to verify the caller is on the Kaiako plan before returning data. `lib/teacherMembers.ts` is the client fetcher (sends `x-member-id` header).
  - **Admin API has NO Data Tables endpoint** — `GET /data-tables/{key}/rows` returns `Cannot GET`. That's why all Data Table reads stay client-side via the DOM SDK. Teacher-side progress aggregation works by: (1) reading the `student_registry` table (Any Member read) to get every student ID, then (2) calling `getProgressByMemberId(id)` per student via DOM SDK. This works because the `lesson_progress` read rule is "Any Member" and each record carries a `member_id` data field for filtering.
- Airtable: airtable.com — curriculum CMS
  - Base ID: appZBCAC2qH9bFOaG
  - Tables:
    - Levels — tbltrJGgs5RvZ552v (one record per level: Te Pūmanawa, Te Pūkenga Rau, Te Pūkenga)
    - Lessons — tblX7NElxtfGi9O4F (10 per level; links to Level, Lesson Schedule, Videos; "Is Published" checkbox gates access)
    - Lesson Schedule — tbli6ErkVxCQzmxj8 (timed rows per lesson, ~8 per lesson)
    - Videos — tbluk5AFITvkim2DS (one+ per lesson; Vimeo URL, duration, caption file, reflection prompts)
    - Reflection Prompts — tbla4etpK0iy11Asa (linked to a video; answered for attendance)
  - Auth: personal access token in AIRTABLE_TOKEN (server-side only)
- Vimeo: vimeo.com — account exists, not yet integrated
- Vercel: vercel.com — project: ngaru-pou under Mica Design team

## MemberStack Important Notes
- MemberStack 2.0 stores sessions in localStorage NOT cookies
- Middleware cannot check MemberStack auth server-side
- All protected pages must use client-side auth check pattern:
  const ms = getMemberstack()
  const { data: member } = await ms.getCurrentMember()
  if (!member) window.location.href = "/login"
- Always use window.location.href for auth redirects (not router.push)
- Free Plan is auto-assigned on signup via plans: [{ planId: "pln_free-plan-gt6r0336" }]
- Custom field keys use hyphenated format — MemberStack stores them as `first-name` and `last-name` (not `firstName`/`lastName`). Always read them via bracket access: `member?.customFields?.["first-name"]`. The signup page writes them with the hyphenated keys; every consumer must match.

## Build Phases
- ✅ Phase 0: Developer tools installed (Node, Git, VS Code, GitHub Desktop, Claude Code)
- ✅ Phase 1: Blank Next.js site live on Vercel
- ✅ Phase 2a: Design system + full homepage built and deployed
- ✅ Phase 3: MemberStack auth complete
  - Login page with full UX feedback (loading, success, specific errors)
  - Signup page with password strength bar, real-time validation, confirmation screen
  - Email verification flow with /verified page
  - Client-side route protection on dashboard
  - Free Plan auto-assigned on signup
  - Nav shows different buttons when logged in vs logged out
- ✅ Phase 4: Airtable integration — level and lesson pages live
  - lib/airtable.ts with typed fetchers, batched record-ID queries, 5-min ISR caching
  - Level overview page at /dashboard/levels/[slug] with lesson grid + locked states
  - Lesson page at /dashboard/levels/[slug]/lessons/[week] — fixed left sidebar, teal rounded banner with Mark Complete pill button, video placeholder, objectives/key features/vocabulary/teacher notes, sticky right schedule sidebar, Ask the Kaiako form
  - AuthGuard client wrapper protects both routes via existing MemberStack pattern
  - Branded 404 page at /not-found with centred koru mark and diagonal SVG accents
  - Publish gate (!lesson.isPublished → 404) temporarily bypassed during content fill-in; restore when Airtable "Is Published" is set
- ✅ Phase 6: Progress tracking via MemberStack Data Tables (`lesson_progress`). Mark Complete writes `completed`/`completed_at`/`member_id`; LessonSidebar shows green dots for completed weeks; LessonView seeds records on mount via `ensureProgressRecord` (also backfills missing `member_id` on legacy rows).
- ✅ Phase 7: Student dashboard at /dashboard. Two states — "Get started" hero + level mini-cards for members with no progress; teal "welcome back" banner + current-level lesson list with "Continue learning →" CTA and per-lesson completion dots for members with progress. Server fetches all levels + basic lessons; client fetches `getCompletedWeeksForLevel` per level.
- ✅ Phase 8: Kaiako (teacher) dashboard at /dashboard/teacher (plan-gated). DashboardView auto-routes Kaiako members to the teacher view. Two sections side-by-side (50/50 grid): Students (registry + admin-API identity, per-student progress via `getProgressByMemberId` → per-level teal pill + Airtable thumbnail + link to `/dashboard/levels/[slug]`) and Ask the Kaiako inbox (read/answer `kaiako_questions`, updates flip records to `answered:true` with teacher reply). Students see replies on the matching lesson page via KaiakoReplies. `app/api/teacher/members` pulls the authoritative roster from the MemberStack Admin REST API with `X-API-KEY` auth.
- 🔜 Phase 5: Vimeo video embeds on lesson pages (replace the placeholder, pull Vimeo URL + caption file from Airtable Videos table) — deferred, content not yet available

## Coding Conventions
- Always use named Tailwind colour tokens, never raw hex
- Always use font-display for Nga Mihi, font-sans for Inter
- Break pages into section components under components/
- Keep page files as clean compositions of components
- Server Components by default — add "use client" only when needed
- Always run npm run build before committing
- Never commit .env.local
- Never copy or import code from webflow-reference/
- Use window.location.href for auth redirects, not router.push
- Close and reopen Claude Code terminal between tasks to save tokens
- Start each session by reading this CLAUDE.md file

## Webflow Reference
The exported Webflow site lives at:
~/MicaProjects/NgaruPou/webflow-reference/ngaru-pou.webflow/

Use it for: colours, spacing, font sizes, images, layout structure, content copy.
Do NOT use its HTML/CSS/JS directly.
Assets (images, fonts) may be copied into public/ as needed.
