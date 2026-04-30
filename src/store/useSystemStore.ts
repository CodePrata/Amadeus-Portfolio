/**
 * PORTFOLIO_OS — Global Zustand Store
 *
 * Single store, three slices:
 *   NavigationSlice — activeSection tracking (written by useScrollSpy)
 *   UISlice         — sidebar, clean mode, glitch overlay
 *   CLISlice        — cliInput and sanitised cliHistory
 *
 * Rule: never write to cliHistory directly. Always use pushCliHistory so
 * the sanitiser is guaranteed to run before storage (§7, §10 of .cursorrules).
 */

'use client';

import { create } from 'zustand';

import { MAX_CLI_HISTORY_LENGTH } from '@/data/constants';
import { sanitiseCLIOutput } from '@/utils/sanitise';
import type { CliEntryType, CliHistoryEntry, SectionId } from '@/types';

// ─────────────────────────────────────────────────────────────
// NAVIGATION SLICE
// ─────────────────────────────────────────────────────────────

interface NavigationSlice {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
}

// ─────────────────────────────────────────────────────────────
// UI SLICE
// ─────────────────────────────────────────────────────────────

interface UISlice {
  sidebarExpanded: boolean;
  sidebarMobileOpen: boolean;
  cleanModeEnabled: boolean;
  glitchActive: boolean;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  toggleCleanMode: () => void;
  /** Activates the glitch overlay and auto-resets it after 800 ms. */
  triggerGlitch: () => void;
}

// ─────────────────────────────────────────────────────────────
// CLI SLICE
// ─────────────────────────────────────────────────────────────

interface CLISlice {
  cliInput: string;
  cliHistory: CliHistoryEntry[];
  setCLIInput: (value: string) => void;
  /**
   * Appends a new entry to cliHistory after passing content through
   * sanitiseCLIOutput. Trims history to MAX_CLI_HISTORY_LENGTH.
   *
   * @param content - Raw string from command input or output.
   * @param type    - Entry type controlling rendering colour.
   */
  pushCliHistory: (content: string, type: CliEntryType) => void;
  clearCliHistory: () => void;
}

// ─────────────────────────────────────────────────────────────
// COMBINED STORE
// ─────────────────────────────────────────────────────────────

type SystemStore = NavigationSlice & UISlice & CLISlice;

/** Singleton timeout reference — prevents multiple glitch timers stacking. */
let glitchTimer: ReturnType<typeof setTimeout> | null = null;

export const useSystemStore = create<SystemStore>((set) => ({
  // ── NavigationSlice ────────────────────────────────────────
  activeSection: 'hero',
  setActiveSection: (section) => set({ activeSection: section }),

  // ── UISlice ────────────────────────────────────────────────
  sidebarExpanded: true,
  sidebarMobileOpen: false,
  cleanModeEnabled: false,
  glitchActive: false,

  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

  toggleCleanMode: () => set((state) => ({ cleanModeEnabled: !state.cleanModeEnabled })),

  triggerGlitch: () => {
    if (glitchTimer !== null) {
      clearTimeout(glitchTimer);
    }
    set({ glitchActive: true });
    glitchTimer = setTimeout(() => {
      set({ glitchActive: false });
      glitchTimer = null;
    }, 800);
  },

  // ── CLISlice ───────────────────────────────────────────────
  cliInput: '',
  cliHistory: [],

  setCLIInput: (value) => set({ cliInput: value }),

  pushCliHistory: (content, type) =>
    set((state) => {
      const entry: CliHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        content: sanitiseCLIOutput(content),
        timestamp: Date.now(),
      };
      const updated = [...state.cliHistory, entry];
      return {
        cliHistory:
          updated.length > MAX_CLI_HISTORY_LENGTH
            ? updated.slice(updated.length - MAX_CLI_HISTORY_LENGTH)
            : updated,
      };
    }),

  clearCliHistory: () => set({ cliHistory: [] }),
}));
