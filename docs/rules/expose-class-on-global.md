# Requires that custom element classes are exposed on the global object (expose-class-on-global)

It is good practice to have any element which is accessible via a tag-name to also have the class definition assigned to the global object. This is similar to how the built-in elements operate, for example the `div` element class definition is available under the `HTMLDivElement` global.

## Rule Details

This rule enforces that any class extending from `HTMLElement` also be assigned to a global variable matching that name.

The following patterns are considered warnings:

```js
class FooBarElement extends HTMLElement {
  // ...
}

// No assignment to `window.FooBarElement`
```

```js
class FooBarElement extends HTMLElement {
  // ...
}

// Assigned, but using a different name to the class name
window.FooBar = FooBarElement
```

```js
// Assigned but as an Anonymous Class Expression
window.FooBarElement = class extends HTMLElement {
  // ...
}
```

The following patterns are not warnings:


```js
class FooBarElement extends HTMLElement {
  // ...
}

window.FooBarElement = FooBarElement
```

```js
window.FooBarElement = class FooBarElement extends HTMLElement {
  // ...
}
```

## When Not To Use It

If you don't want your elements available as globals, you may disable this rule.
