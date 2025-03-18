/**
 * @fileoverview Enforces that custom element classes are exposed on the
 * global object (i.e. `window`)
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/expose-class-on-global.js';
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

ruleTester.run('expose-class-on-global', rule, {
  valid: [
    'class Foo {}',
    `class Foo extends HTMLElement {}
    window.Foo = Foo`,
    `class Foo extends HTMLElement {}
    globalThis.Foo = Foo`,
    `class Foo extends HTMLElement {}
    const x = 303;
    window.Foo = Foo;`,
    `/** @customElement x-foo */
    class Foo extends Bar {}
    window.Foo = Foo;`,
    'class Foo extends Bar{}',
    `window.Foo = Bar;`,
    {
      code: `class Foo extends Bar {}
      window.Foo = Foo;`,
      settings: {
        wc: {
          elementBaseClasses: ['Bar']
        }
      }
    },
    'window.Foo = class Foo extends HTMLElement {}'
  ],

  invalid: [
    {
      code: `window.Foo = class extends HTMLElement {}`,
      errors: [
        {
          messageId: 'sameName',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {}`,
      errors: [
        {
          messageId: 'expose',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `window.Foo = Foo;
      class Foo extends HTMLElement {}`,
      errors: [
        {
          messageId: 'expose',
          line: 2,
          column: 7
        }
      ]
    },
    {
      code: `/** @customElement x-foo */
      class Foo extends Bar {}`,
      errors: [
        {
          messageId: 'expose',
          line: 2,
          column: 7
        }
      ]
    },
    {
      code: 'class Foo extends Bar {}',
      settings: {
        wc: {
          elementBaseClasses: ['Bar']
        }
      },
      errors: [
        {
          messageId: 'expose',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {}
      window.x = Foo;`,
      errors: [
        {
          messageId: 'sameName',
          line: 2,
          column: 7
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {}
      globalThis.x = Foo;`,
      errors: [
        {
          messageId: 'sameName',
          line: 2,
          column: 7
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {}
      window.deep.path = Foo;`,
      errors: [
        {
          messageId: 'expose',
          line: 1,
          column: 1
        }
      ]
    }
  ]
});
