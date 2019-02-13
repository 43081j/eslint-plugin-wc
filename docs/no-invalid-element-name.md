# Disallows invalid custom element names (no-invalid-element-name)

Ensures that your custom element name is valid, not reserved, and follows standard naming conventions.

More information on custom element naming conventions can be found [here](https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name).

## Rule Details

This rule disallows invalid element names.

The following patterns are considered warnings:

```ts
customElements.define('my-App', class extends HTMLElement {});
customElements.define('app', class extends HTMLElement {});
customElements.define('1-app', class extends HTMLElement {});
customElements.define('-app', class extends HTMLElement {});
customElements.define('my-app!', class extends HTMLElement {});
customElements.define('font-face', class extends HTMLElement {});
customElements.define('polymer-app', class extends HTMLElement {});
customElements.define('x-app', class extends HTMLElement {});
customElements.define('ng-app', class extends HTMLElement {});
customElements.define('xml-app', class extends HTMLElement {});
customElements.define('my-app-', class extends HTMLElement {});
customElements.define('my--app', class extends HTMLElement {});
```

The following patterns are not warnings:

```ts
customElements.define('my-app', class extends HTMLElement {});

// { loose: true }
customElements.define('polymer-app', class extends HTMLElement {});
customElements.define('x-app', class extends HTMLElement {});
customElements.define('ng-app', class extends HTMLElement {});
customElements.define('xml-app', class extends HTMLElement {});
customElements.define('my-app-', class extends HTMLElement {});
customElements.define('my--app', class extends HTMLElement {});
```

## When Not To Use It

If you wish to allow any names to be used for elements, you should not use this rule.
