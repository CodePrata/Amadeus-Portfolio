/**
 * PORTFOLIO_OS — useCommandEngine Hook
 *
 * React integration layer for the command engine. Reads the current CLI input
 * from Zustand, runs the command on submit, and dispatches side effects
 * (scroll navigation, glitch trigger, history updates) back to the store.
 *
 * This hook contains all side effects. The pure command map in
 * src/utils/commandEngine.ts remains dependency-free and fully testable.
 *
 * @example
 * const { handleSubmit } = useCommandEngine();
 * // Bind handleSubmit to the CLI input's onKeyDown (Enter key).
 */

'use client';

import { useCallback } from 'react';

import { runCommand } from '@/utils/commandEngine';
import { RESUME_PATH } from '@/data/constants';
import { useSystemStore } from '@/store/useSystemStore';
import type { SectionId } from '@/types';

/**
 * Scrolls smoothly to the section with the given id attribute in the DOM.
 * Guards against SSR by checking for `window`.
 *
 * @param sectionId - The id attribute of the target section element.
 */
function scrollToSection(sectionId: SectionId): void {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Opens the resume PDF in a new tab. The path is read from constants so
 * this hook never contains hardcoded paths (§6, §10 of .cursorrules).
 */
function openResume(): void {
  if (typeof window === 'undefined') return;
  window.open(RESUME_PATH, '_blank', 'noopener,noreferrer');
}

export interface UseCommandEngineReturn {
  /**
   * Call on Enter keypress (or form submit) in the CLI input.
   * Reads cliInput from the store, dispatches the command, clears the input.
   */
  handleSubmit: () => void;
}

/**
 * Wires the command engine to the Zustand store and browser APIs.
 *
 * @returns `handleSubmit` — call when the user presses Enter in the CLI.
 *
 * @example
 * const { handleSubmit } = useCommandEngine();
 * [input onKeyDown] => if (e.key === 'Enter') handleSubmit();
 */
export function useCommandEngine(): UseCommandEngineReturn {
  const cliInput = useSystemStore((s) => s.cliInput);
  const setCLIInput = useSystemStore((s) => s.setCLIInput);
  const pushCliHistory = useSystemStore((s) => s.pushCliHistory);
  const clearCliHistory = useSystemStore((s) => s.clearCliHistory);
  const triggerGlitch = useSystemStore((s) => s.triggerGlitch);

  const handleSubmit = useCallback(() => {
    const raw = cliInput.trim();

    // Echo the input line into history before processing.
    if (raw.length > 0) {
      pushCliHistory(`$ ${raw}`, 'input');
    }

    // Reset input field immediately for snappy UX.
    setCLIInput('');

    const result = runCommand(raw);

    switch (result.action) {
      case 'clear':
        clearCliHistory();
        break;

      case 'navigate':
        if (result.target) {
          scrollToSection(result.target);
          pushCliHistory(`[SYS] Navigating to /${result.target}...`, 'system');
        }
        break;

      case 'glitch':
        triggerGlitch();
        if (result.output) {
          pushCliHistory(result.output, 'error');
        }
        break;

      case 'output':
        if (result.output !== undefined) {
          pushCliHistory(result.output, 'output');
        }
        // Side effect: open resume when 'cat resume.pdf' is run.
        if (raw.toLowerCase() === 'cat resume.pdf') {
          openResume();
        }
        break;

      case 'error':
        if (result.output) {
          pushCliHistory(result.output, 'error');
        }
        break;

      case 'system':
        if (result.output) {
          pushCliHistory(result.output, 'system');
        }
        break;

      default: {
        // Exhaustiveness guard — TypeScript will error if a new action is
        // added to CommandActionType without a matching case here.
        const _exhaustive: never = result.action;
        void _exhaustive;
      }
    }
  }, [cliInput, setCLIInput, pushCliHistory, clearCliHistory, triggerGlitch]);

  return { handleSubmit };
}
