# UnoCSS: theme block order isn't deterministic (CLI + preset-wind4)

`npm start` runs both checks.

- `npm run repro:order`: generates CSS from the same tokens in two orders with
  `createGenerator` + `presetWind4()`. The `:root, :host { … }` theme block
  differs: preset-wind4 emits theme variables in the order tokens first used
  them (`Array.from(trackedTheme)`).
- `npm run repro:cli`: writes 60 files in nested folders, then runs
  `unocss "src/**/*.ts" --out-file out.css` 20 times on the unchanged sources
  and counts distinct outputs. The CLI uses tinyglobby's result as-is, and for
  nested folders that order changes between runs, so the token order and with
  it the theme block change too. Expected 1 distinct output; locally (macOS,
  Node 24) we get up to 20. In a browser sandbox the file crawl may be stable,
  so this one can come out as 1 there.

Versions: unocss / @unocss/cli / @unocss/preset-wind4 66.12.0.
