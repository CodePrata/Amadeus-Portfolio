'use client';

import { useEffect, useRef } from 'react';

import { CliHeader } from '@/components/layout/CliHeader';
import { MobileFab } from '@/components/layout/MobileFab';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSystemStore } from '@/store/useSystemStore';

interface ShellFrameProps {
  children: React.ReactNode;
}

export function ShellFrame({ children }: ShellFrameProps): JSX.Element {
  const cleanModeEnabled = useSystemStore((state) => state.cleanModeEnabled);
  const sidebarExpanded = useSystemStore((state) => state.sidebarExpanded);
  const firstSidebarFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (cleanModeEnabled) {
      document.body.style.animation = 'none';
      return;
    }
    document.body.style.animation = '';
  }, [cleanModeEnabled]);

  return (
    <>
      {!cleanModeEnabled && <div className="crt-overlay" />}
      <Sidebar firstFocusableRef={firstSidebarFocusableRef} />
      <div className={sidebarExpanded ? 'lg:ml-[240px]' : 'lg:ml-12'}>
        <CliHeader firstSidebarFocusableRef={firstSidebarFocusableRef} />
        <main id="main-content">{children}</main>
      </div>
      <MobileFab mainContentId="main-content" />
    </>
  );
}
