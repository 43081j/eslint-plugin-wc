# eslint-plugin-wc

[![Build Status](https://travis-ci.com/43081j/eslint-plugin-wc.svg?branch=master)](https://travis-ci.com/43081j/eslint-plugin-wc)

ESLint plugin for Web Components.

# Install

```
$ npm i -D eslint eslint-plugin-wc
```

# Usage

Add `wc` to the plugins section of your `.eslintrc` file:

```json
{
  "plugins": ["wc"]
}
```

Configure your rules like so:

```json
{
  "rules": {
    "wc/rule-name": "error"
  }
}
```

# Configuration

You may also extend the recommended configuration like so:

```json
{
  "extends": ["plugin:wc/recommended"]
}
```

# Supported Rules

## Possible Errors (recommended)

| Rule                                                                    |                                                       |
| ----------------------------------------------------------------------- | ----------------------------------------------------- |
| [wc/no-constructor-attributes](docs/rules/no-constructor-attributes.md) | Disallows interaction with attributes in constructors |
| [wc/no-invalid-element-name](docs/rules/no-invalid-element-name.md)     | Disallows invalid custom element names                |
| [wc/no-self-class](docs/rules/no-self-class.md)                         | Disallows class mutations on self                     |

## Best Practice

| Rule                                                                    |                                                                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [wc/attach-shadow-constructor](docs/rules/attach-shadow-constructor.md) | Disallows attaching a shadow root outside the constructor                             |
| [wc/guard-super-call](docs/rules/guard-super-call.md)                   | Requires a guard before calling a super method inside a Custom Element Lifecycle hook |
| [wc/no-closed-shadow-root](docs/rules/no-closed-shadow-root.md)         | Disallows closed shadow roots                                                         |
| [wc/no-typos](docs/rules/no-typos.md)                                   | Prevents common typos                                                                 |
