/**
 * PORTFOLIO_OS — Constants
 * Single source of truth for all owner metadata, URLs, and path values.
 * Never import these values from anywhere else; always reference this file.
 */

import type { SocialLink } from '@/types';

// ─────────────────────────────────────────────────────────────
// OWNER
// ─────────────────────────────────────────────────────────────

export const OWNER_NAME = 'Amadeus';
export const OWNER_HANDLE = 'amadeus';
export const OWNER_TITLE = 'Cybersecurity Student & Full-Stack Developer';
export const OWNER_LOCATION = 'Manila, PH';

/** Short bio rendered in the About section and OG image. */
export const OWNER_BIO =
  'Security-minded full-stack developer. Building systems, breaking them, then securing them.';

// ─────────────────────────────────────────────────────────────
// SITE
// ─────────────────────────────────────────────────────────────

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://amadeus.dev';

export const SITE_TITLE = `${OWNER_NAME} // PORTFOLIO_OS`;

export const SITE_DESCRIPTION =
  'Cybersecurity portfolio and full-stack project log. Offensive security, CTF write-ups, and system-level engineering.';

// ─────────────────────────────────────────────────────────────
// RESUME
// ─────────────────────────────────────────────────────────────

/** Absolute public path — referenced by CLI `cat resume.pdf` and resume links. */
export const RESUME_PATH = '/assets/resume-v2.pdf';

// ─────────────────────────────────────────────────────────────
// SOCIAL LINKS
// ─────────────────────────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'github',
    url: 'https://github.com/amadeus',
    label: 'GitHub profile',
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/in/amadeus',
    label: 'LinkedIn profile',
  },
  {
    platform: 'email',
    url: 'mailto:contact@amadeus.dev',
    label: 'Send email',
  },
  {
    platform: 'tryhackme',
    url: 'https://tryhackme.com/p/amadeus',
    label: 'TryHackMe profile',
  },
  {
    platform: 'htb',
    url: 'https://app.hackthebox.com/users/amadeus',
    label: 'Hack The Box profile',
  },
];

// ─────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────

export const MAX_CLI_HISTORY_LENGTH = 200;
