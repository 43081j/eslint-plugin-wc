<div align="center">
  <img src="media/eslint-webcomponents.png" alt="Eslint + WebComponents" />
</div>

# eslint-plugin-wc

ESLint plugin for Web Components.

[![npm version](https://img.shields.io/npm/v/eslint-plugin-wc.svg?style=flat)](https://npmjs.org/package/eslint-plugin-wc 'View this project on npm')
[![Build Status](https://travis-ci.com/43081j/eslint-plugin-wc.svg?branch=master)](https://travis-ci.com/43081j/eslint-plugin-wc)
[![Coverage Status](https://coveralls.io/repos/github/43081j/eslint-plugin-wc/badge.svg?branch=master)](https://coveralls.io/github/43081j/eslint-plugin-wc?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Install

```
$ npm i -D eslint eslint-plugin-wc
```

## Usage

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

## Configuration

You may also extend the recommended configuration like so:

```json
{
  "extends": ["plugin:wc/recommended"],
  "env": {"browser": true}
}
```

Or the best practice configuration which extends this to include all
best practice rules:

```json
{
  "extends": ["plugin:wc/best-practice"],
  "env": {"browser": true}
}
```

### Custom settings

Settings are configured through a `settings` option in your eslintrc file.

#### `wc.elementBaseClasses`

```json
{
  "settings": {
    "wc": {
      "elementBaseClasses": ["MyBaseElement"]
    }
  }
}
```

Using this setting, you can control which base classes are considered
to be custom elements.

## Supported Rules

### Possible Errors (recommended)

| Rule                                                                    |                                                       |
| ----------------------------------------------------------------------- | ----------------------------------------------------- |
| [wc/no-constructor-attributes](docs/rules/no-constructor-attributes.md) | Disallows interaction with attributes in constructors |
| [wc/no-invalid-element-name](docs/rules/no-invalid-element-name.md)     | Disallows invalid custom element names                |
| [wc/no-self-class](docs/rules/no-self-class.md)                         | Disallows class mutations on self                     |

### Best Practice

| Rule                                                                    |                                                                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [wc/attach-shadow-constructor](docs/rules/attach-shadow-constructor.md) | Disallows attaching a shadow root outside the constructor                             |
| [wc/guard-super-call](docs/rules/guard-super-call.md)                   | Requires a guard before calling a super method inside a Custom Element Lifecycle hook |
| [wc/no-closed-shadow-root](docs/rules/no-closed-shadow-root.md)         | Disallows closed shadow roots                                                         |
| [wc/no-typos](docs/rules/no-typos.md)                                   | Prevents common typos                                                                 |
