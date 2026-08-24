import { describe, test, expect } from "bun:test";
import { checkPair, loadThemes, DEFAULT_PAIRS } from "./contrast";

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
