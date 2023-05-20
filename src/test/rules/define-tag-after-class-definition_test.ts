/**
 * @fileoverview Enforces that the `define(...)` call happens after the
 * associated class has been defined
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/define-tag-after-class-definition';
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

ruleTester.run('define-tag-after-class-definition', rule, {
  valid: [
    'class Foo {}',
    `class Foo extends HTMLElement {}
    customElements.define('x-foo', Foo);`,
    `class Foo extends HTMLElement {}
    const x = 303;
    customElements.define('x-foo', Foo);`,
    `class Foo extends HTMLElement {}
    window.customElements.define('x-foo', Foo);`,
    `/** @customElement x-foo */
    class Foo extends Bar {}
    customElements.define('x-foo', Foo);`,
    `customElements.define('x-foo', Foo);`,
    `const Foo = doSomeBlackBoxThing();
    customElements.define('x-foo', Foo);`,
    {
      code: `class Foo extends Bar {}
      customElements.define('x-foo', Foo);`,
      settings: {
        wc: {
          elementBaseClasses: ['Bar']
        }
      }
    }
  ],

  invalid: [
    {
      code: 'class Foo extends HTMLElement {}',
      errors: [
        {
          messageId: 'unregistered',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `customElements.define('x-foo', Foo);
      class Foo extends HTMLElement {}`,
      errors: [
        {
          messageId: 'unregistered',
          line: 2,
          column: 7
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {}
      customElements.define('x-foo', someThingElse);`,
      errors: [
        {
          messageId: 'unregistered',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {}
      customElements.define('x-foo', someDynamicThing());`,
      errors: [
        {
          messageId: 'unregistered',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {}
        someOtherNonsense.define('x-foo', Foo);`,
      errors: [
        {
          messageId: 'unregistered',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `customElements.define('x-foo', class extends HTMLElement {
      });`,
      errors: [
        {
          messageId: 'noExpressions',
          line: 1,
          column: 32
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
          messageId: 'unregistered',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `/** @customElement x-foo */
      class Foo extends Bar {}`,
      errors: [
        {
          messageId: 'unregistered',
          line: 2,
          column: 7
        }
      ]
    }
  ]
});
