/**
 * @fileoverview Prevents common typos
 * @author James Garbutt <https://github.com/43081j>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import {fileURLToPath} from 'node:url';
import rule from '../../rules/no-typos.js';
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

const parser = fileURLToPath(import.meta.resolve('@typescript-eslint/parser'));

ruleTester.run('no-typos', rule, {
  valid: [
    {
      code: `class Foo extends HTMLElement {
      connectedCallback() {}
      disconnectedCallback() {}
      adoptedCallback() {}
      attributeChangedCallback() {}
    }`
    },
    {
      code: `class Foo {
      connectCallback() {}
      connectedCallbac() {}
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      observedAttributes() {}
    }`
    },
    {
      code: `class Foo extends HTMLElement {
        static get obsereveddAttribute() {}
      }`
    },
    {
      code: `class Foo extends HTMLElement {
        get observedAttributes() {}
      }`
    }
  ],

  invalid: [
    {
      code: `class Foo extends HTMLElement {
        onnectedCallback() {}
        isconnectedCallback() {}
        doptedCallback() {}
        ttributeChangedCallback() {}
      }`,
      errors: [
        {
          messageId: 'method',
          data: {
            replacement: 'connectedCallback'
          },
          line: 2,
          column: 9
        },
        {
          messageId: 'method',
          data: {
            replacement: 'disconnectedCallback'
          },
          line: 3,
          column: 9
        },
        {
          messageId: 'method',
          data: {
            replacement: 'adoptedCallback'
          },
          line: 4,
          column: 9
        },
        {
          messageId: 'method',
          data: {
            replacement: 'attributeChangedCallback'
          },
          line: 5,
          column: 9
        }
      ]
    },
    {
      code: `/** @customElement **/
        class Foo extends Bar {
          onnectedCallback() {}
        }`,
      errors: [
        {
          messageId: 'method',
          data: {
            replacement: 'connectedCallback'
          },
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        connectedCallbac() {}
        connectedCallbackk() {}
        connectedWallback() {}
      }`,
      errors: [
        {
          messageId: 'method',
          data: {
            replacement: 'connectedCallback'
          },
          line: 2,
          column: 9
        },
        {
          messageId: 'method',
          data: {
            replacement: 'connectedCallback'
          },
          line: 3,
          column: 9
        },
        {
          messageId: 'method',
          data: {
            replacement: 'connectedCallback'
          },
          line: 4,
          column: 9
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        static get observedAtributes() {}
      }`,
      errors: [
        {
          messageId: 'member',
          data: {
            replacement: 'observedAttributes'
          },
          line: 2,
          column: 20
        }
      ]
    },
    {
      code: `/** @customElement **/
        class Foo extends Bar {
          static get observedAtributes() {}
        }`,
      errors: [
        {
          messageId: 'member',
          data: {
            replacement: 'observedAttributes'
          },
          line: 3,
          column: 22
        }
      ]
    },
    {
      code: `@customElement('x-foo')
        class Foo extends Bar {
          static get observedAtributes() {}
        }`,
      parser,
      errors: [
        {
          messageId: 'member',
          data: {
            replacement: 'observedAttributes'
          },
          line: 3,
          column: 22
        }
      ]
    },
    {
      code: `class Foo extends Bar {
        static get observedAtributes() {}
      }`,
      settings: {
        wc: {
          elementBaseClasses: ['Bar']
        }
      },
      errors: [
        {
          messageId: 'member',
          data: {
            replacement: 'observedAttributes'
          },
          line: 2,
          column: 20
        }
      ]
    }
  ]
});
