# Disallows traversal of children in the `AttributeChangedCallback` method (no-child-traversal-in-attributechangedcallback)

The intent of the `attributeChangedCallback` is to initialise state based on attribute values, and to observe and alter state when those values change. Traversing the DOM during the `attributeChangedCallback` phase is error-prone, because:

- it can fire before `connectedCallback`, meaning any initialisation inside of `connectedCallback` has not yet occurred.
- it can fire before `this.isConnected` is `true`, meaning the node has been created but is not yet appended to the DOM. For example `this.ownerDocument` or `this.parent` will be null, and `this.querySelector()` will return `null` for any value.

To give a concrete example of this, there is a common pattern when constructing DOM in JS to create the element, set its attributes and append to the DOM, in that order. In code this might look like:

```js
const el = document.createElement('foo-bar')
el.setAttribute('baz', 'bing')
// attributeChangedCallback('baz', null, 'bing') is fired!
document.body.append(el)
// connectedCallback() is fired!
```

This is also true for document parsing in general: attributes that are in the HTML during parse time will call `attributeChangedCallback` before `connectedCallback`. This could be represented in code like:

```js
document.body.innerHTML = '<foo-bar baz="bing"></foo-bar>'
// attributeChangedCallback('baz', null, 'bing') is fired!
// connectedCallback() is fired!
```

Guarding against `null` properties, or returning early for `isConnected === false` is not good enough because there is high risk that attribute changes won't be properly propagated and state can fall out of sync. Guarding against these means adding duplicate code in other lifecycle callbacks such as `connectedCallback` to ensure this state does not fall out of sync. It is instead preferable to move such DOM traversals away from `attributeChangedCallback`, using one of the following:

- dispatch events from `attributeChangedCallback`, binding event listeners on the element itself within `connectedCallback`
- defer DOM traversals to just-in-time lookup using methods or getters.

All of these patterns still mean state initialisation should be done in the `connectedCallback`. Do not rely on `attributeChangedCallback` for state initialisation.

## Rule Details

This rule disallows using DOM traversal APIs within the `attributeChangedCallback`.

👎 Examples of **incorrect** code for this rule:

```js
class FooBarElement extends HTMLElement {
  attributeChangedCallback(name, _, value) {
    if (name === 'aria-owns') {
      // This  has not been guarded against `this.isConnected` and so
      // `ownerDocument` is null.
      this.mine = this.ownerDocument.getElementById(value)
    }
  }
}
```

```js
class FooBarElement extends HTMLElement {
  attributeChangedCallback(name, _, value) {
    if (name === 'data-text') {
      // This  has not been guarded against `this.isConnected` and so
      // `ownerDocument` is null.
      this.querySelector('span').textContent = value
    }
  }
}
```

👍 Examples of **correct** code for this rule:

```js
class FooBarElement extends HTMLElement {
  get mine() {
    return this.ownerDocument.getElementById(this.getAttribute('aria-owns'))
  }
}
```

```js
class FooBarElement extends HTMLElement {
  attributeChangedCallback(name, _, value) {
    if (this.isConnected && name === 'data-text') {
      // Guarding with `isConnected` can be used here, but we also
      // need to synchronise this state in the `connectedCallback` as well.
      this.update()
    }
  }
  update() {
    this.querySelector('span').textContent = this.getAttribute('data-text')
  }
  connectedCallback() {
    // This needs to happen because `attributeChangedCallback` doesn't
    // _always_ update.
    this.update()
  }
}
```

## When Not To Use It

If you are comfortable with the edge cases of DOM traversal directly in the `attributeChangedCallback` then you can disable this rule.
