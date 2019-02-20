# Disallows attaching a shadow root outside the constructor (attach-shadow-constructor)

Shadow roots should always be attached inside the constructor as doing so in another method means you must have further checks to ensure nothing already altered the current element or DOM tree.

More information on attaching shadow root in the constructor can be found
[here](https://developers.google.com/web/fundamentals/web-components/best-practices#create-your-shadow-root-in-the-constructor).

## Rule Details

This rule disallows use of `attachShadow` outside the `constructor`.

The following patterns are considered warnings:

```ts
class MyElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
  }
}
```

The following patterns are not warnings:

```ts
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }
}
class MyElement extends HTMLElement {
  intitialize(node) {
    node.attachShadow({mode: 'open'});
  }
}
```

## When Not To Use It

If you wish to use unconventional methods for attaching a shadow root, you should not use this rule.
