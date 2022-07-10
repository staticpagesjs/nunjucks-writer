# Static Pages / Nunjucks Writer

Renders page data via Nunjucks templates.

Uses the [Nunjucks](https://www.npmjs.com/package/nunjucks) package under the hood. Everything provided by Nunjucks is also exported from this package (for advanced configuration).

This package is part of the StaticPagesJs project, see:
- Documentation: [staticpagesjs.github.io](https://staticpagesjs.github.io/)
- Core: [@static-pages/core](https://www.npmjs.com/package/@static-pages/core)

## Options

| Option | Type | Default value | Description |
|--------|------|---------------|-------------|
| `view` | `string \| (d: Data) => string` | `main.html` | Template to render. If it's a function it gets evaluated on each render call. |
| `viewsDir` | `string \| string[]` | `views` | One or more directory path where the templates are found. |
| `outDir` | `string` | `build` | Directory where the rendered output is saved. |
| `outFile` | `string \| (d: Data) => string` | *see outFile defaults section* | Path of the rendered output relative to `outDir`. |
| `onOverwrite` | `(d: string) => void` | `console.warn(...)` | Callback function that gets executed when a file name collision occurs. |
| `onInvalidPath` | `(d: string) => void` | `console.warn(...)` | Callback function that gets executed when a file name contains invalid characters. |
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

- if `data.url` is defined, append `.html` and use that.
- if `data.header.path` is defined, replace extension to `.html` and use that.
- if nothing matches call the `onInvalidPath` handler with `undefined` file name.
