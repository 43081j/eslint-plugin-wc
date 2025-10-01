/**
 * @fileoverview Enforces that the tag name of a custom element matches its
 * class name
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/tag-name-matches-class.js';
import {RuleTester} from 'eslint';

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

ruleTester.run('tag-name-matches-class', rule, {
  valid: [
    'const x = 303;',
    `fakeCustomElements.define('foo-bar', FewBor)`,
    `customElements.define('foo-bar', FooBar)`,
    `window.customElements.define('foo-bar', FooBar)`,
    `customElements.define('foo-bar', class FooBar extends HTMLElement {})`,
    `customElements.define(unknownConst, class FooBar extends HTMLElement {})`,
    `customElements.define('foo-bar', class extends HTMLElement {})`,
    {
      code: `customElements.define('bar-baz', FooBarBaz);`,
      options: [
        {
          prefix: ['Foo']
        }
      ]
    },
    {
      code: `customElements.define('bar-baz', FooBarBaz);`,
      options: [
        {
          prefix: 'Foo'
        }
      ]
    },
    {
      code: `customElements.define('bar-baz', BarBaz);`,
      options: [
        {
          prefix: ['Foo']
        }
      ]
    },
    {
      code: `customElements.define('foo-bar', FooBarBaz);`,
      options: [
        {
          suffix: ['Baz']
        }
      ]
    },
    {
      code: `customElements.define('foo-bar', FooBarBaz);`,
      options: [
        {
          suffix: 'Baz'
        }
      ]
    },
    {
      code: `customElements.define('foo-bar', FooBar);`,
      options: [
        {
          suffix: ['Baz']
        }
      ]
    },
    {
      code: `customElements.define('hot-dogs', FooHotDogsBaz);`,
      options: [
        {
          prefix: ['Foo'],
          suffix: ['Baz']
        }
      ]
    },
    {
      code: `customElements.define(
        'bar-baz',
        class FooBarBaz extends HTMLElement {}
      );`,
      options: [
        {
          prefix: ['Foo']
        }
      ]
    }
  ],

  invalid: [
    {
      code: `customElements.define('foo-bar', CrazyElement)`,
      errors: [
        {
          messageId: 'nameMismatch',
          data: {
            expected: 'crazy-element',
            actual: 'foo-bar'
          },
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `customElements.define(
        'foo-bar',
        class CrazyElement extends HTMLElement {}
      )`,
      errors: [
        {
          messageId: 'nameMismatch',
          data: {
            expected: 'crazy-element',
            actual: 'foo-bar'
          },
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `customElements.define('foo-bar', IceCreamBaz)`,
      options: [
        {
          suffix: ['Baz']
        }
      ],
      errors: [
        {
          messageId: 'nameMismatch',
          data: {
            expected: 'ice-cream',
            actual: 'foo-bar'
          },
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `customElements.define('foo-bar', BazIceCream)`,
      options: [
        {
          prefix: ['Baz']
        }
      ],
      errors: [
        {
          messageId: 'nameMismatch',
          data: {
            expected: 'ice-cream',
            actual: 'foo-bar'
          },
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `customElements.define('foo-bar', BazIceCreamBoz)`,
      options: [
        {
          prefix: ['Baz'],
          suffix: ['Boz']
        }
      ],
      errors: [
        {
          messageId: 'nameMismatch',
          data: {
            expected: 'ice-cream',
            actual: 'foo-bar'
          },
          line: 1,
          column: 1
        }
      ]
    }
  ]
});
