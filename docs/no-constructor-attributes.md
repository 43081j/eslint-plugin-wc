# Disallows interaction with attributes in constructors (no-constructor-attributes)

Constructors of custom elements should never interact with the DOM or
attributes as the element may not yet be upgraded.

More information on why this is a bad thing can be found in the HTML
standard [here](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance).

## Rule Details

This rule disallows interaction with the DOM inside element constructors.

The following patterns are considered warnings:

```ts
constructor() {
  this.setAttribute('foo', 'bar');
}
```

The following patterns are not warnings:

```ts
myMethod() {
  this.setAttribute('foo', 'bar');
}
```

## When Not To Use It

If for some reason you wish to interact with attributes and DOM, you
should not use this rule.
