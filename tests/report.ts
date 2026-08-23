import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { checkPair, DEFAULT_PAIRS, type VSCodeTheme } from "./contrast";

const THEMES_DIR = join(import.meta.dir, "..", "themes");

const files = readdirSync(THEMES_DIR).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const theme: VSCodeTheme = JSON.parse(
    readFileSync(join(THEMES_DIR, file), "utf-8")
  );
  console.log(`\n${theme.name} (${file})`);

  for (const pair of DEFAULT_PAIRS) {
    const r = checkPair(theme, pair);
    const status = r.pass ? "\u2705" : "\u274c";
    console.log(
      `  ${status} ${pair.label}: ${r.fg} on ${r.bg} \u2192 ${r.ratio.toFixed(2)}:1 (min ${pair.minRatio}:1)`
    );
  }
}
