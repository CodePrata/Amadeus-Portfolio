/**
 * PORTFOLIO_OS — Content Registry
 * Single source of truth for all projects, certifications, and skills.
 * Components must never hardcode content — always map over these arrays.
 *
 * The `satisfies` operator validates each literal against its interface
 * without widening the type, preserving narrow string unions.
 */

import type { Certification, Project, SkillEntry } from '@/types';

// ─────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────

export const PROJECTS = [
  {
    id: 'kernel-rootkit-detector',
    title: 'LKM Rootkit Detector',
    description:
      'Linux kernel module that detects hidden processes and syscall hooks by cross-referencing /proc with direct task_struct traversal.',
    longDescription:
      'Built as a capstone exercise in kernel internals. The module walks the kernel task list, compares pids against /proc entries, and flags discrepancies that indicate a userland-hiding rootkit. Secondary scan inspects the sys_call_table for overwritten pointers.',
    logChannel: 'KERNEL',
    tags: ['C', 'Linux Kernel', 'LKM', 'Rootkit', 'Forensics'],
    vulnType: 'PrivEsc',
    githubUrl: 'https://github.com/amadeus/lkm-rootkit-detector',
    date: '2024-11-20',
    hidden: false,
  },
  {
    id: 'app-ctf-flag-server',
    title: 'CTF Flag Submission API',
    description:
      'Hardened REST API for a local CTF platform. Rate-limited, JWT-authenticated, with bcrypt-hashed flag storage and full audit logging.',
    longDescription:
      'Designed to replace a vulnerable plaintext flag checker used in a university CTF. Implemented input validation at every layer, parameterised SQL queries, short-lived JWT tokens, and a Redis-backed rate limiter. Audit log ships to a write-once S3 bucket.',
    logChannel: 'APP_DEV',
    tags: ['Node.js', 'TypeScript', 'JWT', 'Redis', 'PostgreSQL', 'REST API'],
    githubUrl: 'https://github.com/amadeus/ctf-flag-server',
    date: '2025-02-14',
    hidden: false,
  },
] satisfies Project[];

// ─────────────────────────────────────────────────────────────
// CERTIFICATIONS
// ─────────────────────────────────────────────────────────────

export const CERTIFICATIONS = [
  {
    id: 'cert-comptia-security-plus',
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    status: 'earned',
    earnedDate: '2024-08-05',
    badgeImagePath: '/assets/certs/security-plus.png',
    credentialUrl: 'https://www.credly.com/badges/example-security-plus',
    hidden: false,
  },
  {
    id: 'cert-ejpt',
    name: 'eLearnSecurity Junior Penetration Tester (eJPT)',
    issuer: 'INE Security',
    status: 'in-progress',
    targetDate: '2025-07-01',
    progressPercent: 50,
    badgeImagePath: '/assets/certs/ejpt.png',
    hidden: false,
  },
] satisfies Certification[];

// ─────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────

export const SKILLS = [
  // ── Offensive ──────────────────────────────────────────────
  {
    id: 'skill-nmap',
    name: 'Nmap',
    proficiency: 4,
    iconPath: '/assets/tools/nmap.svg',
    category: 'offensive',
    hidden: false,
  },
  {
    id: 'skill-burpsuite',
    name: 'Burp Suite',
    proficiency: 4,
    iconPath: '/assets/tools/burpsuite.svg',
    category: 'offensive',
    hidden: false,
  },
  {
    id: 'skill-metasploit',
    name: 'Metasploit',
    proficiency: 3,
    iconPath: '/assets/tools/metasploit.svg',
    category: 'offensive',
    hidden: false,
  },

  // ── Defensive ──────────────────────────────────────────────
  {
    id: 'skill-wireshark',
    name: 'Wireshark',
    proficiency: 4,
    iconPath: '/assets/tools/wireshark.svg',
    category: 'defensive',
    hidden: false,
  },
  {
    id: 'skill-splunk',
    name: 'Splunk',
    proficiency: 3,
    iconPath: '/assets/tools/splunk.svg',
    category: 'defensive',
    hidden: false,
  },

  // ── Development ────────────────────────────────────────────
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    proficiency: 5,
    iconPath: '/assets/tools/typescript.svg',
    category: 'development',
    hidden: false,
  },
  {
    id: 'skill-nextjs',
    name: 'Next.js',
    proficiency: 4,
    iconPath: '/assets/tools/nextjs.svg',
    category: 'development',
    hidden: false,
  },
  {
    id: 'skill-python',
    name: 'Python',
    proficiency: 4,
    iconPath: '/assets/tools/python.svg',
    category: 'development',
    hidden: false,
  },

  // ── Platform ───────────────────────────────────────────────
  {
    id: 'skill-linux',
    name: 'Linux',
    proficiency: 5,
    iconPath: '/assets/tools/linux.svg',
    category: 'platform',
    hidden: false,
  },
  {
    id: 'skill-docker',
    name: 'Docker',
    proficiency: 3,
    iconPath: '/assets/tools/docker.svg',
    category: 'platform',
    hidden: false,
  },
] satisfies SkillEntry[];

// ─────────────────────────────────────────────────────────────
// DERIVED HELPERS
// ─────────────────────────────────────────────────────────────

/** Returns only visible projects, sorted newest-first. */
export function getVisibleProjects(): Project[] {
  return PROJECTS.filter((p) => !p.hidden).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Returns only visible certifications. */
export function getVisibleCertifications(): Certification[] {
  return CERTIFICATIONS.filter((c) => !c.hidden);
}

/** Returns only visible skills for a given category. */
export function getSkillsByCategory(category: SkillEntry['category']): SkillEntry[] {
  return SKILLS.filter((s) => !s.hidden && s.category === category);
}
