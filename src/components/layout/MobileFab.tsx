'use client';

import { Menu } from 'lucide-react';
import { useEffect } from 'react';

import { useSystemStore } from '@/store/useSystemStore';

interface MobileFabProps {
  mainContentId: string;
}

export function MobileFab({ mainContentId }: MobileFabProps): JSX.Element {
  const sidebarMobileOpen = useSystemStore((state) => state.sidebarMobileOpen);
  const setSidebarMobileOpen = useSystemStore((state) => state.setSidebarMobileOpen);

  useEffect(() => {
    const main = document.getElementById(mainContentId);
    if (!main) return;

    if (sidebarMobileOpen) {
      main.setAttribute('inert', '');
    } else {
      main.removeAttribute('inert');
    }
  }, [mainContentId, sidebarMobileOpen]);

  return (
    <button
      type="button"
      aria-label="Open navigation"
      className="fixed bottom-4 right-4 z-40 rounded border border-matrix-green bg-component px-3 py-2 text-matrix-green shadow-glow-green lg:hidden"
      onClick={() => setSidebarMobileOpen(true)}
    >
      <span className="flex items-center gap-2 text-xs">
        <Menu size={14} aria-hidden="true" />
        {'>_'}
      </span>
    </button>
  );
}
