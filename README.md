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

- [wc/attach-shadow-constructor](docs/rules/attach-shadow-constructor.md)
- [wc/guard-super-call](docs/rules/guard-super-call.md)
- [wc/no-constructor-attributes](docs/rules/no-constructor-attributes.md)
- [wc/no-closed-shadow-root](docs/rules/no-closed-shadow-root.md)
- [wc/no-invalid-element-name](docs/rules/no-invalid-element-name.md)
- [wc/no-self-class](docs/rules/no-self-class.md)
- [wc/no-typos](docs/rules/no-typos.md)
