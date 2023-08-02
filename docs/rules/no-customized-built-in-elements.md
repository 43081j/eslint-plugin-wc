# Disallows extending of built-in elements (no-customized-built-in-elements)

Custom Elements can extend from
[any available element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element),
for example HTMLParagraphElement.

There are a few reasons for why you would want to only extend from HTMLElement.

- As new features get added to HTML elements, custom elements that extend those
built-in elements need to adopt those new features which can cause
complications especially with regards to cross-browser support.
- [Safari doesn't support and doesn't plan on supporting extending from other elements than HTMLElement](https://github.com/w3c/webcomponents/issues/509#issuecomment-230700060).

## Rule Details

This rule restricts Custom Elements to only extend from HTMLElement.

👎 Examples of **incorrect** code for this rule:

```js
class MyListElement extends HTMLUListElement {
  // ...
}
```

👍 Examples of **correct** code for this rule:

```js
class MyListElement extends HTMLElement {
  // ...
}
```

## When Not To Use It

If you want to extend from built-in elements, don't need to support Safari
(or are happy using a
[polyfill](https://github.com/ungap/custom-elements-builtin)) and are OK with
the trade-offs, then this rule can be disabled.
