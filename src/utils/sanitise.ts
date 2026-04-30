/**
 * PORTFOLIO_OS — CLI Output Sanitiser
 *
 * Character-by-character XSS stripper for all CLI input and output.
 * Every string stored in cliHistory must pass through `sanitiseCLIOutput`
 * before storage. This is enforced by the Zustand `pushCliHistory` action.
 *
 * Strategy:
 *  - Allow only printable ASCII (0x20–0x7E) plus tab (\t) and newline (\n).
 *  - Strip HTML special chars that could form tags or event handlers.
 *  - Collapse runs of stripped characters to a single replacement marker
 *    so the output length remains predictable.
 *
 * @example
 * sanitiseCLIOutput('<script>alert(1)</script>')
 * // => '[script]alert(1)[/script]'
 *
 * sanitiseCLIOutput('Hello, World!')
 * // => 'Hello, World!'
 */

/** Characters that are stripped outright (HTML tag delimiters, quotes). */
const BLOCKED_CHARS = new Set(['<', '>', '"', "'", '`', '\0']);

/**
 * Sanitises a string for safe storage and rendering as plain text in the CLI.
 * Does NOT produce HTML — it produces clean plain text only.
 *
 * @param raw - Unsanitised string from user input or command output.
 * @returns Sanitised plain-text string safe to store in cliHistory.
 *
 * @example
 * sanitiseCLIOutput('ls -la')              // => 'ls -la'
 * sanitiseCLIOutput('<img onerror=x>')     // => '[img onerror=x]'
 * sanitiseCLIOutput('normal\x00text')      // => 'normaltext'
 */
export function sanitiseCLIOutput(raw: string): string {
  if (raw.length === 0) return raw;

  let result = '';
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];
    const code = raw.charCodeAt(i);

    if (BLOCKED_CHARS.has(ch)) {
      // Replace `<` with `[` and `>` with `]` to preserve visual intent
      // of commands like `goto <section>` while neutralising HTML.
      if (ch === '<') {
        result += '[';
      } else if (ch === '>') {
        result += ']';
      }
      // All other blocked chars (quotes, backtick, null byte) are dropped silently.
    } else if (ch === '\n' || ch === '\t' || (code >= 0x20 && code <= 0x7e)) {
      // Printable ASCII, tab, and newline are allowed through verbatim.
      result += ch;
    }
    // Non-printable, non-ASCII bytes are dropped silently.

    i++;
  }

  return result;
}

/**
 * Validates that a string contains only printable ASCII, returning true
 * if no sanitisation was needed. Useful for fast-path checks in tests.
 *
 * @param input - String to inspect.
 * @returns `true` if the string is already clean.
 *
 * @example
 * isCleanOutput('ls -la')   // => true
 * isCleanOutput('<script>') // => false
 */
export function isCleanOutput(input: string): boolean {
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const code = input.charCodeAt(i);
    if (BLOCKED_CHARS.has(ch) || (code < 0x20 && ch !== '\n' && ch !== '\t') || code > 0x7e) {
      return false;
    }
  }
  return true;
}
