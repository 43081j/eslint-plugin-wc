# Requires that elements are defined after their class definition (define-tag-after-class-definition)

To be able to use a Custom Element, it must be defined in the `customElements` registry. This is possible by calling `customElements.define` with the class and desired tag name:

```js
class FooBarElement extends HTMLElement {
  // ...
}

customElements.define('foo-bar', FooBarElement)
```

## Rule Details

This rule enforces that the `customElements.define` call _appear_ after a Custom Element Class has been defined.

It enforces the call come _after_ to avoid issues around [Temporal Dead Zones](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz) with class definitions.

It does not allow for Custom Element classes to be passes as an argument to `define` because that will turn the class into a `ClassExpression`, which means it won't be able to be exported or assigned to a global.

The following patterns are considered warnings:

```js
class FooBarElement extends HTMLElement {
  // ...
}

// No call to `customElements.define`
```

```js
// This prevents `FooBarElement` from being in the lexical scope
customElements.define(
  'foo-bar',
  class FooBarElement extends HTMLElement {
    // ...
  }
)
```

The following patterns are not warnings:

```js
class FooBarElement extends HTMLElement {
  // ...
}

customElements.define('foo-bar', FooBarElement)
```

## When Not To Use It

If you have another mechanism for registering Custom Elements, then this rule should be disabled.

If you're exporting an element as a library, you _may_ want to disable this rule, as it expects the definition to be in the same file as the class declaration, which may not be the case for a library.
