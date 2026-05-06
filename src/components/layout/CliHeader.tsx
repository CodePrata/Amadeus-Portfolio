'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

import { RESUME_PATH } from '@/data/constants';
import { useCommandEngine } from '@/hooks/useCommandEngine';
import { useSystemStore } from '@/store/useSystemStore';

interface CliHeaderProps {
  firstSidebarFocusableRef: RefObject<HTMLButtonElement>;
}

const SECTION_PROMPTS: Record<string, string> = {
  home: 'amadeus@portfolio:~/home$',
  hero: 'amadeus@portfolio:~/home$',
  about: 'amadeus@portfolio:~/home/user_profile$',
  projects: 'amadeus@portfolio:~/projects$',
  skills: 'amadeus@portfolio:~/skills$',
  certifications: 'amadeus@portfolio:~/certs$',
  intel: 'amadeus@portfolio:/var/log/intel_feed$',
  contact: 'amadeus@portfolio:~/comms_uplink$',
};

export function CliHeader({ firstSidebarFocusableRef }: CliHeaderProps): JSX.Element {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const activeSection = useSystemStore((state) => state.activeSection);
  const cleanModeEnabled = useSystemStore((state) => state.cleanModeEnabled);
  const toggleCleanMode = useSystemStore((state) => state.toggleCleanMode);
  const cliInput = useSystemStore((state) => state.cliInput);
  const cliHistory = useSystemStore((state) => state.cliHistory);
  const setCLIInput = useSystemStore((state) => state.setCLIInput);
  const { handleSubmit } = useCommandEngine();
  const inputRef = useRef<HTMLInputElement>(null);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const headerHeight = useTransform(
    scrollY,
    [0, 160],
    prefersReducedMotion ? ['140px', '64px'] : ['220px', '64px']
  );
  const bootOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const prompt = useMemo(
    () => SECTION_PROMPTS[activeSection] ?? SECTION_PROMPTS.home,
    [activeSection]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
      setHistoryIndex(-1);
      inputRef.current?.focus();
      return;
    }

    if (event.key === 'Tab' && !event.shiftKey) {
      const firstSidebarItem = firstSidebarFocusableRef.current;
      if (firstSidebarItem) {
        event.preventDefault();
        firstSidebarItem.focus();
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const inputEntries = cliHistory
        .filter((entry) => entry.type === 'input')
        .map((entry) => entry.content.replace('$ ', ''));
      if (inputEntries.length === 0) return;
      const nextIndex = historyIndex < inputEntries.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIndex);
      setCLIInput(inputEntries[inputEntries.length - 1 - nextIndex] ?? '');
    }
  };

  return (
    <motion.header
      style={{ height: headerHeight }}
      className="sticky top-0 z-30 border-b border-matrix-green bg-component/95 backdrop-blur"
    >
      <div className="flex h-full flex-col justify-between px-4 py-3 lg:px-8">
        <motion.div
          style={{ opacity: bootOpacity }}
          className="hidden text-xs text-matrix-green/70 lg:block"
        >
          [BOOT] Loading shell modules...
        </motion.div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 overflow-hidden text-sm">
            <span className="truncate text-matrix-green">{prompt}</span>
            <span className="cli-cursor" aria-hidden="true" />
          </div>

          <div className="flex items-center gap-2">
            <a
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-matrix-green px-2 py-1 text-xs hover:bg-card-hover"
            >
              GET_RESUME
            </a>
            <button
              type="button"
              aria-label="Toggle clean mode"
              aria-pressed={cleanModeEnabled}
              onClick={toggleCleanMode}
              className="rounded border border-matrix-green p-1 hover:bg-card-hover"
            >
              {cleanModeEnabled ? (
                <EyeOff size={14} aria-hidden="true" />
              ) : (
                <Eye size={14} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-2 hidden lg:block">
          <input
            ref={inputRef}
            value={cliInput}
            onChange={(event) => setCLIInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-matrix-green placeholder:text-matrix-green/40 focus:outline-none"
            placeholder="type a command..."
            aria-label="CLI input"
          />
        </div>
      </div>
    </motion.header>
  );
}
