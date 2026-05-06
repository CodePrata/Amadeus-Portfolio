'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useMemo, useState, type KeyboardEvent, type RefObject } from 'react';

import { RESUME_PATH } from '@/data/constants';
import { getVisibleProjects } from '@/data/registry';
import { useSystemStore } from '@/store/useSystemStore';
import type { LogChannel, SectionId } from '@/types';

interface SidebarProps {
  firstFocusableRef: RefObject<HTMLButtonElement>;
}

type TreeFolderId = 'home' | 'projects' | 'skills' | 'certs' | 'var' | 'log' | 'comms';

const CHANNEL_TO_SECTION: Record<LogChannel, SectionId> = {
  KERNEL: 'projects',
  SEC_OPS: 'projects',
  APP_DEV: 'projects',
  SYS_ADMIN: 'projects',
};

export function Sidebar({ firstFocusableRef }: SidebarProps): JSX.Element {
  const activeSection = useSystemStore((state) => state.activeSection);
  const sidebarExpanded = useSystemStore((state) => state.sidebarExpanded);
  const sidebarMobileOpen = useSystemStore((state) => state.sidebarMobileOpen);
  const setSidebarMobileOpen = useSystemStore((state) => state.setSidebarMobileOpen);
  const toggleSidebar = useSystemStore((state) => state.toggleSidebar);
  const setActiveSection = useSystemStore((state) => state.setActiveSection);
  const [openFolders, setOpenFolders] = useState<Record<TreeFolderId, boolean>>({
    home: true,
    projects: true,
    skills: true,
    certs: true,
    var: true,
    log: true,
    comms: true,
  });

  const projectChannels = useMemo(() => {
    const visible = getVisibleProjects();
    return Array.from(new Set(visible.map((project) => project.logChannel)));
  }, []);

  const entries = useMemo(
    () => [
      { id: 'home' as SectionId, label: 'home' },
      { id: 'about' as SectionId, label: 'user_profile' },
      { id: 'skills' as SectionId, label: 'skills' },
      { id: 'certifications' as SectionId, label: 'certs' },
      { id: 'intel' as SectionId, label: 'intel_feed' },
      { id: 'contact' as SectionId, label: 'comms_uplink' },
    ],
    []
  );

  const scrollToSection = (sectionId: SectionId): void => {
    if (typeof window === 'undefined') return;
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSidebarMobileOpen(false);
  };

  const handleKeyNav = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (sidebarExpanded) {
        toggleSidebar();
      }
      setSidebarMobileOpen(false);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const focusables = Array.from(
      document.querySelectorAll<HTMLElement>('[data-tree-entry="true"]:not([aria-hidden="true"])')
    );
    const current = document.activeElement as HTMLElement | null;
    const index = focusables.findIndex((node) => node === current);
    if (index === -1) return;

    event.preventDefault();
    const next = event.key === 'ArrowDown' ? index + 1 : index - 1;
    const wrapped = next < 0 ? focusables.length - 1 : next >= focusables.length ? 0 : next;
    focusables[wrapped]?.focus();
  };

  const renderFolderButton = (folder: TreeFolderId, label: string, depth = 0): JSX.Element => {
    const open = openFolders[folder];
    return (
      <button
        type="button"
        data-tree-entry="true"
        tabIndex={0}
        aria-label={label}
        onKeyDown={handleKeyNav}
        onClick={() => setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }))}
        className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-card-hover ${
          depth > 0 ? 'pl-6' : ''
        }`}
      >
        {open ? (
          <ChevronDown size={14} aria-hidden="true" />
        ) : (
          <ChevronRight size={14} aria-hidden="true" />
        )}
        {open ? (
          <FolderOpen size={14} aria-hidden="true" />
        ) : (
          <Folder size={14} aria-hidden="true" />
        )}
        {sidebarExpanded && <span>{label}/</span>}
      </button>
    );
  };

  const navBody = (
    <nav
      aria-label="Site navigation"
      className="h-full overflow-y-auto px-2 py-4 text-sm"
      onKeyDown={handleKeyNav}
    >
      <div className="mb-2 flex items-center justify-between px-2">
        <span className="text-matrix-green/70">{sidebarExpanded ? '[+] ~/' : '~/'}</span>
        <button
          type="button"
          aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className="rounded p-1 hover:bg-card-hover"
          onClick={toggleSidebar}
        >
          {sidebarExpanded ? (
            <PanelLeftClose size={14} aria-hidden="true" />
          ) : (
            <PanelLeftOpen size={14} aria-hidden="true" />
          )}
        </button>
      </div>

      {renderFolderButton('home', 'home')}
      {openFolders.home &&
        entries
          .filter((entry) => entry.id === 'home' || entry.id === 'about')
          .map((entry, index) => (
            <button
              key={entry.id}
              ref={index === 0 ? firstFocusableRef : undefined}
              type="button"
              data-tree-entry="true"
              tabIndex={0}
              aria-label={entry.label}
              className={`flex w-full items-center gap-2 rounded px-2 py-1 pl-8 text-left hover:bg-card-hover ${
                activeSection === entry.id
                  ? 'text-matrix-green shadow-glow-green'
                  : 'text-matrix-green/80'
              }`}
              onKeyDown={handleKeyNav}
              onClick={() => scrollToSection(entry.id)}
            >
              <FileCode2 size={14} aria-hidden="true" />
              {sidebarExpanded && <span>{entry.label}</span>}
            </button>
          ))}

      {renderFolderButton('projects', 'projects')}
      {openFolders.projects &&
        projectChannels.map((channel) => (
          <button
            key={channel}
            type="button"
            data-tree-entry="true"
            tabIndex={0}
            aria-label={channel.toLowerCase()}
            className={`flex w-full items-center gap-2 rounded px-2 py-1 pl-8 text-left hover:bg-card-hover ${
              activeSection === 'projects'
                ? 'text-matrix-green shadow-glow-green'
                : 'text-matrix-green/80'
            }`}
            onKeyDown={handleKeyNav}
            onClick={() => scrollToSection(CHANNEL_TO_SECTION[channel])}
          >
            <FileCode2 size={14} aria-hidden="true" />
            {sidebarExpanded && <span>{channel.toLowerCase()}</span>}
          </button>
        ))}

      {entries
        .filter((entry) => !['home', 'about'].includes(entry.id))
        .map((entry) => (
          <button
            key={entry.id}
            type="button"
            data-tree-entry="true"
            tabIndex={0}
            aria-label={entry.label}
            className={`mt-1 flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-card-hover ${
              activeSection === entry.id
                ? 'text-matrix-green shadow-glow-green'
                : 'text-matrix-green/80'
            }`}
            onKeyDown={handleKeyNav}
            onClick={() => scrollToSection(entry.id)}
          >
            <FileCode2 size={14} aria-hidden="true" />
            {sidebarExpanded && <span>{entry.label}</span>}
          </button>
        ))}

      <a
        href={RESUME_PATH}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center gap-2 rounded px-2 py-1 text-matrix-green hover:bg-card-hover"
      >
        <FileCode2 size={14} aria-hidden="true" />
        {sidebarExpanded && <span>resume_v2.pdf</span>}
      </a>
    </nav>
  );

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen border-r border-matrix-green bg-component lg:block ${
          sidebarExpanded ? 'w-[240px]' : 'w-12'
        }`}
      >
        {navBody}
      </aside>

      <AnimatePresence>
        {sidebarMobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-component lg:hidden"
          >
            {navBody}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
