# Disallows constructor parameters in custom elements (no-constructor-params)

Ensures that custom element constructors have no parameters as they
are typically not constructed directly but are instead constructed by DOM APIs
like document.createElement, or by the HTML Parser. When constructed this way,
no arguments are passed to the constructor.

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

You should usually keep this rule enabled as browsers will never pass parameters
to the constructor. You should only disable it if you intend to instantiate
your class directly, and should then make all parameters optional.
