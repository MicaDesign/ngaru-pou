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
- app/dashboard/page.tsx — member dashboard (client-side protected via MemberStack SDK)
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
- components/LessonSidebar.tsx — fixed left lesson nav (flat list, per-item dividers, lock/completion states)
- components/MarkCompleteButton.tsx — white pill button with teal check, UI-only until Phase 6
- components/AskKaiakoForm.tsx — client form on the lesson page, UI-only until wired to messaging
- components/HeroSection.tsx — homepage hero
- components/KaupapaSection.tsx — "Our Kaupapa" 4-pillar section
- components/IdentitySection.tsx — "For Rangatahi / For Whānau" section
- components/EngageSection.tsx — "Engage. Learn. Achieve." feature grid
- components/CommunitySection.tsx — "Supporting Tamariki" section
- components/HeroCTAs.tsx — hero CTA buttons (client component)
- lib/airtable.ts — server-side Airtable client with typed fetchers (getLevelBySlug, getLessonsForLevel, getLessonByWeek) and 5-min ISR caching
- lib/memberstack.ts — MemberStack singleton client (lazy loaded, browser only)
- middleware.ts — passthrough only (auth protection is client-side via MemberStack SDK)
- public/images/ — logo SVGs and site images
- public/fonts/ — self-hosted font files

## Environment Variables
Required in .env.local (never commit this file):
- NEXT_PUBLIC_MEMBERSTACK_KEY=pk_b262170f0a74caaa56d4
- AIRTABLE_TOKEN=<personal access token> — server-side only, no NEXT_PUBLIC prefix (used by lib/airtable.ts in server components)

Also set both in Vercel dashboard: Settings → Environment Variables (required for the level and lesson pages to work in production)

## Services & Credentials
- MemberStack: app.memberstack.com
  - Plan: Basic 2.0
  - Public key: pk_b262170f0a74caaa56d4
  - Free Plan ID: pln_free-plan-gt6r0336
  - Auth is CLIENT-SIDE only — MemberStack uses localStorage not cookies
  - Protected pages check auth via getMemberstack().getCurrentMember() on mount
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
- 🔜 Phase 5: Vimeo video embeds on lesson pages (replace the placeholder, pull Vimeo URL + caption file from Airtable Videos table)
- 🔜 Phase 6: Progress tracking via MemberStack custom fields (wire Mark Complete button + completedWeeks prop on LessonSidebar)
- 🔜 Phase 7: Full dashboard — enrolled courses, progress, next lesson

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
