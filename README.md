<div align="center">
  <img src="media/eslint-webcomponents.svg" alt="Eslint + WebComponents" width="450" height="175" />
</div>

# `eslint-plugin-wc`

[![npm version](https://img.shields.io/npm/v/eslint-plugin-wc.svg?style=flat)](https://npmjs.org/package/eslint-plugin-wc 'View this project on npm')
[![Build Status](https://travis-ci.com/43081j/eslint-plugin-wc.svg?branch=master)](https://travis-ci.com/43081j/eslint-plugin-wc)
[![Coverage Status](https://coveralls.io/repos/github/43081j/eslint-plugin-wc/badge.svg?branch=master)](https://coveralls.io/github/43081j/eslint-plugin-wc?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> ESLint plugin for [Web Components](https://www.webcomponents.org/introduction).

## Install

Assuming you already have ESLint installed, run:

```sh
# npm
npm install eslint-plugin-wc --save-dev

# yarn
yarn add eslint-plugin-wc --dev
```

## Usage

Then extend the recommended eslint config:

```js
{
  "extends": [
    // ...
    "plugin:wc/recommended"
  ]
}
```

You should also specify settings that will be shared across all the plugin rules. ([More about eslint shared settings](https://eslint.org/docs/user-guide/configuring/configuration-files#adding-shared-settings))

```jsonc
{
  "settings": {
    "wc": {
      "elementBaseClasses": ["LitElement"] // Recognize `LitElement` as a Custom Element base class
    }
  }
}
```

### Custom Configuration

If you want more fine-grained configuration, you can instead add a snippet like this to your ESLint configuration file:

```js
{
  "plugins": [
    // ...
    "wc"
  ],
  "rules": {
    // ...
    "wc/no-invalid-element-name": "error",
    "wc/no-typos": "warn"
  }
}
```

## Supported Rules

<!-- TODO: Generate with `md-magic` -->

### Possible Errors (Recommended)

| Rule                                                                    | Description                                           | Fixable? |
| ----------------------------------------------------------------------- | ----------------------------------------------------- | -------- |
| [wc/no-constructor-attributes](docs/rules/no-constructor-attributes.md) | Disallows interaction with attributes in constructors |          |
| [wc/no-invalid-element-name](docs/rules/no-invalid-element-name.md)     | Disallows invalid custom element names                |          |
| [wc/no-self-class](docs/rules/no-self-class.md)                         | Disallows class mutations on self                     |          |

### Best Practice

| Rule                                                                    | Description                                                                           | Fixable? |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------- |
| [wc/attach-shadow-constructor](docs/rules/attach-shadow-constructor.md) | Disallows attaching a shadow root outside the constructor                             |          |
| [wc/guard-super-call](docs/rules/guard-super-call.md)                   | Requires a guard before calling a super method inside a Custom Element Lifecycle hook |          |
| [wc/no-closed-shadow-root](docs/rules/no-closed-shadow-root.md)         | Disallows closed shadow roots                                                         |          |
| [wc/no-typos](docs/rules/no-typos.md)                                   | Prevents common typos                                                                 |          |
| [wc/no-constructor-params](docs/rules/no-constructor-params.md)         | Disallows constructor parameters of custom elements                                   |          |

## Shareable configurations

### Recommended

This plugin exports a `recommended` configuration that enforces WebComponent good practices.

To enable this configuration use the `extends` property in your `.eslintrc` config file:

```js
{
  "extends": ["eslint:recommended", "plugin:wc/recommended"]
}
```

### Best Practices

This plugin exports a `best-practice` configuration that enforces WebComponent best practices.

To enable this configuration use the `extends` property in your `.eslintrc` config file:

```js
{
  "extends": ["eslint:recommended", "plugin:wc/best-practice"]
}
```

## License

`eslint-plugin-wc` is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
