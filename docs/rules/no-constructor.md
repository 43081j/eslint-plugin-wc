# Disallows constructors in custom element classes (no-constructor)

Classes can use the `constructor` method to execute behaviours upon creation of
their object. This is useful for things like initialisation of private state.
Custom Elements also have other lifecycle callbacks which can be used for this,
such as `connectedCallback`.

For Custom Elements, the `constructor` method can be a little unwieldy to use;
it is called as soon as the class is instantiated with `document.createElement`
which will be _before_ the element has been appended to the DOM. It can be
simpler to put code within the `connectedCallback` which is fired when the
element has been appended into the DOM.

Many expectations from an element are not true during the `constructor` call.
For example you cannot:

- read any attributes on the element (`.attributes` will always be an
empty `NamedNodeMap`).
- access any child elements (`.children` will always be an empty
`HTMLCollection`).
- Fire events that bubble. As the node is not connected it cannot bubble.

Also, there are many edge cases that can cause complications inside the
constructor, for example:

- Creating child elements and appending them will cause _their_ connected
callbacks to fire, but their parent (the current element) will be disconnected
from the DOM.
- Changing attributes will cause `attributeChangedCallback` to fire, which may
expect to be connected.

## Rule Details

This rule disallows using the `constructor` in an HTMLElement class.

👎 Examples of **incorrect** code for this rule:

```js
class FooBar extends HTMLElement {
  constructor() {
    super()
    this.initialState = {}
  }
}
```

👍 Examples of **correct** code for this rule:

```js
class FooBar extends HTMLElement {
  connectedCallback() {
    this.initialState = {}
  }
}
```

## When Not To Use It

If you are comfortable with the trade-offs of using the `constructor` function.
