# UnoCSS: theme block order isn't deterministic (CLI + preset-wind4)

`npm start` runs the CLI check, then opens a page that shows both problems.
Each chip is one variable in the `:root, :host { … }` theme block, coloured by
name. Every row should have the same pattern.

1. **Generator.** `createGenerator({ presets: [presetWind4()] })` runs in the
   browser with the same tokens in shuffled orders. The theme block follows
   the token order, because preset-wind4 emits `Array.from(trackedTheme)`.
2. **CLI.** Before the page starts, `unocss "src/**/*.ts" --out-file out.css`
   runs 20 times on 60 unchanged files in nested folders. The CLI keeps
   tinyglobby's file order, which varies between runs for nested folders, so
   the token order and the theme block change too. Locally (macOS, Node 24)
   almost every run differs. In a browser sandbox like StackBlitz the file
   crawl may be stable, so this part can show one order there; part 1 shows
   the cause either way.

Without the page: `npm run repro:order` and `npm run repro:cli`.

Versions: unocss / @unocss/cli / @unocss/preset-wind4 66.12.0.
