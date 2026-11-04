// Runs the CLI 20 times on the same, unchanged sources and counts distinct outputs.
// With --json <file>, also writes each run's theme variable order for the page.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const runs = 20;
const results = [];
for (let i = 0; i < runs; i++) {
    execFileSync("npx", ["unocss", "src/**/*.ts", "--out-file", "out.css"], { stdio: "ignore" });
    const css = readFileSync("out.css", "utf8");
    const theme = css.match(/:root, :host \{([^}]*)\}/)?.[1] ?? "";
    results.push({
        hash: createHash("md5").update(css).digest("hex").slice(0, 8),
        vars: [...theme.matchAll(/(--[\w-]+):/g)].map((m) => m[1]),
    });
}
const distinct = new Set(results.map((r) => r.hash)).size;
console.log(`CLI: ${distinct} distinct outputs in ${runs} runs (expected: 1)`);

const json = process.argv.indexOf("--json");
if (json > 0) {
    const file = process.argv[json + 1];
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify({ runs: results, node: process.version, platform: process.platform }));
}
