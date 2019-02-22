# Detects misspellings of common features (no-typos)

Several known features such as methods and properties of web
components can easily be misspelled.

## Rule Details

This rule detects common misspellings.

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

If you wish to name your methods/properties very similarly to those
with special meaning in the web component spec, you should not use
this rule.
