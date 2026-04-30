/**
 * PORTFOLIO_OS — Hex Dump Utility
 *
 * Converts a string into a classic hex dump display, 16 bytes per row.
 * Non-printable bytes are replaced with '.' in the ASCII column —
 * identical to `xxd` and `hexdump -C` output conventions.
 *
 * @example
 * hexDump('Hello!')
 * // => [
 * //   { offset: '00000000', hex: '48 65 6c 6c 6f 21', ascii: 'Hello!' }
 * // ]
 */

export interface HexDumpRow {
  /** Byte offset of the first byte in the row, zero-padded to 8 hex digits. */
  offset: string;
  /** Space-separated hex pairs, e.g. "48 65 6c 6c 6f 21". */
  hex: string;
  /** ASCII column — printable chars verbatim, non-printable replaced with '.'. */
  ascii: string;
}

/** Number of bytes displayed per row. */
const BYTES_PER_ROW = 16;

/**
 * Returns true if the byte value maps to a printable ASCII character (0x20–0x7E).
 *
 * @param byte - Integer byte value 0–255.
 * @returns `true` when the byte is printable ASCII.
 *
 * @example
 * isPrintable(0x41) // => true  ('A')
 * isPrintable(0x01) // => false (SOH control char)
 */
function isPrintable(byte: number): boolean {
  return byte >= 0x20 && byte <= 0x7e;
}

/**
 * Converts a string into an array of hex dump rows, 16 bytes per row.
 * Encodes the input as UTF-8 so multi-byte characters are handled correctly.
 *
 * @param input - The string to dump.
 * @returns Array of `HexDumpRow` objects, one per 16-byte block.
 *
 * @example
 * const rows = hexDump('AB');
 * // rows[0].offset  => '00000000'
 * // rows[0].hex     => '41 42'
 * // rows[0].ascii   => 'AB'
 *
 * hexDump('')
 * // => []
 */
export function hexDump(input: string): HexDumpRow[] {
  if (input.length === 0) return [];

  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  const rows: HexDumpRow[] = [];

  for (let rowStart = 0; rowStart < bytes.length; rowStart += BYTES_PER_ROW) {
    const slice = bytes.slice(rowStart, rowStart + BYTES_PER_ROW);

    const offset = rowStart.toString(16).padStart(8, '0');

    const hexParts: string[] = [];
    const asciiParts: string[] = [];

    for (let i = 0; i < slice.length; i++) {
      const byte = slice[i];
      hexParts.push(byte.toString(16).padStart(2, '0'));
      asciiParts.push(isPrintable(byte) ? String.fromCharCode(byte) : '.');
    }

    rows.push({
      offset,
      hex: hexParts.join(' '),
      ascii: asciiParts.join(''),
    });
  }

  return rows;
}

/**
 * Formats a `HexDumpRow` array into a single multi-line string,
 * matching the `hexdump -C` column layout.
 *
 * @param rows - Output of `hexDump()`.
 * @returns Formatted string, one row per line.
 *
 * @example
 * formatHexDump(hexDump('Hi'))
 * // => '00000000  48 69                                             Hi'
 */
export function formatHexDump(rows: HexDumpRow[]): string {
  return rows
    .map((row) => {
      // Pad hex column to 48 chars (16 bytes × 3 chars minus trailing space)
      const paddedHex = row.hex.padEnd(BYTES_PER_ROW * 3 - 1, ' ');
      return `${row.offset}  ${paddedHex}  ${row.ascii}`;
    })
    .join('\n');
}
