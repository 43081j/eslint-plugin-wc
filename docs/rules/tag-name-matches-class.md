# Enforces that the tag name of a custom element matches its class name (tag-name-matches-class)

A Custom Element class can be named with any valid identifier name. Valid
identifiers are not one-to-one mapped with custom element tag names. For
example, idiomatic JavaScript would use camel case identifiers while custom
element tag names must be kebab case.

There are no constraints that force you to name the custom element tag name
similarly to the custom element class name. This lack of constraint can be
problematic when debugging, traversing a codebase, or looking for tag names
that bear no similarity to the class names.

By mapping custom element tag names to the class names, we can ensure a
consistent and more navigable codebase.

## Rule Details

This rule enforces that a custom element tag name matches its class name while
respecting the kebab/camel casing idioms.

👎 Examples of **incorrect** code for this rule:

```js
customElements.define('my-element', FooBar);
```

👍 Examples of **correct** code for this rule:

```js
customElements.define('foo-bar', FooBar);
```

### Options

- `suffix` can allow omission of a suffix from a tag name. Typed as a string
or a list of strings & is case sensitive.
- `prefix` can allow omission of a prefix from a tag name. Typed as a string
or a list of strings & is case sensitive.

👍 Examples of **correct** code for different `suffix` options:

- `["error"]`

  - `customElements.define('foo-bar', FooBar)`

- `["error", {"suffix": 'Element'}]`

  - `customElements.define('foo-bar', FooBar)`
  - `customElements.define('foo-bar', FooBarElement)`

- `["error", {"suffix": ['Element', 'Component']}]`

  - `customElements.define('foo-bar', FooBar)`
  - `customElements.define('foo-bar', FooBarElement)`
  - `customElements.define('foo-bar', FooBarComponent)`

- `["error", {"prefix": 'Iron'}]`

  - `customElements.define('foo-bar', FooBar)`
  - `customElements.define('foo-bar', IronFooBar)`

- `["error", {"prefix": ['Iron', 'Copper']}]`

  - `customElements.define('foo-bar', FooBar)`
  - `customElements.define('foo-bar', IronFooBar)`
  - `customElements.define('foo-bar', CopperFooBar)`

- `["error", {"prefix": ['Iron', 'Copper'], suffix: ['Element', 'Component']}]`
  - `customElements.define('foo-bar', FooBar)`
  - `customElements.define('foo-bar', IronFooBar)`
  - `customElements.define('foo-bar', IronFooBarElement)`
  - `customElements.define('foo-bar', IronFooBarComponent)`
  - `customElements.define('foo-bar', CopperFooBar)`
  - `customElements.define('foo-bar', CopperFooBarElement)`
  - `customElements.define('foo-bar', CopperFooBarComponent)`

## When Not To Use It

If you intentionally want to name your custom elements differently from their
defined tag names, then you can disable this rule.
