'use client';

import { motion, useReducedMotion } from 'framer-motion';

const BOOT_LINES = [
  '[BIOS] Initializing firmware tables...',
  '[KERNEL] Loading hardened kernel modules...',
  '[FS] Mounting encrypted volumes...',
  '[NET] Establishing uplink tunnel...',
  '[PROFILE] Loading operator profile: amadeus',
  '[OK] Welcome to PORTFOLIO_OS',
] as const;

export function BootSequence(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : 'hidden'}
      animate="visible"
      variants={
        prefersReducedMotion
          ? undefined
          : {
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12 },
              },
            }
      }
      className="w-full rounded border border-matrix-green/30 bg-component/70 p-4 text-sm lg:text-base"
      aria-label="System boot logs"
    >
      {BOOT_LINES.map((line) => (
        <motion.p
          key={line}
          variants={
            prefersReducedMotion
              ? undefined
              : {
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                }
          }
          className="font-mono text-matrix-green/90"
        >
          {line}
        </motion.p>
      ))}
      <span className="cli-cursor mt-3" aria-hidden="true" />
    </motion.div>
  );
}
