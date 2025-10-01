/**
 * @fileoverview Disallows class mutations on self
 * @author James Garbutt <https://github.com/43081j>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-self-class.js';
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

ruleTester.run('no-self-class', rule, {
  valid: [
    {
      code: `class Foo {
      method() {
        this.classList.add('foo');
        this.classList.remove('foo');
        this.classList.toggle('foo');
        this.classList.replace('foo', 'bar');
        this.className = 'foo';
        this.className += 'foo';
      }
    }`
    },
    {
      code: `function x() {
      this.classList.add('foo');
      this.classList.remove('foo');
      this.classList.toggle('foo');
      this.classList.replace('foo', 'bar');
      this.className = 'foo';
      this.className += 'foo';
    }`
    },
    {
      code: `node.classList.add('foo');
      node.classList.remove('foo');
      node.classList.toggle('foo');
      node.classList.replace('foo', 'bar');
      node.className = 'foo';
      node.className += 'foo';
    `
    },
    {
      code: `class Foo extends HTMLElement {
      method(node) {
        node.classList.add('foo');
        node.classList.remove('foo');
        node.classList.toggle('foo');
        node.classList.replace('foo', 'bar');
        node.className = 'foo';
        node.className += 'foo';
      }
    }`
    },
    {
      code: `class Foo extends HTMLElement {
      method(node) {
        node.setAttribute('class', 'x');
      }
    }`
    }
  ],

  invalid: [
    {
      code: `class Foo extends HTMLElement {
        method() {
          this.classList.add('foo');
          this.classList.remove('foo');
          this.classList.toggle('foo');
          this.classList.replace('foo', 'bar');
          this.className = 'foo';
          this.className += 'foo';
        }
      }`,
      errors: [
        {
          messageId: 'selfClass',
          line: 3,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 4,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 5,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 6,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 7,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 8,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        constructor() {
          this.classList.add('foo');
          this.classList.remove('foo');
          this.classList.toggle('foo');
          this.classList.replace('foo', 'bar');
          this.className = 'foo';
          this.className += 'foo';
        }
      }`,
      errors: [
        {
          messageId: 'selfClass',
          line: 3,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 4,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 5,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 6,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 7,
          column: 11
        },
        {
          messageId: 'selfClass',
          line: 8,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        method() {
          if (true) {
            if (true) {
              this.classList.add('foo');
            }
          }
        }
      }`,
      errors: [
        {
          messageId: 'selfClass',
          line: 5,
          column: 15
        }
      ]
    },
    {
      code: `class Foo extends HTMLElement {
        method() {
          this.setAttribute('class', 'foo');
        }
      }`,
      errors: [
        {
          messageId: 'selfClass',
          line: 3,
          column: 11
        }
      ]
    },
    {
      code: `/** @customElement **/
      class Foo extends Bar {
        method() {
          this.className += 'test';
        }
      }`,
      errors: [
        {
          messageId: 'selfClass',
          line: 4,
          column: 11
        }
      ]
    },
    {
      code: `@customElement('x-foo')
      class Foo extends Bar {
        method() {
          this.className += 'test';
        }
      }`,
      languageOptions: {parser},
      errors: [
        {
          messageId: 'selfClass',
          line: 4,
          column: 11
        }
      ]
    },
    {
      code: `class Foo extends Bar {
        method() {
          this.className += 'test';
        }
      }`,
      settings: {
        wc: {
          elementBaseClasses: ['Bar']
        }
      },
      errors: [
        {
          messageId: 'selfClass',
          line: 3,
          column: 11
        }
      ]
    }
  ]
});
