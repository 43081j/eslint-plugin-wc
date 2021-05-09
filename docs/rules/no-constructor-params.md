# Disallows constructor parameters in custom elements (no-constructor-params)

Ensures that custom element constructors have no parameters as they
are never constructed directly but are rather constructed automatically when
appended to the DOM (or via `createElement` etc).

## Rule Details

This rule disallows constructor parameters in custom element classes.

The following patterns are considered warnings:

```ts
class Foo extends HTMLElement {
  constructor(p1, p2) {}
}
```

The following patterns are not warnings:

```ts
class Foo extends HTMLElement {
  constructor() {}
}
```

## When Not To Use It

If you wish to allow parameters to custom element constructors, you should not
use this rule.
