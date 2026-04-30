# PORTFOLIO_OS — Master Development Task List

> **Stack:** Next.js 14+ (App Router) · TypeScript (Strict) · Tailwind CSS · Framer Motion · Zustand
> **Deploy:** Vercel · **Icons:** Lucide React + Local SVGs · **Testing:** Vitest + Playwright
> **Design system:** Matrix Green `#00FF41` primary · Cyberpunk Orange `#FF5F00` accent · App Cyan `#00CCFF`

---

## How to read this document

Each task is prefixed with a priority tag:

| Tag          | Meaning                                           |
| ------------ | ------------------------------------------------- |
| `[CRITICAL]` | Blocks UX, security, or correctness — do not skip |
| `[HIGH]`     | Degrades quality or performance if skipped        |
| `[A11Y]`     | Accessibility — WCAG AA requirement               |
| `[SEO]`      | Search engine and social shareability             |
| `[DX]`       | Developer experience and maintainability          |
| `[FEATURE]`  | Core product feature                              |
| `[POLISH]`   | Final layer of visual and interaction detail      |

Phases are sequenced so that every phase produces a shippable, coherent build state. You can stop at the end of any phase and have a working product.

---

## Phase 0 — Pre-Flight Decisions

> No code is written in this phase. These are planning and design decisions that must be locked before scaffolding begins. Changing them mid-build is expensive.

- [ ] `[DX]` Lock the exact versions of all major dependencies before scaffolding — Next.js, Framer Motion, Zustand, Vitest, Playwright — and record them in a `DECISIONS.md` file at the repo root.
- [ ] `[HIGH]` Define the performance budget and record it in `DECISIONS.md`: initial JS bundle under 150 KB gzipped, LCP under 2.5 s on simulated 4G, CLS under 0.1, and no animation library loaded until after the CLI hero section hydrates.
- [ ] `[A11Y]` Establish the `prefers-reduced-motion` contract in `DECISIONS.md`. Every animation in the project — typing effect, scan line, glitch, accordion, hover glow, CRT flicker — must have a corresponding no-motion fallback defined before any animation is written.
- [ ] `[FEATURE]` Finalise the sidebar directory tree path strings before writing any component code. Every path label in the sidebar must be agreed and documented so the dynamic generation logic has a stable target to produce.
- [ ] `[FEATURE]` Finalise the full command map contract in `DECISIONS.md`. Every CLI command, its aliases, and its exact side effect must be defined before the command engine is written. Commands to include: `ls` / `dir`, `cd` / `goto`, `clear`, `help` / `?`, `cat resume.pdf`, `whoami`, and `sudo`.

---

## Phase 1 — System Initialisation (Foundations)

### 1.1 Project Scaffolding

- [ ] `[FEATURE]` Initialise the Next.js 14+ project with TypeScript strict mode, Tailwind CSS, ESLint, and App Router enabled.
- [ ] `[FEATURE]` Install all core dependencies in a single pass: Framer Motion, Zustand, Lucide React, Vitest, Playwright, and their type definitions.
- [ ] `[DX]` Create `.env.example` at the repo root immediately. Even though the app has no secrets today, establish the pattern so future additions have a documented home. Include the resume version variable as the first entry.

### 1.2 Directory Structure

- [ ] `[DX]` Establish the full directory structure before writing any component. Create placeholder barrel files in each folder so imports resolve correctly from day one. Key folders: `components/layout`, `components/sections`, `components/ui`, `data`, `hooks`, `store`, `types`, `utils`, and `tests/unit` plus `tests/e2e`. Key files to scaffold immediately: `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `utils/sanitise.ts`, `data/constants.ts`.
- [ ] `[DX]` Create the full public asset folder structure: `public/assets/fonts`, `public/assets/tools`, `public/assets/certs`. Place the resume PDF at `public/assets/resume-v2.pdf`.

### 1.3 Tailwind Configuration

- [ ] `[FEATURE]` Update `tailwind.config.ts` with the full custom colour token set. Backgrounds: `void` (`#000000`), `component` (`#0D0D0D`), `card-hover` (`#121212`). Accents: `matrix-green` (`#00FF41`), `cyber-orange` (`#FF5F00`), `app-cyan` (`#00CCFF`), `warn-yellow` (`#FFD700`). Register JetBrains Mono as the sole monospace font family.

### 1.4 Global CSS

- [ ] `[FEATURE]` Create `globals.css` with the following layers in this exact order: `@font-face` declarations pointing to local font files with `font-display: optional` to eliminate CLS, base resets establishing the black background and green text defaults, the `flicker` keyframe for ambient CRT pulse, the `glitch` keyframe for the sudo easter egg, the `scanline-sweep` keyframe for the skills section, the `typing-cursor` keyframe for the blinking caret, and the CRT scanline overlay styles.
- [ ] `[A11Y]` Add the `prefers-reduced-motion` override block as the final rule in `globals.css` so it wins the cascade. It must set animation duration to near-zero and iteration count to one for every element in the document. This is non-negotiable and must not be moved to a later phase.

### 1.5 Favicon and PWA Assets

- [ ] `[HIGH]` Design the favicon as a minimal `>_` terminal prompt glyph in matrix green on a black background. Export as `favicon.ico` (multi-res), `favicon.svg` (scalable), and `apple-touch-icon.png` (180×180).
- [ ] `[HIGH]` Create `manifest.json` with the site name, short name, black theme colour, black background colour, standalone display mode, and icon references.
- [ ] `[HIGH]` Add the manifest link and theme-colour meta tag to `layout.tsx`.

---

## Phase 2 — Data Layer (The Registry)

### 2.1 Type Definitions

- [ ] `[FEATURE]` Create `src/types/index.ts` with strict TypeScript interfaces for every data shape used in the application. No `any`, no implicit `string`. Types to define: `LogChannel` (union of KERNEL, SEC_OPS, APP_DEV, SYS_ADMIN), `LogLevel` (union of CRIT, WARN, INFO), `CertStatus` (union of active, studying, planned), `SkillCategory` (union of language, tool, platform, concept), `VerboseDetails`, `Project`, `Certification`, `Skill`, and `IntelEntry`. Every field must be explicitly typed including optional fields.

### 2.2 Constants File

- [ ] `[DX]` Create `src/data/constants.ts` as the single source of truth for values referenced in more than one place. Must include: resume path, GitHub URL, LinkedIn URL, email address, owner real name, owner handle, and owner role. Updating the resume version means editing exactly one line in this file.

### 2.3 Registry Population

- [ ] `[FEATURE]` Populate `src/data/registry.ts` with all initial real data: manually selected GitHub projects with `hidden: false`, excluded or unfinished projects with `hidden: true`, CompTIA Security+ with studying status and 50% progress, all skills and tools with valid icon paths, and one placeholder intel entry with `hidden: true` to validate the type.
- [ ] `[HIGH]` Source and save all required SVG tool icons to the tools asset folder. Use Simple Icons for tool-specific logos. Verify each file renders correctly before committing — a broken SVG path produces a blank icon in production.

### 2.4 Hex Dump Utility

- [ ] `[FEATURE]` Create `src/utils/hexDump.ts`. This pure utility function accepts a string, converts each character to its two-digit hex code, and returns an array of rows each containing 16 hex bytes and the printable ASCII representation. Non-printable characters render as a dot. Output must be deterministic — the same input always produces the same result. Also export a formatting helper for rendering the rows as display strings.

### 2.5 CLI Output Sanitiser

- [ ] `[CRITICAL]` Create `src/utils/sanitise.ts` before the command engine is built. Export a function that strips all HTML tags from a string using a character-by-character parser. All CLI history entries must pass through this function before being stored in Zustand state — this eliminates the self-XSS vector where user-injected input could be rendered as HTML. Write unit tests for this function before it is used anywhere else in the codebase.

---

## Phase 3 — Global State (The Brain)

### 3.1 Zustand Store

- [ ] `[FEATURE]` Create `src/store/useSystemStore.ts` with all state slices in one store, grouped by concern with inline comments. Navigation state: `activeSection` string and its setter. Sidebar state: `sidebarExpanded` boolean for desktop thin/thick toggle, `sidebarMobileOpen` boolean for mobile overlay, and their setters. CLI state: `cliInput` string, `cliHistory` string array (all entries sanitised before insertion), and actions for setting input, pushing to history, and clearing history. Accordion state: `activeProjectId` nullable string and its setter. UX state: `cleanModeEnabled` boolean, `glitchActive` boolean, a toggle for clean mode, and a glitch trigger that sets `glitchActive` true for 800 ms then resets it automatically.

### 3.2 Command Engine

- [ ] `[FEATURE]` Create `src/utils/commandEngine.ts` as a command map object keyed by command string with typed handler functions. Each handler receives the full argument string and a reference to Zustand store actions. Unknown commands return a themed error message. All output strings pass through the sanitiser before being returned. The sudo handler calls the glitch trigger and returns a staged response with a personal message or CTF reference after a simulated delay.
- [ ] `[FEATURE]` Create `src/hooks/useCommandEngine.ts` as a React hook wrapping the command map, reading CLI input from Zustand, and exposing an `executeCommand` function for use in the CLI header component.

### 3.3 Scroll-Spy Hook

- [ ] `[FEATURE]` Create `src/hooks/useScrollSpy.ts`. This hook accepts an array of section IDs, creates a single `IntersectionObserver` (not one per section) with a 0.4 threshold, and calls `setActiveSection` in Zustand when a section enters the viewport. Must include an SSR guard and return a cleanup function for use in `useEffect`.

---

## Phase 4 — Shell Layout (Global UI Frame)

### 4.1 Error Boundary

- [ ] `[CRITICAL]` Create `src/components/layout/ErrorBoundary.tsx` before any other component is built. This class component must implement `componentDidCatch` and `getDerivedStateFromError`, accept a custom fallback prop, and render a themed terminal error state by default showing the error code, process exit code, and a reload instruction. Wrap every section component in its own `ErrorBoundary` instance in `page.tsx` — a crash in the projects section must not bring down the skills section.

### 4.2 404 Page

- [ ] `[HIGH]` Create `src/app/not-found.tsx` with a black background, full viewport height, themed terminal error output showing the 404 code and a styled link to navigate home. No sidebar or CLI header — keep it isolated and fast to load.

### 4.3 Persistent Root Header (CLI Bar)

- [ ] `[FEATURE]` Build `src/components/layout/CliHeader.tsx`. Full hero state occupies the top of the page and shows the boot sequence. Docked state collapses to a single-line command bar on scroll using Framer Motion scroll utilities. The prompt string updates reactively by reading `activeSection` from Zustand. Contains a controlled input wired to the command engine hook — `Enter` executes and clears, `ArrowUp` cycles command history. Top-right area contains the `GET_RESUME` button (opens resume PDF in a new tab) and the `CLEAN_MODE` eye-icon toggle with correct `aria-pressed` state.
- [ ] `[A11Y]` Implement explicit keyboard focus management in the CLI header. After command execution, focus stays in the input. Pressing `Tab` from within the input must move focus to the first focusable sidebar element — never trap the user in the header. Implement with a ref on the sidebar's first focusable element.
- [ ] `[FEATURE]` Define mobile behaviour explicitly: on viewports below 1024 px, the CLI input is hidden and typing is disabled. Only the prompt string and the two control buttons remain visible in the docked bar. The FAB handles mobile navigation instead.

### 4.4 Hybrid-Fixed Sidebar

- [ ] `[FEATURE]` Build `src/components/layout/Sidebar.tsx`. Desktop layout is fixed position, full viewport height, left edge. Width transitions between icon-only (48 px) and full text (240 px) states. Visual design uses a 1 px matrix-green right border and a `#121212` background. Directory tree is dynamically generated from the registry — if a new log channel is added to the data, the sidebar folder appears automatically with no component changes needed. ASCII glyphs distinguish expanded folders, collapsed folders, and the active file. The active entry reads `activeSection` from Zustand and glows in matrix green. The resume appears as a static entry at the bottom of the tree.
- [ ] `[A11Y]` Implement full keyboard navigation on the sidebar tree. Arrow keys traverse entries, `Enter` activates the focused entry, `Escape` collapses the sidebar. All entries must have `tabIndex={0}` and visible focus styles. Add `aria-label="Site navigation"` to the nav element and `aria-label` attributes matching directory names on each list.

### 4.5 Mobile FAB

- [ ] `[FEATURE]` Build `src/components/layout/MobileFab.tsx`. Visible only below 1024 px. Fixed bottom-right. Styled as a terminal prompt button. Tap opens the sidebar as a full-screen overlay with a Framer Motion slide-in from the left. The overlay must trap focus while open using either a focus trap utility or the `inert` attribute on the main content.

### 4.6 Root Layout

- [ ] `[FEATURE]` Build `src/app/layout.tsx` rendering the CLI header, sidebar, and main content in correct DOM order. The CRT scanline overlay is conditionally rendered based on `cleanModeEnabled` state using a thin client wrapper to avoid making the entire layout client-side. Main content area margin-left matches the sidebar width on desktop, driven by a CSS variable or Tailwind arbitrary value that updates with sidebar state.

---

## Phase 5 — Core Sections

### 5.1 `[ HOME ]` — CLI Boot Hero

- [ ] `[FEATURE]` Build `src/components/ui/BootSequence.tsx` using Framer Motion staggered children to reveal each boot log line sequentially with a 120 ms stagger. Lines cover BIOS init, kernel load, filesystem mount, network connection, user profile load, and a welcome message. After all lines appear, a blinking block cursor idles using the typing-cursor keyframe. The `prefers-reduced-motion` fallback shows all lines simultaneously with no delay.
- [ ] `[FEATURE]` Build `src/components/sections/HeroSection.tsx` containing the boot sequence component at full viewport height. Section ID set to `home` for scroll-spy targeting.

### 5.2 `[ PROJECTS ]` — System Logs

- [ ] `[FEATURE]` Build `src/components/sections/ProjectsSection.tsx` reading projects from the registry filtered by `hidden: false`. Passes `activeProjectId` and its setter from Zustand to each card — only one card can be open at a time.
- [ ] `[FEATURE]` Build `src/components/ui/ProjectLogCard.tsx` with two distinct states. Collapsed state renders a single-line log entry with timestamp, log channel badge (colour-coded by channel), log level badge, and title. Hover triggers a glow-bloom and micro-flicker. Click expands the card or collapses it if already active. Expanded state uses Framer Motion AnimatePresence and the layout prop for automatic height animation, revealing a left panel with all verbose metadata and artifact links, and a decorative right panel with the hex dump output — the right panel is hidden on mobile. All external links open in a new tab. The card toggle button carries correct `aria-expanded` state.

### 5.3 `[ SKILLS ]` — Technical Spec Sheet

- [ ] `[FEATURE]` Build `src/components/sections/SkillsSection.tsx` grouping skills into four categories. Before the scroll-spy trigger, all badges render in a desaturated dim state. When the section enters the viewport, a Framer Motion scan line element animates top-to-bottom once and skills light up in a staggered sequence timed to appear illuminated by the passing bar. The scan fires once per page load, not on every scroll. The `prefers-reduced-motion` fallback shows all skills at full opacity immediately with no scan animation. Tool icons use `next/image` with explicit dimensions for CLS prevention.
- [ ] `[A11Y]` Each skill badge must carry an `aria-label` stating the skill name and proficiency level out of five.

### 5.4 `[ CERTS ]` — Authorization Grid

- [ ] `[FEATURE]` Build `src/components/sections/CertsSection.tsx` reading certifications from the registry. Filter out `planned` status at the section level so no DOM nodes are created for them.
- [ ] `[FEATURE]` Build `src/components/ui/CertBadge.tsx` accepting a full certification object. Active status renders the full badge image, an AUTHORIZED tag in matrix green, and an expandable verbose mode with issue date, expiry date, verification link, and domains acquired. Studying status renders the badge image with a greyscale low-brightness filter as an encrypted silhouette, an AUTH_PENDING tag in cyber-orange, and a progress bar — CompTIA Security+ is the current example at 50%. Planned status returns null with no DOM output whatsoever.
- [ ] `[A11Y]` The progress bar must carry `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and a descriptive `aria-label`.

### 5.5 `[ USER_PROFILE ]` — Personnel File

- [ ] `[FEATURE]` Build `src/components/sections/ProfileSection.tsx` styled as a personnel file terminal dump. Fields to include: USER (real name and handle), ROLE, PRIVILEGES, LOGON_HISTORY (past roles and experience), CLEARANCE (education and background), and SYSTEM_HARDENING (soft skills listed as system properties). Each field row revealed with a Framer Motion staggered fade-in on scroll entry. The `prefers-reduced-motion` fallback shows all rows immediately.

### 5.6 `[ COMMS_UPLINK ]` — Secure Contact

- [ ] `[FEATURE]` Build `src/components/sections/CommsSection.tsx` with three contact nodes — GitHub, LinkedIn, and Email — rendered as terminal link entries. URLs sourced from `constants.ts` only. Hover state triggers a glow-bloom and a one-line status message with an animated ellipsis. All links open in a new tab with `rel="noopener noreferrer"`.

### 5.7 `[ INTEL_FEED ]` — Threat Intelligence

- [ ] `[FEATURE]` Build `src/components/sections/IntelSection.tsx`. When no visible entries exist, render an idle listening state showing the interface status, monitor mode active message, and a no-intel-captured system message. The listening line pulses in opacity using a Framer Motion animation loop. When entries exist, render them using the same log card pattern as the projects section with intel-specific metadata fields: threat actor, vulnerability, and mitigation. The `prefers-reduced-motion` fallback shows static text with no pulse.

---

## Phase 6 — Interaction and Polish

### 6.1 Digital Haptics Pass

- [ ] `[POLISH]` Audit every interactive element and apply consistent micro-interaction behaviour. Hover glow-bloom uses matrix-green box-shadow applied via Framer Motion `whileHover` with a 150 ms transition. Click micro-flicker triggers the flicker keyframe for 300 ms on `mousedown`. Within the skills section, a subtle scanning highlight tracks mouse horizontal position using a `mousemove` listener updating a CSS custom property.

### 6.2 `sudo` Easter Egg

- [ ] `[POLISH]` Implement the full glitch sequence. The CLI outputs an authenticating message. A full-viewport overlay applies the glitch keyframe using rapid clip-path slicing and translateX offsets across three layers for 800 ms. After 800 ms, `glitchActive` resets and the overlay unmounts. The CLI history then receives the staged access-granted response with a personal message or CTF reference. The `prefers-reduced-motion` fallback skips the visual glitch entirely and outputs only the text response.

### 6.3 CLI and Sidebar Sync Verification

- [ ] `[FEATURE]` Verify the full sync loop works in both directions. CLI command to section: typing a goto command fires `setActiveSection`, the sidebar expands and highlights the correct entry, and the page scrolls to the target. Manual scroll to section: the IntersectionObserver fires, `setActiveSection` updates, the sidebar highlights the new entry, and the CLI prompt path updates. Both paths require E2E test coverage.

### 6.4 Clean Mode Verification

- [ ] `[POLISH]` Verify that toggling clean mode unmounts the CRT scanline overlay from the DOM entirely (not just hidden), disables the flicker keyframe on the root body, and leaves all content, colours, and layout completely unaffected. The toggle state persists within the session in Zustand memory but does not need to persist across sessions.

---

## Phase 7 — SEO, Hardening, and Deployment

### 7.1 SEO Files

- [ ] `[SEO]` Create `src/app/robots.ts` using the Next.js file convention to serve a robots.txt that allows all crawlers and points to the sitemap URL.
- [ ] `[SEO]` Create `src/app/sitemap.ts` using the Next.js file convention to serve a sitemap with the production domain URL and a last-modified date.
- [ ] `[SEO]` Create `src/app/opengraph-image.tsx` using the Next.js ImageResponse API. Design it as a terminal screenshot: black background, matrix green text rendering a whoami response and a brief skills summary. Use JetBrains Mono via the fonts export option. This image is automatically served and picked up by the Metadata API.
- [ ] `[SEO]` Configure the Metadata export in `layout.tsx` with the full title, description, Open Graph fields (title, description, URL, site name, type), Twitter card fields, and robots indexing rules.

### 7.2 Security Headers

- [ ] `[CRITICAL]` Configure all security headers in `next.config.js` applying to all routes. Headers to include: a strict Content Security Policy restricting script-src to self and unsafe-inline only where required for Next.js hydration, X-Content-Type-Options set to nosniff, X-Frame-Options set to DENY, Referrer-Policy set to origin-when-cross-origin, Strict-Transport-Security with a two-year max-age and includeSubDomains and preload directives, and Permissions-Policy disabling camera, microphone, and geolocation. After deployment, verify all headers at securityheaders.com and target a grade of A.

### 7.3 Documentation

- [ ] `[DX]` Write `ARCHITECTURE.md` at the repo root covering: the data flow from registry to sections, sidebar, and CLI; what lives in Zustand versus local component state and why; how to add a new CLI command in three steps; which sections have their own error boundary and what each fallback renders; the resume update workflow; and the `hidden` flag convention for toggling content without touching component code.
- [ ] `[DX]` Add JSDoc comments to every exported function in the utils folder and every custom hook. Each comment must include param descriptions with types, a return description with type, and a one-liner usage example.

### 7.4 Testing

- [ ] `[CRITICAL]` Write unit tests for the sanitiser (minimum five cases covering plain text, HTML tags, script injection, empty string, and unicode), the hex dump utility (deterministic output, correct row length, correct ASCII fallback), the command engine (each command produces the expected output and calls the expected store action), and the cert badge component (planned returns null, studying renders progress bar with correct aria attributes, active renders full badge).
- [ ] `[HIGH]` Write E2E tests with Playwright covering: boot sequence completion and sidebar visibility, goto CLI command scrolling to the correct section and updating the sidebar highlight, project card accordion behaviour (expanding one collapses any previously open card), the GET_RESUME button opening a new tab with the correct PDF path, and the 404 page rendering for a nonexistent route.

### 7.5 Vercel Deployment

- [ ] `[FEATURE]` Connect the GitHub repository to a new Vercel project, configure the production domain, and verify DNS propagation.
- [ ] `[HIGH]` Confirm the resume PDF is accessible at the production URL after first deployment.
- [ ] `[HIGH]` Verify all six security headers are present in the response using `curl -I` against the production domain.
- [ ] `[HIGH]` Run a Lighthouse audit targeting Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, and SEO ≥ 95. If any animation degrades the performance score, confirm it is gated behind the reduced-motion media query and consider deferring the component with dynamic import and SSR disabled.

---

## Phase 8 — Future Backlog (Out of Scope for V1)

- [ ] First real intel feed entry — TryHackMe micro-writeup in the three-sentence log format.
- [ ] CLI autocomplete — Tab key cycles through matching command prefixes.
- [ ] Animated page transitions between sections using Framer Motion layoutId.
- [ ] RSS feed for intel entries served at `/intel/feed.xml`.
- [ ] Privacy-respecting analytics (Plausible) with a CSP-compliant script added to the allowlist.
- [ ] Expand the sudo easter egg to decode a Base64 string in the CLI resolving to a hidden personal message or CTF flag.
- [ ] TryHackMe or HackTheBox activity badge embedded in the user profile section as a live external image, requiring a relaxed img-src CSP to include the badge provider domain.

---

## Quick Reference — Colour and Channel Mapping

| Log Channel      | Colour           | Hex       | Use case                               |
| ---------------- | ---------------- | --------- | -------------------------------------- |
| KERNEL / CRIT    | Cyberpunk Orange | `#FF5F00` | Pen-tests, exploits, capstone projects |
| SEC_OPS / INFO   | Matrix Green     | `#00FF41` | Security tools, hardening scripts      |
| APP_DEV / DEPLOY | App Cyan         | `#00CCFF` | General web apps, frontend projects    |
| SYS_ADMIN / WARN | Warn Yellow      | `#FFD700` | Scripting, automation, maintenance     |

## Quick Reference — Certification Status Rendering

| Status     | Badge                | Tag                | Extra                                         |
| ---------- | -------------------- | ------------------ | --------------------------------------------- |
| `active`   | Full colour          | STATUS: AUTHORIZED | Verbose mode with dates and verification link |
| `studying` | Greyscale silhouette | AUTH_PENDING       | Progress bar showing percentage decrypted     |
| `planned`  | Not rendered         | —                  | Component returns null                        |

## Quick Reference — Sidebar Directory Structure

```
[+] ~/
  [-] home/
    >  home
    >  user_profile
    >  resume_v2.pdf
  [-] projects/
    >  kernel/
    >  sec_ops/
    >  app_dev/
    >  sys_admin/
  [-] skills/
  [-] certs/
  [-] var/
    [-] log/
      >  intel_feed
  [-] comms_uplink/
```
