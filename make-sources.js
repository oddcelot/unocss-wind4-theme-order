// 60 files in nested folders, each using 3 utilities that read theme values.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

const utilities = [
    "text-sm", "text-lg", "text-xl", "text-2xl", "bg-blue-500", "bg-red-600", "text-gray-700", "p-4",
    "rounded-md", "rounded-lg", "font-bold", "font-semibold", "shadow-md", "max-w-4xl", "bg-green-400",
    "ease-in-out", "duration-150", "w-64",
];

rmSync("src", { recursive: true, force: true });
let n = 0;
for (let d = 0; d < 20; d++) {
    for (let s = 0; s < 3; s++) {
        const dir = `src/d${d}/s${s}`;
        mkdirSync(dir, { recursive: true });
        const picked = [0, 1, 2].map((i) => utilities[(n * 7 + i * 5) % utilities.length]);
        writeFileSync(`${dir}/c.ts`, `export const c = "${picked.join(" ")}";\n`);
        n++;
    }
}
console.log(`wrote ${n} files under src/`);
