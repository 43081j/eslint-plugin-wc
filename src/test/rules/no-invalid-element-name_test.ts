/**
 * @fileoverview Disallows invalid custom element names
 * @author Michael Stramel <https://github.com/stramel>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule, {errorMessage} from '../../rules/no-invalid-element-name';
import {RuleTester} from 'eslint';

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
    {
      code: `class MyApp extends HTMLElement {}
      customElements.define('my-App', MyApp)`,
      errors: [
        {
          message: errorMessage,
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
          message: errorMessage,
          line: 2,
          column: 36
        }
      ]
    },
    {
      code: `customElements.define('my-App', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('app', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('1-app', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('-app', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my-app!', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('font-face', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('polymer-app', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('x-app', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('ng-app', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('xml-app', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my-app-', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    },
    {
      code: `customElements.define('my--app', class extends HTMLElement {})`,
      errors: [
        {
          message: errorMessage,
          line: 1,
          column: 23
        }
      ]
    }
  ]
});
