# Enforce that files which export a custom element are named similarly to the custom element that they export (file-name-matches-element)

For code organisation, it is useful if a file name matches the contents of a class inside it. In this instance, having the file name match the name of the element.

## Rule Details

This rule enforces the name of the file an Element exists in matches the name of the Element itself.

👎 Examples of **incorrect** code for this rule:

```js
// element.ts
class FooBarElement extends HTMLElement {}
```

👍 Examples of **correct** code for this rule:

```js
// foo-bar-element.ts
class FooBarElement extends HTMLElement {}
```

### Options

- `transform` can define how a class name would be transformed into a file name. You can specify multiple transforms to allow multiple options. The default is `['kebab', 'camel']`. The options are:

  - `none`: Files must be named exactly as the class name: `FooBarElement` -> `FooBarElement.js`
  - `snake`: Files must be named lowercase, separated by underscores: `FooBarElement` -> `foo_bar_element.js`
  - `kebab`: Files must be named lowercase, separated by dashes: `FooBarElement` -> `foo-bar-element.js`
  - `pascal`: Files must match case, but the first character must be upper: `FooBarElement` -> `FooBarElement.js`
  - `camel`: Files must match case, but the first character must be lower: `FooBarElement` -> `fooBarElement.js`

- `suffix` can allow omission of a suffix from a file name. Case insensitive.
- `prefix` can allow omission of a prefix from a file name. Case insensitive.
- `matchDirectory` the directory structure of the file is also counted as a valid prefix.

👍 Examples of **correct** file names to class names:

- `["error", {"transform": "snake", "suffix": ["Element"]}]`

  - `FooBarElement` -> `foo_bar.js`
  - `FooBarElement` -> `foo_bar_element.js`

- `["error", {"transform": ["snake", "kebab"], "suffix": ["Element"]}]`

  - `FooBarElement` -> `foo-bar.js`
  - `FooBarElement` -> `foo-bar.js`
  - `FooBarElement` -> `foo_bar_element.js`
  - `FooBarElement` -> `foo-bar-element.js`

- `["error", {"transform": ["snake", "kebab"], "suffix": ["Element", "Component"]}]`

  - `FooBarElement` -> `foo-bar.js`
  - `FooBarElement` -> `foo-bar.js`
  - `FooBarElement` -> `foo_bar_element.js`
  - `FooBarElement` -> `foo-bar-element.js`
  - `FooBarComponent` -> `foo-bar.js`
  - `FooBarComponent` -> `foo-bar.js`
  - `FooBarComponent` -> `foo_bar_component.js`
  - `FooBarComponent` -> `foo-bar-component.js`

- `["error", {"transform": ["kebab"], "prefix": ["foo"]}]`

  - `FooBarElement` -> `foo-bar-element.js`
  - `FooBarElement` -> `bar-element.js`

- `["error", {"transform": ["kebab"], "matchDirectory": true}]`
  - `FooBarElement` -> `foo-bar-element.js`
  - `FooBarElement` -> `foo/bar-element.js`
  - `FooBarElement` -> `foo/bar/element.js`
  - `FooBarElement` -> `foobar/element.js`

## When Not To Use It

If you intentionally want to name your custom elements differently to the file names, then you may disable this rule.
