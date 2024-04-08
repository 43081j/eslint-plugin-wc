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

Or if you're using ESLint flat configs, add this to your `eslint.config.js`:

```ts
import {configs} from 'eslint-plugin-wc';

export default [
  configs.recommended,

  // or if you want to specify `files`, or other options
  {
    ...configs.recommended,
    files: ['test/**/*.js']
  }
];
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

### Possible Errors (Recommended)

- [wc/no-constructor-attributes](docs/rules/no-constructor-attributes.md)
- [wc/no-invalid-element-name](docs/rules/no-invalid-element-name.md)
- [wc/no-self-class](docs/rules/no-self-class.md)

### Best Practice

- [wc/attach-shadow-constructor](docs/rules/attach-shadow-constructor.md)
- [wc/guard-super-call](docs/rules/guard-super-call.md)
- [wc/no-child-traversal-in-attributechangedcallback](docs/rules/no-child-traversal-in-attributechangedcallback.md)
- [wc/no-child-traversal-in-connectedcallback](docs/rules/no-child-traversal-in-connectedcallback.md)
- [wc/no-closed-shadow-root](docs/rules/no-closed-shadow-root.md)
- [wc/no-constructor-params](docs/rules/no-constructor-params.md)
- [wc/no-customized-built-in-elements](docs/rules/no-customized-built-in-elements.md)
- [wc/no-invalid-extends](docs/rules/no-invalid-extends.md)
- [wc/no-typos](docs/rules/no-typos.md)
- [wc/require-listener-teardown](docs/rules/require-listener-teardown.md)

### Preference/convention

- [wc/define-tag-after-class-definition](docs/rules/define-tag-after-class-definition.md)
- [wc/expose-class-on-global](docs/rules/expose-class-on-global.md)
- [wc/file-name-matches-element](docs/rules/file-name-matches-element.md)
- [wc/guard-define-call](docs/rules/guard-define-call.md)
- [wc/max-elements-per-file](docs/rules/max-elements-per-file.md)
- [wc/no-constructor](docs/rules/no-constructor.md)
- [wc/no-exports-with-element](docs/rules/no-exports-with-element.md)
- [wc/no-method-prefixed-with-on](docs/rules/no-method-prefixed-with-on.md)
- [wc/tag-name-matches-class](docs/rules/tag-name-matches-class.md)

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

**Note**: These configurations will enable `sourceType: 'module'` in [parser options](http://eslint.org/docs/user-guide/configuring#specifying-parser-options).

## License

`eslint-plugin-wc` is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
