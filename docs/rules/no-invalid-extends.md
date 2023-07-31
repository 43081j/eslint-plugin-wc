# Enforce that a custom element extends the correct class (no-invalid-extends)

There are two distinct types of Custom Elements that can be defined:

- An **autonomous custom element**, which is defined with no `extends` option.
- A **customized built-in element**, which is defined with an `extends` option.

The [specification defines the requirements of the superclass for each of these types](https://html.spec.whatwg.org/multipage/dom.html#html-element-constructors). Autonomous custom elements _must_ extends the base `HTMLElement` class. Customized built in elements _must_ extend the base constructor of the element they wish to extend, for example an element that is defined as `extends: "p"` must itself `extends HTMLParagraphElement`. Trying to extend from another class will silently fail, and the browser will not upgrade the element to the desired class.

## Rule Details

This rule enforces that any call to `customElements.define` must be given the correct superclass. If the `extends` option is passed, then the given classes superclass must match the named element. If the `extends` option is not passed, then the given classes superclass must be `HTMLElement` or specified by the [`allowedSuperNames` ESLint option](#allowedSuperNames).

The following patterns are considered warnings:

```js
customElements.define('foo-bar', class extends HTMLParagraphElement {})
// ^ `foo-bar` extends HTMLParagraphElement but define call did not extend `p`
```

```js
customElements.define('foo-bar', class extends HTMLElement {}, {extends: 'p'})
// ^ `foo-bar` extends `p` but it extends HTMLElement
```

The following patterns are not warnings:

```js
customElements.define('foo-bar', class extends HTMLElement {})
```

```js
customElements.define('foo-bar', class extends HTMLParagraphElement {}, {extends: 'p'})
```

### Options

- The `elementBaseClasses` supplied in [`settings` (read more in the readme)](https://github.com/43081j/eslint-plugin-wc/blob/master/README.md#usage) will also be allowed.
- `allowedSuperNames` is an array option (default: []) can specify what classes an Autonomous custom element _may_ extend. It is assumed that by using this option, any allowed super name _must_ extend `HTMLElement` in its prototype chain.

## When Not To Use It

If you are comfortable with silent failures when extending types don't match.
