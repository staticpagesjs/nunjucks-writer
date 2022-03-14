# Static Pages / Nunjucks Writer

Renders page data via Nunjucks templates.

Uses the [Nunjucks](https://www.npmjs.com/package/nunjucks) package under the hood. Everything provided by Nunjucks is also exported from this package (for advanced configuration).

This package is part of the StaticPagesJs project, see:
- Documentation: [staticpagesjs.github.io](https://staticpagesjs.github.io/)
- Core: [@static-pages/core](https://www.npmjs.com/package/@static-pages/core)
- CLI tool: [@static-pages/cli](https://www.npmjs.com/package/@static-pages/cli)

## Options

| Option | Type | Default value | Description |
|--------|------|---------------|-------------|
| `view` | `string \| (d: Data) => string` | `main.html` | Template to render. If it's a function it gets evaluated on each render call. |
| `viewsDir` | `string \| string[]` | `views` | One or more directory path where the templates are found. |
| `outDir` | `string` | `build` | Directory where the rendered output is saved. |
| `outFile` | `string \| (d: Data) => string` | *see outFile defaults section* | Path of the rendered output relative to `outDir`. |
| `globals` | `object` | `{}` | Additional properties loaded to the nunjucks environment as globals. |
| `functions` | `Record<string, Function>` | `{}` | Functions in an object that gets loaded to the nunjucks environment. |
| `filters` | `Record<string, Function>` | `{}` | Filters in an object that gets loaded to the nunjucks environment. |
| `advanced` | `(env: TwingEnvironment) => void` | `() => undefined` | Allows advanced configuration via access to the `env` nunjucks environment. |
| `showdownEnabled` | `boolean` | `true` | Register a markdown filter; uses [showdown](http://showdownjs.com/). |
| `showdownOptions` | `showdown.ConverterOptions` | `{ simpleLineBreaks: true, ghCompatibleHeaderId: true, customizedHeaderId: true, tables: true }` | Custom options for the showdown markdown renderer. |

Example for `filters` and `functions`:
```ts
import { runtime as nunjucksRuntime } from '@static-pages/nunjucks-writer';
export const myFiltersOrFunctions = {
	asset(asset: string) {
		return new URL(asset, '/site/assets/').toString();
	},
	json_formatted: d => new nunjucksRuntime.SafeString(JSON.stringify(d, null, 4)),
};
```

### `outFile` defaults
The default behaviour is to guess file path by a few possible properties of the data:

- if `data.output.path` is defined, use that.
- if `data.output.url` is defined, append `.html` and use that.
- if `data.header.path` is defined, replace extension to `.html` and use that.
- if nothing matches, name it `unnamed-{n}.html` where `{n}` is a counter.

## CLI
This module exports a `cli` function which used by the [CLI tool](https://www.npmjs.com/package/@static-pages/cli) to initialize configuration coming from config file or from command-line arguments.
Everything defined in the `Options` section is valid with the following additions:

| Option | Description |
|--------|-------------|
| `view` | If view looks like a function its evaluated it in a sandbox to a JS function. |
| `outFile` | If outFile looks like a function its evaluated it in a sandbox to a JS function. |
| `globals` | Is a path to a module OR an object with `module` and `export` keys. `export` is the name of the exported member of `module`, defaults to `'globals'`. |
| `functions` | Is a path to a module OR an object with `module` and `export` keys. `export` is the name of the exported member of `module`, defaults to `'functions'`. |
| `filters` | Is a path to a module OR an object with `module` and `export` keys. `export` is the name of the exported member of `module`, defaults to `'filters'`. |
| `advanced` | Is a path to a module OR an object with `module` and `export` keys. `export` defaults to is the name of the exported member of `module`, `'advanced'`. |

### CLI example
```sh
$ staticpages \
  --from ... \
  --to.module @static-pages/nunjucks-writer \
  --to.args.view content.html \
  --to.args.outFile "d => d.url" \
  --to.args.filters.module path/to/my.filters.js \
  --to.args.filters.export nunjucksFilters \
  --controller ...
```
