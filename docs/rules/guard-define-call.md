# Require define calls to include an `if` statement (guard-define-call)

Registering a custom element under the same tag as another defined custom
element will cause a runtime exception in browsers.

Some JavaScript might be inadvertently loaded twice on the same page in a web
application, causing run time errors when the same element is registered twice.

## Rule Details

This rule ensures that all custom element definition calls are wrapped in
guards if that element is already defined.

👎 Examples of **incorrect** code for this rule:

```js
window.customElements.define('foo-bar', class extends HTMLElement {});
```

👍 Examples of **correct** code for this rule:

```js
if (!window.customElements.get('foo-bar')) {
  window.customElements.define('foo-bar', class extends HTMLElement {});
}
```

## When Not To Use It

If you are comfortable with the trade-offs of not checking if a custom element
exists before defining it.
