# Disallows closed shadow roots (no-closed-shadow-root)

Closed shadow roots are very rarely used and can hinder development/interaction
with an element.

More information on closed shadow roots and why they may not be of much
use can be found
[here](https://developers.google.com/web/fundamentals/web-components/shadowdom#closed).

## Rule Details

This rule disallows use of closed shadow roots on all elements.

The following patterns are considered warnings:

```ts
this.attachShadow({ mode: 'closed' });
node.attachShadow({ mode: 'closed' });
```

The following patterns are not warnings:

```ts
this.attachShadow({ mode: 'open' });
node.attachShadow({ mode: 'open' });
```

## When Not To Use It

If you wish to use closed shadow roots, you should not use this rule.
