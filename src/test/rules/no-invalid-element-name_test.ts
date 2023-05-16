/**
 * @fileoverview Disallows invalid custom element names
 * @author Michael Stramel <https://github.com/stramel>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-invalid-element-name';
import {RuleTester} from 'eslint';
import {knownNamespaces} from '../../util/tag-names';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015
  }
});

ruleTester.run('no-invalid-element-name', rule, {
  valid: [
    {
      code: `customElements.define('my-app', class extends HTMLElement {})`
    },
    {
      code: `window.customElements.define('my-app', class extends HTMLElement {})`
    },
    {
      code: `class MyApp extends HTMLElement {}
      customElements.define('my-app', MyApp)`
    },
    {
      code: `customElements['define']('my-app', class extends HTMLElement {})`
    },
    ...[...knownNamespaces].map((ns) => ({
      code: `customElements.define('${ns}-foo', class extends HTMLElement {})`
    })),
    {
      code: `customElements.define('jg-foo', class extends HTMLElement {})`,
      options: [
        {
          prefix: ['jg']
        }
      ]
    },
    {
      code: `customElements.define('jg-foo', class extends HTMLElement {})`,
      options: [
        {
          prefix: []
        }
      ]
    },
    {
      code: `customElements.define('foo-jg', class extends HTMLElement {})`,
      options: [
        {
          suffix: ['jg']
        }
      ]
    },
    {
      code: `customElements.define('foo-jg', class extends HTMLElement {})`,
      options: [
        {
          suffix: []
        }
      ]
    },
    {
      code: `customElements.define('foo-\xc0', class extends HTMLElement {})`
    },
    // FUTURE: If Scoping is easier, attempt to implement a few other use-cases
    // NOTE: This case is currently ignored
    {
      code: `
        class MyApp extends HTMLElement {
          static get is() { return 'my-app' }
        }
        customElements.define(MyApp.is, MyApp)
      `
    }
  ],

  invalid: [
    ...[...knownNamespaces].map((ns) => ({
      code: `customElements.define('${ns}-foo', class extends HTMLElement {})`,
      options: [
        {
          disallowNamespaces: true
        }
      ],
      errors: [
        {
          messageId: 'disallowedNamespace',
          line: 1,
          column: 23
        }
      ]
    })),
    {
      code: `class MyApp extends HTMLElement {}
      customElements.define('my-App', MyApp)`,
      errors: [
        {
          messageId: 'invalidElementName',
          line: 2,
          column: 29
        }
      ]
    },
    {
      code: `class MyApp extends HTMLElement {}
      window.customElements.define('my-App', MyApp)`,
      errors: [
        {
          messageId: 'invalidElementName',
          line: 2,
          column: 36
        }
      ]
    },
    {
      code: `customElements.define('my-App', class extends HTMLElement {})`,
      errors: [
        {
          messageId: 'invalidElementName',
          data: {
            hints: 'Name must contain only lowercase characters'
          },
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('app', class extends HTMLElement {})`,
      errors: [
        {
          messageId: 'invalidElementName',
          data: {
            hints: 'Name must contain a hyphen/dash'
          },
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('1-app', class extends HTMLElement {})`,
      errors: [
        {
          messageId: 'invalidElementName',
          data: {
            hints: 'Name must start with a letter'
          },
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('-app', class extends HTMLElement {})`,
      errors: [
        {
          messageId: 'invalidElementName',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my-app!', class extends HTMLElement {})`,
      errors: [
        {
          messageId: 'invalidElementName',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('font-face', class extends HTMLElement {})`,
      errors: [
        {
          messageId: 'invalidElementName',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my-app-', class extends HTMLElement {})`,
      errors: [
        {
          messageId: 'dashes',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my--app', class extends HTMLElement {})`,
      errors: [
        {
          messageId: 'dashes',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('bad-foo', class extends HTMLElement {})`,
      options: [
        {
          prefix: ['good']
        }
      ],
      errors: [
        {
          messageId: 'requiredPrefix',
          data: {prefixes: 'good'},
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('foo-bad', class extends HTMLElement {})`,
      options: [
        {
          suffix: ['good']
        }
      ],
      errors: [
        {
          messageId: 'requiredSuffix',
          data: {suffixes: 'good'},
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('foo-\xc0', class extends HTMLElement {})`,
      options: [
        {
          onlyAlphanum: true
        }
      ],
      errors: [
        {
          messageId: 'onlyAlphanum',
          line: 1,
          column: 23
        }
      ]
    }
  ]
});
