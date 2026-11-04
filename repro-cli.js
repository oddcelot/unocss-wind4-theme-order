// Runs the CLI 20 times on the same, unchanged sources and counts distinct outputs.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const runs = 20;
const outputs = new Map();
for (let i = 0; i < runs; i++) {
    execFileSync("npx", ["unocss", "src/**/*.ts", "--out-file", "out.css"], { stdio: "ignore" });
    const css = readFileSync("out.css", "utf8");
    const hash = createHash("md5").update(css).digest("hex").slice(0, 8);
    outputs.set(hash, css.match(/^:root, :host \{.*$/m)?.[0].slice(0, 110));
}
console.log(`\nCLI: ${outputs.size} distinct outputs in ${runs} runs (expected: 1)`);
for (const [hash, theme] of outputs) console.log(`  ${hash}  ${theme}…`);
