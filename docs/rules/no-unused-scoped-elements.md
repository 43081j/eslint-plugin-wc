# Disallows unused entries in static `scopedElements` (no-unused-scoped-elements)

When using scoped custom element registries, every tag listed in
`scopedElements` should be used in the component template. Unused mappings add
noise and make maintenance harder.

## Rule Details

This rule reports string-literal tags declared in static `scopedElements` when
they are not used in template-like class method bodies.

It supports both:

* `static scopedElements = { ... }`
* `static get scopedElements() { return { ... }; }`

The following patterns are considered warnings:

```ts
class MyPage {
  static scopedElements = {
    'unused-tag': UnusedTag
  };

  render() {
    return html`<div></div>`;
  }
}
```

```ts
class MyPage {
  static get scopedElements() {
    return {
      'unused-tag': UnusedTag
    };
  }

  render() {
    return html`<div></div>`;
  }
}
```

The following patterns are not warnings:

```ts
class MyPage {
  static scopedElements = {
    'my-tag': MyTag
  };

  render() {
    return html`<my-tag></my-tag>`;
  }
}
```

```ts
class MyPage {
  static get scopedElements() {
    return {
      'my-tag': MyTag
    };
  }

  renderHelper() {
    return html`<my-tag></my-tag>`;
  }

  render() {
    return this.renderHelper();
  }
}
```

## Limitations

This rule intentionally focuses on static analysis of straightforward patterns:

* Only static `scopedElements` defined as an object literal (or returned object literal) are checked.
* Dynamic/computed values (for example function calls or computed keys) are ignored.
* Usage detection is text-based over class method bodies, so highly dynamic rendering patterns may not be detected.

## When Not To Use It

If your `scopedElements` declarations are intentionally broad or mostly dynamic
and you do not want static usage checks, you should not use this rule.