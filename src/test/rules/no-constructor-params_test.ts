/**
 * @fileoverview Disallows constructor parameters in custom elements
 * @author James Garbutt <https://github.com/43081j>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-constructor-params.js';
import {RuleTester} from 'eslint';
import {parser} from 'typescript-eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2015
    }
  }
});

ruleTester.run('no-constructor-params', rule, {
  valid: [
    {
      code: `class Foo {}`
    },
    {
      code: `class Foo extends Unknown {
      constructor(arg1) {}
      }`
    },
    {
      code: `class Foo extends HTMLElement {
      constructor() {}
      }`
    },
    {
      code: `
      /** @customElement */
      class Foo extends Bar {
        constructor() {}
      }`
    },
    {
      code: `@customElement('x-foo')
      class Foo extends Bar {
        constructor() {}
      }`,
      languageOptions: {parser}
    }
  ],

  invalid: [
    {
      code: `class Foo extends HTMLElement {
        constructor(param1) {}
      }`,
      errors: [
        {
          messageId: 'noParams',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `/** @customElement */
      class Foo extends Bar {
        constructor(param1) {}
      }`,
      errors: [
        {
          messageId: 'noParams',
          line: 3,
          column: 9
        }
      ]
    },
    {
      code: `@customElement('x-foo')
      class Foo extends Bar {
        constructor(param1) {}
      }`,
      languageOptions: {parser},
      errors: [
        {
          messageId: 'noParams',
          line: 3,
          column: 9
        }
      ]
    }
  ]
});
