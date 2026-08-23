import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

extend([a11yPlugin]);

const THEMES_DIR = join(import.meta.dir, "..", "themes");

export interface ThemeColors {
  [key: string]: string;
}

export interface VSCodeTheme {
  name: string;
  type?: string;
  colors: ThemeColors;
}

export interface ContrastPair {
  /** Human-readable name shown in test output/report */
  label: string;
  /** Key in theme.colors used as the background */
  bgKey: string;
  /** Key in theme.colors used as the foreground */
  fgKey: string;
  /** WCAG minimum ratio required for this pair */
  minRatio: number;
}

/**
 * WCAG 2.x minimum contrast ratios:
 *  - 4.5:1 -> normal text, AA
 *  - 3:1   -> large text (18pt+/14pt bold+) or UI components, AA
 *  - 7:1   -> normal text, AAA
 *
 * Add more pairs here as you want to cover more of the UI
 * (sidebar, status bar, activity bar, tabs, etc.).
 */
export const DEFAULT_PAIRS: ContrastPair[] = [
  {
    label: "Editor background/foreground",
    bgKey: "editor.background",
    fgKey: "editor.foreground",
    minRatio: 4.5,
  },
  {
    label: "Sidebar background/foreground",
    bgKey: "sideBar.background",
    fgKey: "sideBar.foreground",
    minRatio: 4.5,
  },
  {
    label: "Status bar background/foreground",
    bgKey: "statusBar.background",
    fgKey: "statusBar.foreground",
    minRatio: 4.5,
  },
  {
    label: "Activity bar background/foreground",
    bgKey: "activityBar.background",
    fgKey: "activityBar.foreground",
    minRatio: 4.5,
  },
  {
    label: "Tab active background/foreground",
    bgKey: "tab.activeBackground",
    fgKey: "tab.activeForeground",
    minRatio: 4.5,
  },
];

/** Returns the WCAG contrast ratio between two hex colors (1:1 to 21:1). */
export function getContrastRatio(fgHex: string, bgHex: string): number {
  return colord(fgHex).contrast(bgHex);
}

export interface ContrastResult extends ContrastPair {
  bg: string;
  fg: string;
  ratio: number;
  pass: boolean;
}

/** Checks a single color pair from a theme against its required minimum ratio. */
export function checkPair(theme: VSCodeTheme, pair: ContrastPair): ContrastResult {
  const bg = theme.colors[pair.bgKey];
  const fg = theme.colors[pair.fgKey];

  if (!bg || !fg) {
    throw new Error(
      `Theme "${theme.name}" is missing "${pair.bgKey}" or "${pair.fgKey}"`
    );
  }

  const ratio = getContrastRatio(fg, bg);
  return { ...pair, bg, fg, ratio, pass: ratio >= pair.minRatio };
}

/** Loads every theme JSON file from the themes/ directory. */
export function loadThemes(): { file: string; theme: VSCodeTheme }[] {
  return readdirSync(THEMES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((file) => ({
      file,
      theme: JSON.parse(readFileSync(join(THEMES_DIR, file), "utf-8")),
    }));
}
