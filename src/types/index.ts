/**
 * PORTFOLIO_OS — Shared TypeScript Types
 * Single source of truth for all interfaces and union types.
 * Import from here; never re-declare types in component files.
 */

// ─────────────────────────────────────────────────────────────
// LOG SYSTEM UNIONS
// ─────────────────────────────────────────────────────────────

/** Terminal log channel — maps to a colour token (see .cursorrules §3). */
export type LogChannel = 'KERNEL' | 'SEC_OPS' | 'APP_DEV' | 'SYS_ADMIN';

/** Severity level of a log entry. */
export type LogLevel = 'INFO' | 'WARN' | 'CRIT' | 'DEBUG';

// ─────────────────────────────────────────────────────────────
// CERTIFICATION
// ─────────────────────────────────────────────────────────────

/**
 * Certification lifecycle status.
 * CertBadge returns null for 'planned' — this is intentional and tested.
 */
export type CertStatus = 'earned' | 'in-progress' | 'planned';

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: CertStatus;
  /** ISO date string, e.g. "2024-03-15" */
  earnedDate?: string;
  /** ISO date string for target completion */
  targetDate?: string;
  /** Progress 0–100, used when status is 'in-progress' */
  progressPercent?: number;
  /** Absolute path under /public/assets/certs/ */
  badgeImagePath?: string;
  credentialUrl?: string;
  hidden?: boolean;
}

// ─────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────

export type VulnType = 'XSS' | 'SQLi' | 'SSRF' | 'RCE' | 'PrivEsc' | 'Recon' | 'Crypto' | 'Misc';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  logChannel: LogChannel;
  tags: string[];
  vulnType?: VulnType;
  githubUrl?: string;
  liveUrl?: string;
  /** ISO date string */
  date: string;
  hidden?: boolean;
}

// ─────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────

/** Proficiency on a 1–5 scale (aria-label reads "X of 5"). */
export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

export interface SkillEntry {
  id: string;
  name: string;
  proficiency: ProficiencyLevel;
  /** Path to SVG under /public/assets/tools/ */
  iconPath?: string;
  category: 'offensive' | 'defensive' | 'development' | 'platform';
  hidden?: boolean;
}

// ─────────────────────────────────────────────────────────────
// INTEL / BLOG ENTRIES (optional future content)
// ─────────────────────────────────────────────────────────────

export interface IntelEntry {
  id: string;
  title: string;
  summary: string;
  logChannel: LogChannel;
  tags: string[];
  /** ISO date string */
  date: string;
  externalUrl?: string;
  hidden?: boolean;
}

// ─────────────────────────────────────────────────────────────
// NAVIGATION & SECTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Section IDs used as scroll-spy targets and CLI navigation destinations.
 * Must match the `id` attributes on section wrapper elements in page.tsx.
 */
export type SectionId =
  | 'home'
  | 'hero'
  | 'about'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'intel'
  | 'contact';

export interface NavSection {
  id: SectionId;
  label: string;
  logChannel: LogChannel;
  /** Sidebar icon from Lucide React */
  iconName: string;
}

// ─────────────────────────────────────────────────────────────
// CLI HISTORY
// ─────────────────────────────────────────────────────────────

export type CliEntryType = 'input' | 'output' | 'error' | 'system';

export interface CliHistoryEntry {
  id: string;
  type: CliEntryType;
  /** Content has already been passed through sanitiseCLIOutput before storage. */
  content: string;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────
// OWNER / META (read from constants.ts, types defined here)
// ─────────────────────────────────────────────────────────────

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'email' | 'tryhackme' | 'htb';
  url: string;
  /** aria-label for the icon-only link */
  label: string;
}
