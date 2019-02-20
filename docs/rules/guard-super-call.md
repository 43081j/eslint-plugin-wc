# Requires a guard before calling a super method inside a Custom Element Lifecycle hook (guard-super-call)

Many element definitions may not include all the lifecycle hooks that `HTMLElement` provides. So
when extending these elements, it is best practice to check that the super lifecycle hook exists
before calling the super lifecycle hook.

## Rule Details

This rule requires a guard before calling a super lifecycle hook.

The following patterns are considered warnings:

```ts
class MyOtherElement extends MyElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('bar', 'baz');
  }
}
```

The following patterns are not warnings:

```ts
class MyOtherElement extends MyElement {
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.setAttribute('bar', 'baz');
  }
}
```

## When Not To Use It

If you wish to omit the super lifecycle hook's existence, you should not use this rule.
