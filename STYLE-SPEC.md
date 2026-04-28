# Ngaru Pou — Style Specification
> Extracted from `webflow-reference/ngaru-pou.webflow/` CSS + HTML. Used as source of truth for Next.js rebuild.

---

## Colors

| Token name | Hex | Usage |
|---|---|---|
| `midnight-tidal` | `#050a1c` | Page bg, nav bg, footer bg, dark section bg |
| `iron-depth` | `#0f1c3f` | Secondary dark bg (community section) |
| `primary` | `#2ca3bb` | Primary brand teal — buttons, eyebrow borders, link hovers, icon accents |
| `secondary` | `#3cbca7` | Button hover bg (primary hover state) |
| `lagoon-drift` | `#60cad8` | Light teal accent |
| `salt-mist` | `#e1f2ff` | Identity section bg (`u-bg-light-blue`) |
| `semantic-yellow` | `#edb200` | Warning |
| `semantic-green` | `#00c758` | Success |
| `semantic-red` | `#fb2c36` | Error |

**Section backgrounds (source):**
- **Nav:** `midnight-tidal (#050a1c)` — `background-color: var(--colors--bg)` which resolves to `--_color---midnight-tidal--1000`
- **Hero:** `midnight-tidal (#050a1c)` with `bg-gradient-2.svg` covering the section (`background-size: cover`)
- **Kaupapa section:** `midnight-tidal (#050a1c)` (default dark)
- **Identity section:** `salt-mist (#e1f2ff)` with `bg-pattern-1.svg` at bottom; pattern: `linear-gradient(#e1f2fffa, #e1f2fffa), url(bg-pattern-1.svg)` at `50% 100%`
- **Engage section:** `bg-gradient-1.svg` repeat-x + `bg-pattern-4.svg` at `100% 100%` 200px; resolves to dark navy gradient
- **Community section:** `primary (#2ca3bb)` — `u-bg-blue = background-color: var(--_color---primary--default)`. **Note: this is TEAL, not navy.**
- **Footer:** `midnight-tidal (#050a1c)` with `1px solid border` at top (white ~11%)

**Button states:**
- Primary default bg: `primary (#2ca3bb)`, text: white
- Primary hover: `color-mix(oklch, #2ca3bb 85%, white)` ≈ lighter teal ~`#54b9cd`
- Secondary/ghost default: `rgba(white, 5%)` bg + `1px inset box-shadow rgba(white, 20%)` + backdrop-filter blur(5px), text: white
- Secondary hover: `rgba(white, 11%)` bg
- Tertiary (ghost on light bg): transparent bg, text: `primary (#2ca3bb)`, hover: `rgba(white, 11%)`
- Transition: `all .3s cubic-bezier(.165, .84, .44, 1)` (ease-out-expo)

---

## Typography

**Font families:**
- Heading (H1, H2): `"Nga Mihi", Arial, sans-serif` — always `text-transform: lowercase`
- H3, H4, H5, H6, body, buttons, eyebrows: `Avenir, Arial, sans-serif` → our Inter
- Eyebrows: uppercase, letter-spacing: 0.15em

**Fluid type scale (desktop = 80rem viewport):**
- H1: `clamp(2.5 * 2rem, …, 4.5 * 2rem)` → **min: 5rem, max: 9rem**. At desktop ~**8–9rem**. line-height: **1**, letter-spacing: **0.02em**, weight: 500
- H2: `clamp(2 * 2rem, …, 3 * 2rem)` → **min: 4rem, max: 6rem**. At desktop ~**5–6rem**. line-height: **1.1**, letter-spacing: **-0.02em**, weight: 500
- H3: `clamp(1.5rem, …, 2.25rem)`. line-height: **1.2**, weight: 500
- H4: `clamp(1.25rem, …, 1.75rem)`. line-height: **1.2**, weight: 500
- H5: **1.25rem**, line-height: 1.2, weight: 500
- Body (paragraph-body): **1.2rem**, line-height: **1.5**, weight: 400
- Paragraph-sm: **1.1rem**, line-height: 1.5
- Paragraph-lg: `clamp(1.1 * 1.3rem, …, 1.25 * 1.3rem)` → ~**1.43–1.625rem**, line-height: 1.5
- Eyebrow: **1rem**, line-height: 1.2, font-weight: 500, letter-spacing: **0.15em**, uppercase

**Practical Tailwind equivalents:**
- Hero H1: `text-7xl lg:text-8xl` (≈ 4.5–6rem), line-height tight
- Section H2: `text-4xl lg:text-5xl` (≈ 2.25–3rem)
- Body large: `text-lg lg:text-xl` (≈ 1.125–1.25rem)
- Body default: `text-base lg:text-lg`
- Eyebrow: `text-xs uppercase tracking-[0.15em]`

---

## Layout & Spacing

**Container:** `width: 88%`, max-width: `80rem (1280px)`. On tablet (≤991px): `margin: 0 1rem`.

**Section vertical padding:**
- Default (`md`): **6rem** desktop → **4rem** tablet → **3rem** mobile
- Large (`lg`): **10rem** desktop → **6rem** tablet → **4rem** mobile
- Small (`sm`): **2rem** all sizes
- Footer: `padding-top: 4rem`, `padding-bottom: 2rem`

**Grid gap:** `32px` main, `16px` md, `8px` sm

**Header height:** `6rem (96px)` — CSS variable `--_layout---header--height: 6rem`
**Header background:** `midnight-tidal (#050a1c)` — sticky, full-width, `box-shadow: 0 1px 0 0 rgba(white, 11%)`

**Nav logo:** `.nav-logo_link` — `width: 250px`, `transform: scale(1.05)` always applied
**Footer logo:** `.footer-logo_link` — `width: 14rem (224px)`

---

## Buttons

**Large button (lg):** height `3.5rem`, padding-x `1.5rem`, gap `0.75rem`
**Small button (sm):** height `2rem`, padding-x `0.75rem`, gap `0.375rem`
**Border radius:** `0.5rem` (not pill/rounded-full)
**Font:** Avenir (Inter) weight 500, size = paragraph-lg for lg buttons
**Transition:** `all .3s cubic-bezier(.165, .84, .44, 1)`

---

## Cards (Airy grid cards — Engage section)

`.card.cc-airy`: transparent bg, `border-style: solid none none solid` (top + left borders only), `border-color: rgba(white, 11%)`, border-radius: 0
Card body padding: `3rem` (lg variant)
Hover: `background-color: rgba(white, 2%)` — very subtle

---

## Background Patterns & Gradients

**Hero:** `bg-gradient-2.svg` — covers entire section, `no-repeat`, `background-size: cover`. Acts as a gradient overlay (dark navy → darker).
**Identity section:** `linear-gradient(#e1f2fffa, #e1f2fffa)` + `bg-pattern-1.svg` at `50% 100%`, `background-size: cover`
**Engage section:** `bg-gradient-1.svg` at `0 0`, `repeat-x`, `cover` + `bg-pattern-4.svg` at `100% 100%`, `no-repeat`, `200px`
**Community section:** solid `primary (#2ca3bb)` — no pattern

---

## Nav Details

- Position: `sticky top-0`, z-index: `999`
- Height: `6rem`
- Background: `midnight-tidal (#050a1c)`
- Bottom border: `box-shadow: 0 1px 0 0 rgba(white, 11%)`
- Horizontal padding: nav container uses `width: 88%` centered (same as sections)
- Logo: `width: 250px`, always `scale(1.05)` 
- Nav links: `color: rgba(white, 50%)`, hover: bg `rgba(white, 11%)`, `color: white`; transition `color .3s`, `background-color .3s` — cubic-bezier `.165, .84, .44, 1`
- Nav link padding: `0.4rem 0.75rem`, border-radius `0.5rem`
- CTAs use same height/padding as sm buttons

---

## Transitions & Animations (from Webflow CSS)

**Global easing:** `cubic-bezier(.165, .84, .44, 1)` (ease-out-expo) used on nearly everything
**Durations used:** `.2s`, `.3s` (most common)

| Element | Property | Duration | Easing |
|---|---|---|---|
| `.btn` | `all` | `0.3s` | cubic-bezier(.165,.84,.44,1) |
| `.btn-icon` | `transform` | `0.2s` | cubic-bezier(.165,.84,.44,1) |
| `.card` (hover) | `background-color` | `0.2s` | cubic-bezier(.165,.84,.44,1) |
| `.nav-link` | `color`, `background-color` | `0.3s` | cubic-bezier(.165,.84,.44,1) |
| `a` (global) | `all` | `0.3s` | `ease-in-out` |
| `.footer-social_link` | `opacity` | `0.3s` | cubic-bezier(.165,.84,.44,1) |
| `.nav-menu_btn-bar` (hamburger) | `opacity`, `transform` | `0.3s` | cubic-bezier(.165,.84,.44,1) |
| `.nav-skip-link` | `opacity`, `margin` | `0.3s` | cubic-bezier(.165,.84,.44,1) |

**No scroll-reveal animations in Webflow source** — those are added by us with Framer Motion.

---

## Notes / Gaps

- `bg-gradient-1.svg`, `bg-gradient-2.svg` not copied to project yet (used in Engage + Hero sections)
- Community section is **teal (#2ca3bb)**, not navy — this is a significant visual difference from what we currently have
- The Webflow nav uses `width: 250px` for the logo — our current `width={140}` is too small
- Button border-radius is `0.5rem` (8px rounded rectangle), **not** `rounded-full` pill shape
- H1 line-height is `1` (tight) — hero heading should sit with very little leading
