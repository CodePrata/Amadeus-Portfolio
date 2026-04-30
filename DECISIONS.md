# PORTFOLIO_OS — Decision Log

## D-001: Core Tech Stack

- **Decision:** Next.js 14+ (App Router), TypeScript (Strict), Tailwind CSS, Framer Motion, Zustand.
- **Rationale:** Optimized for Vercel deployment, high performance, and declarative UI/UX.

## D-002: Dependency Lock

- **Versions:**
  - Next.js: `^14.x` (App Router)
  - Framer Motion: `^11.x`
  - Zustand: `^4.x`
  - TypeScript: `^5.x`
  - Vitest: `^1.x` / Playwright: `^1.x`

## D-003: Performance Budget

- **JS Bundle:** < 150 KB gzipped (initial).
- **LCP:** < 2.5s on 4G.
- **CLS:** < 0.1.
- **Animation Strategy:** No heavy animation libraries loaded until after CLI hero hydration.

## D-004: Animation & A11Y Contract

- **Protocol:** Every animation MUST have a `prefers-reduced-motion` fallback.
- **Fallbacks:**
  - Typing Effect -> Instant text reveal.
  - Scanline/Glitch -> Disabled.
  - Accordion -> Instant height toggle.

## D-005: Command Engine Contract

- **Supported Commands:**
  - `ls`, `dir`, `cd`, `goto`, `clear`, `help`, `?`, `cat resume.pdf`, `whoami`, `sudo`.
- **Logic:** Command map pattern in `src/utils/commandEngine.ts`.
- **Security:** All output must pass through `sanitise.ts` parser.
