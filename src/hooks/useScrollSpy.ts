'use client';

import { useEffect } from 'react';

import { useSystemStore } from '@/store/useSystemStore';
import type { SectionId } from '@/types';

/**
 * Tracks section visibility with one IntersectionObserver and syncs active section to Zustand.
 *
 * @param sectionIds - Ordered list of section element ids to observe.
 * @returns Void cleanup through effect teardown.
 * @example
 * useScrollSpy(['hero', 'projects']);
 */
export function useScrollSpy(sectionIds: SectionId[]): void {
  const setActiveSection = useSystemStore((state) => state.setActiveSection);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { threshold: 0.4 }
    );

    sectionIds.forEach((id) => {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, setActiveSection]);
}
