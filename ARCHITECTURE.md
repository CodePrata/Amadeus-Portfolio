# PORTFOLIO_OS — System Architecture

## 1. Data Flow & Source of Truth

The application follows a **Data-Driven UI** pattern.

- **Registry (`src/data/registry.ts`):** All projects, certifications, and skills are stored here.
- **Sidebar & Sections:** Components map over the registry. Adding a new project to the registry automatically updates the Sidebar directory tree and the Projects section.

## 2. Global State (Zustand)

We use a single store (`src/store/useSystemStore.ts`) to manage the "System State":

- **`activeSection`**: Tracks current scroll position for CLI/Sidebar sync.
- **`cliHistory`**: Persists sanitized command outputs during the session.
- **`sidebarExpanded`**: Desktop sidebar thin/thick state.
- **`cleanModeEnabled`**: Boolean to unmount CRT/Scanline overlays.

## 3. UI Synchronization Loop (Scroll-Spy)

1. **Trigger:** `IntersectionObserver` in `useScrollSpy.ts` detects a section entry.
2. **Action:** Updates `activeSection` in Zustand.
3. **Reactive Result:**
   - **Sidebar:** Highlights the corresponding "folder/file".
   - **CLI Header:** Updates the prompt path (e.g., `user@portfolio:~/projects$`).

## 4. Navigation Engine

Navigation is bi-directional:

- **CLI Navigation:** `goto [section]` command updates Zustand, which triggers a programmatic `window.scrollTo`.
- **Manual Navigation:** Scrolling or clicking sidebar links updates Zustand via the Scroll-Spy.

## 5. Component Strategy

- **Error Boundaries:** Every major section is wrapped in an `ErrorBoundary` component to ensure system stability.
- **Server vs. Client:**
  - Layout and heavy content are **Server Components** by default.
  - Animation layers and CLI input are gated as **Client Components** using `'use client'`.

## 6. Security Implementation

- **Headers:** CSP, HSTS, and X-Frame-Options configured in `next.config.js`.
- **XSS Prevention:** All CLI input/output is parsed by a character-by-character stripper in `src/utils/sanitise.ts`.
- **Assets:** 100% self-hosted to maintain a strict Content Security Policy.
