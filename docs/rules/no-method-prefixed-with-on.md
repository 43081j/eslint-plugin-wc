# Disallows methods prefixed with `on` (no-method-prefixed-with-on)

[Elements have a implicit contract with regards to `on` prefixed methods](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers).
Any method prefixed with `on` is expected to be an assignable property and to
fire at the same time that its similarly named event is fired. Consider
[`onclick`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick)
vs.
[the `click` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event).
All built-in elements follow this contract, for example the
`HTMLDetailsElement.ontoggle` property or the `HTMLVideoElement.onwaiting`
property.

The [`GlobalEventHandlers`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers)
mixin adds a list of `on` prefixed methods on `HTMLElement`, `Document` and
`Window`. Prefixing methods with `on` risks colliding with these methods.
The `GlobalEventHandlers` list is not fixed and has potential to grow as new
elements or events are added to the HTML spec.

## Rule Details

This rule disallows any method names that start with `on` in a Custom Element
class definition.

👎 Examples of **incorrect** code for this rule:

```js
class FooBar extends HTMLElement {
  onclick() {
    // ...
  }
}
```

👍 Examples of **correct** code for this rule:

```js
class FooBar extends HTMLElement {
  handleClick() {
    // ...
  }
}
```

## When Not To Use It

If you are comfortable with the possibility of clashing with
`GlobalEventHandlers` or want to intentionally overwrite those methods.
