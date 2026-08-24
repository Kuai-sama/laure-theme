import { checkPair, loadThemes, DEFAULT_PAIRS } from "./contrast";

const themes = loadThemes();

for (const { file, theme } of themes) {
  console.log(`\n${theme.name} (${file})`);

  for (const pair of DEFAULT_PAIRS) {
    const r = checkPair(theme, pair);
    const status = r.pass ? "\u2705" : "\u274c";
    console.log(
      `  ${status} ${pair.label}: ${r.fg} on ${r.bg} \u2192 ${r.ratio.toFixed(2)}:1 (min ${pair.minRatio}:1)`
    );
  }
}
