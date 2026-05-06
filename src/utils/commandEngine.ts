/**
 * PORTFOLIO_OS — Command Engine
 *
 * Pure command map: maps command strings to handler functions.
 * Handlers receive the full tokenised argv and return a CommandResult.
 *
 * This module is pure — it has no side effects and imports no React/Zustand.
 * Side effects (scrolling, Zustand writes) are executed by useCommandEngine.ts
 * which reads the CommandResult and acts on it.
 *
 * Supported commands (D-005):
 *   ls / dir  — list available sections
 *   cd / goto — navigate to a section
 *   whoami    — display owner identity card
 *   help / ?  — list all commands
 *   clear     — clear terminal history
 *   cat       — display file content (resume.pdf supported)
 *   sudo      — triggers system glitch (access denied, theatrically)
 */

import {
  OWNER_HANDLE,
  OWNER_NAME,
  OWNER_TITLE,
  OWNER_LOCATION,
  RESUME_PATH,
} from '@/data/constants';
import type { SectionId } from '@/types';

// ─────────────────────────────────────────────────────────────
// RESULT TYPE
// ─────────────────────────────────────────────────────────────

export type CommandActionType =
  | 'output' // plain text output to terminal
  | 'error' // error text — rendered in KERNEL (orange)
  | 'clear' // wipe cliHistory
  | 'navigate' // scroll to a section
  | 'glitch' // trigger the glitch overlay
  | 'system'; // system-level message (boot / status)

export interface CommandResult {
  action: CommandActionType;
  /** Text rendered in the terminal. Undefined for 'clear' and 'navigate'. */
  output?: string;
  /** Target section for 'navigate' action. */
  target?: SectionId;
}

// ─────────────────────────────────────────────────────────────
// SECTION MAP
// ─────────────────────────────────────────────────────────────

/** Maps user-facing directory names to SectionId values. */
const SECTION_ALIASES: Record<string, SectionId> = {
  hero: 'home',
  home: 'home',
  about: 'about',
  projects: 'projects',
  project: 'projects',
  skills: 'skills',
  skill: 'skills',
  certifications: 'certifications',
  certs: 'certifications',
  cert: 'certifications',
  intel: 'intel',
  contact: 'contact',
};

const SECTION_LISTING = Object.keys(SECTION_ALIASES)
  .filter((k, i, arr) => arr.indexOf(k) === i)
  .join('  ');

// ─────────────────────────────────────────────────────────────
// COMMAND HANDLER TYPE
// ─────────────────────────────────────────────────────────────

type CommandHandler = (argv: string[]) => CommandResult;

// ─────────────────────────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────────────────────────

const handleLs: CommandHandler = (): CommandResult => ({
  action: 'output',
  output: [
    'drwxr-xr-x  portfolio/',
    `  drwxr-xr-x  home/       about/      projects/`,
    `  drwxr-xr-x  skills/     certs/      intel/      contact/`,
    '',
    `Usage: cd [section]   e.g.  cd projects`,
  ].join('\n'),
});

const handleCd: CommandHandler = (argv): CommandResult => {
  const target = argv[1]?.toLowerCase().replace(/^\//, '');
  if (!target) {
    return { action: 'error', output: 'cd: missing operand. Usage: cd [section]' };
  }
  const sectionId = SECTION_ALIASES[target];
  if (!sectionId) {
    return {
      action: 'error',
      output: `cd: ${argv[1]}: No such directory. Run 'ls' to list sections.`,
    };
  }
  return { action: 'navigate', target: sectionId };
};

const handleWhoami: CommandHandler = (): CommandResult => ({
  action: 'output',
  output: [
    `┌─ IDENTITY RECORD ─────────────────────────────────┐`,
    `│  Handle   : ${OWNER_HANDLE}`,
    `│  Name     : ${OWNER_NAME}`,
    `│  Role     : ${OWNER_TITLE}`,
    `│  Location : ${OWNER_LOCATION}`,
    `│  Shell    : /bin/portfolio-os v0.1.0`,
    `│  Clearance: PUBLIC`,
    `└───────────────────────────────────────────────────┘`,
  ].join('\n'),
});

const handleHelp: CommandHandler = (): CommandResult => ({
  action: 'output',
  output: [
    'PORTFOLIO_OS — Available Commands',
    '─────────────────────────────────',
    '  ls / dir              List all sections',
    '  cd [section]          Navigate to a section',
    '  goto [section]        Alias for cd',
    '  whoami                Display identity record',
    '  cat resume.pdf        Open resume',
    '  clear                 Clear terminal history',
    '  help / ?              Show this message',
    '  sudo [anything]       ...',
    '',
    `Sections: ${SECTION_LISTING}`,
  ].join('\n'),
});

const handleClear: CommandHandler = (): CommandResult => ({
  action: 'clear',
});

const handleCat: CommandHandler = (argv): CommandResult => {
  const file = argv[1];
  if (file === 'resume.pdf') {
    return {
      action: 'output',
      output: `Opening ${RESUME_PATH} in a new tab...\n[system]: window.open dispatched`,
    };
  }
  if (!file) {
    return { action: 'error', output: 'cat: missing file operand' };
  }
  return {
    action: 'error',
    output: `cat: ${file}: No such file. Try 'cat resume.pdf'.`,
  };
};

const handleSudo: CommandHandler = (argv): CommandResult => {
  const subcmd = argv.slice(1).join(' ') || '[empty]';
  return {
    action: 'glitch',
    output: [
      `sudo: command '${subcmd}' intercepted by KERNEL watchdog.`,
      `[CRIT] Privilege escalation attempt logged.`,
      `[CRIT] Triggering countermeasures...`,
    ].join('\n'),
  };
};

const handleUnknown = (raw: string): CommandResult => ({
  action: 'error',
  output: `portfolio-os: command not found: ${raw}\nType 'help' for available commands.`,
});

// ─────────────────────────────────────────────────────────────
// COMMAND MAP
// ─────────────────────────────────────────────────────────────

const COMMAND_MAP: Record<string, CommandHandler> = {
  ls: handleLs,
  dir: handleLs,
  cd: handleCd,
  goto: handleCd,
  whoami: handleWhoami,
  help: handleHelp,
  '?': handleHelp,
  clear: handleClear,
  cat: handleCat,
  sudo: handleSudo,
};

// ─────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────

/**
 * Parses and dispatches a raw CLI input string to the matching handler.
 * Tokenises by whitespace; the first token is the command name.
 *
 * @param raw - The raw input string from the CLI, before sanitisation.
 *              (sanitisation of the *result* is handled by pushCliHistory)
 * @returns A `CommandResult` describing the action to perform.
 *
 * @example
 * runCommand('cd projects')   // => { action: 'navigate', target: 'projects' }
 * runCommand('sudo rm -rf /') // => { action: 'glitch', output: '...' }
 * runCommand('unknowncmd')    // => { action: 'error', output: '...' }
 */
export function runCommand(raw: string): CommandResult {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { action: 'output', output: '' };
  }

  const argv = trimmed.split(/\s+/);
  const cmd = argv[0].toLowerCase();
  const handler = COMMAND_MAP[cmd];

  return handler ? handler(argv) : handleUnknown(argv[0]);
}
