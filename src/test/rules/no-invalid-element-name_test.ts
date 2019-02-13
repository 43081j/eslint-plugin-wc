/**
 * @fileoverview Disallows invalid custom element names
 * @author Michael Stramel <https://github.com/stramel>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-invalid-element-name';
import {RuleTester} from 'eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module'
  }
});

ruleTester.run('no-invalid-element-name', rule, {
  valid: [
    {
      code: `customElements.define('my-app', class extends HTMLElement {})`
    },
    {
      code: `class MyApp extends HTMLElement {}
      customElements.define('my-app', MyApp)`
    },
    {
      code: `customElements['define']('my-app', class extends HTMLElement {})`
    },
    {
      code: `customElements.define('polymer-app', class extends HTMLElement {})`,
      options: [{loose: true}]
    },
    {
      code: `customElements.define('x-app', class extends HTMLElement {})`,
      options: [{loose: true}]
    },
    {
      code: `customElements.define('ng-app', class extends HTMLElement {})`,
      options: [{loose: true}]
    },
    {
      code: `customElements.define('xml-app', class extends HTMLElement {})`,
      options: [{loose: true}]
    },
    {
      code: `customElements.define('my-app-', class extends HTMLElement {})`,
      options: [{loose: true}]
    },
    {
      code: `customElements.define('my--app', class extends HTMLElement {})`,
      options: [{loose: true}]
    }
    // FUTURE: If Scoping is easier, attempt to implement a few other use-cases
    // {
    //   code: `
    //     class MyApp extends HTMLElement {
    //       static get is() { return 'my-app' }
    //     }
    //     customElements.define(MyApp.is, MyApp)
    //   `
    // },
  ],

  invalid: [
    {
      code: `class MyApp extends HTMLElement {}
      customElements.define('my-App', MyApp)`,
      errors: [
        {
          message:
            'Custom element names must not contain uppercase ASCII characters.',
          line: 2,
          column: 29
        }
      ]
    },
    {
      code: `customElements.define('my-App', class extends HTMLElement {})`,
      errors: [
        {
          message:
            'Custom element names must not contain uppercase ASCII characters.',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('app', class extends HTMLElement {})`,
      errors: [
        {
          message:
            'Custom element names must contain a hyphen. Example: unicorn-cake',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('1-app', class extends HTMLElement {})`,
      errors: [
        {
          message: 'Custom element names must not start with a digit.',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('-app', class extends HTMLElement {})`,
      errors: [
        {
          message: 'Custom element names must not start with a hyphen.',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my-app!', class extends HTMLElement {})`,
      errors: [
        {
          message: 'Invalid element name.',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('font-face', class extends HTMLElement {})`,
      errors: [
        {
          message: `The supplied element name is reserved and can\'t be used.\nSee: https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name`,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('polymer-app', class extends HTMLElement {})`,
      errors: [
        {
          message:
            'Custom element names should not start with `polymer-`.\nSee: http://webcomponents.github.io/articles/how-should-i-name-my-element',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('x-app', class extends HTMLElement {})`,
      errors: [
        {
          message:
            'Custom element names should not start with `x-`.\nSee: http://webcomponents.github.io/articles/how-should-i-name-my-element/',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('ng-app', class extends HTMLElement {})`,
      errors: [
        {
          message:
            'Custom element names should not start with `ng-`.\nSee: http://docs.angularjs.org/guide/directive#creating-directives',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('xml-app', class extends HTMLElement {})`,
      errors: [
        {
          message: 'Custom element names should not start with `xml`.',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my-app-', class extends HTMLElement {})`,
      errors: [
        {
          message: 'Custom element names should not end with a hyphen.',
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my--app', class extends HTMLElement {})`,
      errors: [
        {
          message:
            'Custom element names should not contain consecutive hyphens.',
          line: 1,
          column: 23
        }
      ]
    }
  ]
});
