'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { formatHexDump, hexDump } from '@/utils/hexDump';
import type { LogChannel, LogLevel, Project } from '@/types';

interface ProjectLogCardProps {
  project: Project;
  expanded: boolean;
  onToggle: (projectId: string) => void;
}

const CHANNEL_STYLES: Record<LogChannel, string> = {
  KERNEL: 'border-cyber-orange/60 text-cyber-orange',
  SEC_OPS: 'border-matrix-green/60 text-matrix-green',
  APP_DEV: 'border-app-cyan/60 text-app-cyan',
  SYS_ADMIN: 'border-warn-yellow/60 text-warn-yellow',
};

const LEVEL_STYLES: Record<LogLevel, string> = {
  CRIT: 'border-cyber-orange/60 text-cyber-orange',
  WARN: 'border-warn-yellow/60 text-warn-yellow',
  INFO: 'border-matrix-green/60 text-matrix-green',
  DEBUG: 'border-app-cyan/60 text-app-cyan',
};

function mapLevelFromChannel(channel: LogChannel): LogLevel {
  if (channel === 'KERNEL') return 'CRIT';
  if (channel === 'SYS_ADMIN') return 'WARN';
  if (channel === 'APP_DEV') return 'DEBUG';
  return 'INFO';
}

export function ProjectLogCard({ project, expanded, onToggle }: ProjectLogCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const level = mapLevelFromChannel(project.logChannel);
  const hexRows = hexDump(project.longDescription ?? project.description);

  return (
    <motion.article layout className="rounded border border-matrix-green/25 bg-component">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => onToggle(project.id)}
        className="w-full rounded px-4 py-3 text-left transition hover:bg-card-hover hover:shadow-glow-green"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-matrix-green/60">
            {new Date(project.date).toISOString().slice(0, 10)}
          </span>
          <span className={`rounded border px-2 py-0.5 ${CHANNEL_STYLES[project.logChannel]}`}>
            {project.logChannel}
          </span>
          <span className={`rounded border px-2 py-0.5 ${LEVEL_STYLES[level]}`}>{level}</span>
        </div>
        <p className="mt-2 text-base font-semibold text-matrix-green">{project.title}</p>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            layout
            initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid gap-3 border-t border-matrix-green/20 p-4 lg:grid-cols-[1fr_320px]"
          >
            <div className="space-y-3">
              <p className="text-sm text-matrix-green/85">
                {project.longDescription ?? project.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-matrix-green/80">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded border border-matrix-green/30 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-matrix-green underline-offset-4 hover:underline"
                  >
                    Artifact: source
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-app-cyan underline-offset-4 hover:underline"
                  >
                    Artifact: live
                  </a>
                ) : null}
              </div>
            </div>

            <aside className="hidden rounded border border-matrix-green/20 bg-void/70 p-3 lg:block">
              <p className="mb-2 text-xs text-matrix-green/70">HEXDUMP / 16-BYTE WIDTH</p>
              <pre className="overflow-x-auto text-[11px] text-matrix-green/75">
                {formatHexDump(hexRows)}
              </pre>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
