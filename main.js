import { createGenerator } from "@unocss/core";
import presetWind4 from "@unocss/preset-wind4";

const TOKENS = ["text-sm", "text-xl", "bg-blue-500", "bg-red-600", "rounded-md", "font-bold", "shadow-md", "ease-in-out", "max-w-4xl", "w-64"];

const colour = (name) => {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
    return `hsl(${h} 70% 55%)`;
};

function draw(target, rows) {
    const distinct = new Set(rows.map((r) => r.vars.join())).size;
    const names = [...new Set(rows.flatMap((r) => r.vars))].sort();
    target.innerHTML = `
        <p class="summary ${distinct > 1 ? "bad" : "good"}">${distinct} distinct order${distinct > 1 ? "s" : ""} in ${rows.length} runs (expected: 1)</p>
        ${rows
            .map(
                (r) => `<div class="row"><span class="label">${r.label}</span>${r.vars
                    .map((v) => `<span class="chip" title="${v}" style="background:${colour(v)}"></span>`)
                    .join("")}</div>`
            )
            .join("")}
        <div class="legend">${names.map((v) => `<span style="--c:${colour(v)}">${v}</span>`).join("")}</div>`;
}

async function themeVars(tokens) {
    const uno = await createGenerator({ presets: [presetWind4()] });
    const { css } = await uno.generate(new Set(tokens), { preflights: true });
    const theme = css.match(/:root, :host \{([^}]*)\}/)?.[1] ?? "";
    return [...theme.matchAll(/(--[\w-]+):/g)].map((m) => m[1]);
}

const shuffled = (list) => list.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

async function generator() {
    const rows = [{ label: "as listed", vars: await themeVars(TOKENS) }];
    for (let i = 1; i <= 7; i++) rows.push({ label: `shuffle ${i}`, vars: await themeVars(shuffled(TOKENS)) });
    draw(document.getElementById("generator"), rows);
}

async function cli() {
    const target = document.getElementById("cli");
    const res = await fetch("/cli-runs.json").catch(() => null);
    if (!res?.ok) {
        target.innerHTML = `<p>No CLI results; run <code>npm start</code>.</p>`;
        return;
    }
    const { runs, node, platform } = await res.json();
    draw(target, runs.map((r, i) => ({ label: `run ${i + 1} ${r.hash}`, vars: r.vars })));
    target.insertAdjacentHTML("beforeend", `<p class="lead">Node ${node} on ${platform}.</p>`);
}

document.getElementById("shuffle").addEventListener("click", generator);
generator();
cli();
