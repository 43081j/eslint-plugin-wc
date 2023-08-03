# Enforces a maximum number of elements per file (max-elements-per-file)

This rule disallows creating multiple `HTMLElement` classes in a single file.

## Rule Details

👎 Examples of **incorrect** code for this rule:

```js
// elements.ts
class FirstElement extends HTMLElement {}
class SecondElement extends HTMLElement {}
```

👍 Examples of **correct** code for this rule:

```js
// first-element.ts
class FirstElement extends HTMLElement {}
```

```js
// second-element.ts
class SecondElement extends HTMLElement {}
```

Declaring multiple Custom Elements per file can:

- Result in large files which are difficult to navigate.
- Make a project difficult to navigate, as Custom Elements do not have a 1-1
mapping with files.
- Make it more difficult for bundle optimizations such as "Tree Shaking",
"Bundle Splitting" or "Dead Code Elimination"

Having one element per file eliminates these problems.

## When Not To Use It

If you intentionally want multiple elements in a single file then you can
disable this rule.
