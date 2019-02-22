# Prevents common typos (no-typos)

Ensure no lifecycle methods or known custom element properties are
misspelt.

## Rule Details

This rule detects common misspellings, particularly of lifecycle methods:

* connectedCallback
* adoptedCallback
* disconnectedCallback
* attributeChangedCallback

It also detects misspellings of the following known properties:

* observedAttributes

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
