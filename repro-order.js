// Same tokens, two orders: the theme block follows token order. This is what
// the CLI does when its glob returns files in a different order.
import { createGenerator } from "@unocss/core";
import presetWind4 from "@unocss/preset-wind4";

const tokens = ["text-sm", "bg-blue-500", "rounded-md", "ease-in-out"];
const theme = async (list) => {
    const uno = await createGenerator({ presets: [presetWind4()] });
    const { css } = await uno.generate(new Set(list), { preflights: true, minify: true });
    return css.match(/:root, :host \{[^}]*\}/)?.[0];
};

const a = await theme(tokens);
const b = await theme([...tokens].reverse());
console.log(`generator, tokens in order:   ${a}`);
console.log(`generator, tokens reversed:   ${b}`);
console.log(a === b ? "same theme block" : "DIFFERENT theme block for the same set of tokens");
