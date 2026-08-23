import { describe, test, expect } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { checkPair, DEFAULT_PAIRS, type VSCodeTheme } from "./contrast";

const THEMES_DIR = join(import.meta.dir, "..", "themes");

function loadThemes(): { file: string; theme: VSCodeTheme }[] {
  return readdirSync(THEMES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((file) => ({
      file,
      theme: JSON.parse(readFileSync(join(THEMES_DIR, file), "utf-8")),
    }));
}

const themes = loadThemes();

for (const { file, theme } of themes) {
  describe(`${theme.name} (${file})`, () => {
    for (const pair of DEFAULT_PAIRS) {
      test(`${pair.label} >= ${pair.minRatio}:1`, () => {
        const result = checkPair(theme, pair);

        if (!result.pass) {
          console.error(
            `\u2717 ${theme.name}: ${pair.fgKey} (${result.fg}) on ${pair.bgKey} (${result.bg}) ` +
              `= ${result.ratio.toFixed(2)}:1 (needs ${pair.minRatio}:1)`
          );
        }

        expect(result.ratio).toBeGreaterThanOrEqual(pair.minRatio);
      });
    }
  });
}
