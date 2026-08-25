/** A named accent color offered by `<ws-color-picker>`. */
export interface WsAccentPreset {
  /** Human readable name, used as the swatch's accessible label. */
  name: string;
  /** Any CSS color the browser can parse; hex keeps contrast math exact. */
  value: string;
}

/** Where a `<ws-color-picker>` writes the accent it produces. */
export type WsColorPickerApply = 'root' | 'self' | 'none';

/** The accents shipped with the design system. Purple is the default. */
export const WS_ACCENT_PRESETS: readonly WsAccentPreset[] = Object.freeze([
  {name: 'Purple', value: '#7c5cff'},
  {name: 'Indigo', value: '#4b5bff'},
  {name: 'Blue', value: '#2f80ff'},
  {name: 'Teal', value: '#12b5a5'},
  {name: 'Green', value: '#19c98b'},
  {name: 'Amber', value: '#ffa62b'},
  {name: 'Rose', value: '#ff4d5e'},
  {name: 'Magenta', value: '#d946c8'},
]);

/** The design system's default accent, mirrored from foundation/colors.css. */
export const WS_DEFAULT_ACCENT = WS_ACCENT_PRESETS[0].value;

const LIGHT_FOREGROUND = '#f7f7fa';
const DARK_FOREGROUND = '#17171c';

const HEX_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Normalizes a hex color to lowercase `#rrggbb`, or returns `null` when the
 * value is not a hex color this module can reason about.
 */
export function normalizeHex(color: string): string | null {
  const trimmed = color.trim();
  if (!HEX_PATTERN.test(trimmed)) return null;

  const digits = trimmed.slice(1).toLowerCase();
  if (digits.length === 6) return `#${digits}`;

  return `#${digits
    .split('')
    .map((digit) => digit + digit)
    .join('')}`;
}

const channelLuminance = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance of a hex color, from 0 (black) to 1 (white). */
export function relativeLuminance(color: string): number {
  const hex = normalizeHex(color);
  if (!hex) return 0;

  const [red, green, blue] = [1, 3, 5].map((offset) =>
    channelLuminance(Number.parseInt(hex.slice(offset, offset + 2), 16))
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** WCAG contrast ratio between two hex colors, from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Minimum contrast for the light foreground to be preferred.
 *
 * WCAG 2.1 asks 3:1 for UI components and large text (1.4.11 / 1.4.3). Light
 * type on a saturated accent usually lands between 3:1 and 4.5:1 — the shipped
 * purple is 4.14:1 — and picking the strictly higher-contrast foreground there
 * would flip brand-colored buttons to dark type. Preferring light while it
 * clears 3:1 keeps the intended look; anything lighter than that (amber, teal,
 * green) drops to dark type, where contrast is far better anyway. Accents used
 * behind small body copy should still be checked by hand.
 */
const LIGHT_FOREGROUND_MIN_CONTRAST = 3;

/**
 * Picks the foreground that reads best on `accent`.
 *
 * CSS has no portable way to choose a contrasting color yet, so the picker
 * computes `--ws-accent-on` here and sets it alongside `--ws-accent`. Colors
 * that are not plain hex fall back to the light foreground, which matches the
 * default the foundation stylesheet ships.
 */
export function accentForeground(accent: string): string {
  if (!normalizeHex(accent)) return LIGHT_FOREGROUND;

  const light = contrastRatio(LIGHT_FOREGROUND, accent);
  if (light >= LIGHT_FOREGROUND_MIN_CONTRAST) return LIGHT_FOREGROUND;

  return contrastRatio(DARK_FOREGROUND, accent) > light
    ? DARK_FOREGROUND
    : LIGHT_FOREGROUND;
}
