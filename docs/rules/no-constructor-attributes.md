# Disallows interaction with attributes in constructors (no-constructor-attributes)

Constructors of custom elements should never interact with the DOM or
attributes as the element may not yet be upgraded.

> Do note that interaction with the element's shadow DOM is perfectly valid at
> this point as it does not interfere with the DOM tree of the consumer.

More information on why this is a bad thing can be found in the HTML
standard [here](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance).

## Rule Details

This rule disallows interaction with the light DOM inside element constructors.

The following patterns are considered warnings:

```ts
class MyCustomElement extends HTMLElement {
  constructor() {
    this.setAttribute('foo', 'bar');
  }
}

class AnotherCustomElement extends HTMLElement {
  constructor() {
    const el = document.createElement('div');
    this.append(el);
  }
}
```

The following patterns are not warnings:

```ts
class NotACustomElement {
  constructor() {
    this.setAttribute('foo', 'bar');
  }
}

class MyCustomElement extends HTMLElement {
  connectedCallback() {
    this.setAttribute('foo', 'bar');
  }
}

class AnotherCustomElement extends HTMLElement {
  connectedCallback() {
    const el = document.createElement('div');
    this.append(el);
  }
}

class CustomElementWithShadowDOM extends HTMLElement {
  constructor() {
    this.attachShadow({mode: 'open'});
    const el = document.createElement('div');
    this.shadowRoot.append(el);
  }
}
```

## When Not To Use It

If for some reason you wish to interact with attributes and DOM, you
should not use this rule.
