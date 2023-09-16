# Disallows exports alongside custom element exports (no-exports-with-element)

It's possible to export multiple functions and classes in a JavaScript file.
In the case of Custom Elements, exporting more than the Custom Element itself
can cause confusion when importing code. It may also be a sign that there is
too much code in a single file. If you have utility functions that the Custom
Element depends on, it might be worth splitting this out into a separate file.

## Rule Details

This rule disallows exports (other than the element class and event subclasses)
in a file with a Custom Element.

👎 Examples of **incorrect** code for this rule:

```js
// foo-bar-element.js
export class FooBarElement extends HTMLElement {
  // ...
}

export function myHelper() {
  // ...
}
```

👍 Examples of **correct** code for this rule:

```js
// foo-bar-element.js
import {myHelper} from './helpers.js'
export class FooBarElement extends HTMLElement {
  // ...
}
```

```js
// foo-bar-element.js
import {myHelper} from './helpers.js'
export class FooReadyEvent extends Event {
  // ...
}

export class FooBarElement extends HTMLElement {
  // ...
}
```

```js
// helpers.js
export function myHelper() {
  // ...
}
```

## When Not To Use It

If you intentionally want multiple exports in a single file then you can disable this rule.
