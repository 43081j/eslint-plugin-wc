# Disallows traversal of children in the `connectedCallback` method (no-child-traversal-in-connectedcallback)

The intent of the `connectedCallback` is to set up event listeners and instantiate state. Traversing the DOM during the `connectedCallback` phase is error-prone, because the callback might fire before an elements children have been appended. Additionally, as `connectedCallback` only fires once, any DOM mutations that happen once the element is connected will not be resolved, so any state that traversed the DOM will fall out of synchronisation.

It is instead preferable to move such DOM traversals into event listeners, or a `MutationObserver` to track changes in children.

## Rule Details

This rule disallows using DOM traversal APIs within the `connectedCallback`.

👎 Examples of **incorrect** code for this rule:

```js
class FooBarElement extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector('button')
    if (button) {
      button.disabled = true
    }
  }
}
```

👍 Examples of **correct** code for this rule:

```js
class FooBarElement extends HTMLElement {
  connectedCallback() {
    new MutationObserver(() => {
      const button = this.querySelector('button')
      if (button) {
        button.disabled = true
      }
    }).observe(this, {childList: true})
  }
}
```

```js
class FooBarElement extends HTMLElement {
  connectedCallback() {
    this.addEventListener('update', () => {
      const button = this.querySelector('button')
      if (button) {
        button.disabled = true
      }
    })
  }
}
```

## When Not To Use It

If you are comfortable with the edge cases of DOM traversal directly in the `connectedCallback` then you can disable this rule.

It may also be necessary to disable the rule when the custom element is appended to the DOM via JavaScript like for instance the Vue framework, which appends the element including all children at once and a `MutationObserver` would not receive any `childList` mutations in such cases.