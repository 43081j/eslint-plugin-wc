# Disallows class mutations on self (no-self-class)

Elements are considered owned by their consumer (the developer
using the element), so their classes should not be altered by the element
its self in order to avoid potentially altering the classes they have set.

More information on this can be found
[here](https://developers.google.com/web/fundamentals/web-components/best-practices#do-not-self-apply-classes).

## Rule Details

This rule disallows class mutations in custom elements on themselves.

The following patterns are considered warnings:

```ts
class MyElement extends HTMLElement {
  method() {
    this.classList.add('foo');
    this.className += 'bar';
    this.setAttribute('class', 'baz');
  }
}
```

The following patterns are not warnings:

```ts
class MyElement extends HTMLElement {
  method(node) {
    node.classList.add('foo');
    node.className += 'bar';
    node.setAttribute('class', 'baz');
  }
}

class OtherElement extends HTMLElement {
  method() {
    this.shadowRoot.querySelector('.container').classList.add('foo');
  }
}
```

## When Not To Use It

If you wish to alter classes on the current element (self), you should
not use this rule.
