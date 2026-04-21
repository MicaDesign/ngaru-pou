# Ngāru Pou — Claude Context

## Project

Māori language learning platform. Next.js 14 App Router, Tailwind CSS, MemberStack 2.0 DOM SDK for auth.

## Build Phases

✅ Phase 1: Next.js setup, Tailwind config, custom fonts (Nga Mihi display, Inter sans), colour tokens
✅ Phase 2: Marketing pages — homepage, how it works, nav, footer
✅ Phase 3: MemberStack auth complete — login, signup, dashboard, route protection, verified page, Free Plan auto-assignment on signup. Cookie name for middleware: check console logs for actual _ms-mid cookie name used.

## Key Conventions

- `font-display` → Nga Mihi (lowercase-only face; `.font-display` forces `text-transform: lowercase`)
- `font-sans` → Inter
- Auth pages (`/login`, `/signup`, `/verified`) render without Nav/Footer via `LayoutShell`
- MemberStack SDK is lazy-loaded (`require()` inside `getMemberstack()`) to avoid SSR side effects
- `MemberstackProvider` skips SDK init on auth pages entirely — those pages use `document.cookie` for the already-logged-in check
- After login success, use `window.location.href` (hard nav) not `router.push` — ensures the session cookie is sent with the middleware request

## Colour Tokens

| Token | Value |
|---|---|
| `midnight-tidal` | #050a1c |
| `iron-depth` | #0f1c3f |
| `primary` | #2ca3bb |
| `primary-light` | lighter teal hover |
| `secondary` | #3cbca7 |
| `semantic-red` | #fb2c36 |
| `semantic-green` | #00c758 |
| `semantic-yellow` | #edb200 |

## Auth Architecture Notes

- Middleware (`middleware.ts`) protects `/dashboard/:path*`, `/lessons/:path*`, `/member/:path*`
- Currently middleware is open (console-log only) pending confirmation of exact MemberStack cookie name
- MemberStack Free Plan ID: `pln_free-plan-gt6r0336`
- Signup assigns Free Plan automatically via `plans: [{ planId: "pln_free-plan-gt6r0336" }]`
