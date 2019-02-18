# Detects misspellings of lifecycle methods (lifecycle-spelling)

Lifecycle methods of custom elements can often be easily misspelled.

## Rule Details

This rule detects common misspellings of custom element lifecycle methods.

The following patterns are considered warnings:

```ts
class Foo extends HTMLElement {
  connectCallback() {}
  disconnectCallbackk() {}
  adoptCallback() {}
}
```

The following patterns are not warnings:

```ts
class Foo extends HTMLElement {
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
}
```

## When Not To Use It

If you wish to name your methods very similarly to the custom element
lifecycle methods, you should not use this rule.
