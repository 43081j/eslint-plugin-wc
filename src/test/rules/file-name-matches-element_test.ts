/**
 * @fileoverview Enforces that the filename of a file containing an element
 * matches that of its class name
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import rule from '../../rules/file-name-matches-element';
import {RuleTester} from 'eslint';

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015
  }
});

ruleTester.run('file-name-matches-element', rule, {
  valid: [
    {
      code: 'const x = 808;',
      filename: 'foo.js'
    },
    {
      code: 'class UnrelatedClass {}',
      filename: 'foo.js'
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: '<input>'
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: '<text>'
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: ''
    },
    {
      code: `const x = class extends HTMLElement {};`,
      filename: 'foo.js'
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'suspicious.js',
      options: [
        {
          transform: []
        }
      ]
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'some-element.js'
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'someElement.js'
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'SomeElement.js',
      options: [
        {
          transform: ['pascal']
        }
      ]
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'SomeElement.js',
      options: [
        {
          transform: 'pascal'
        }
      ]
    },
    {
      code: 'class FooSomeElement extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          prefix: 'Foo'
        }
      ]
    },
    {
      code: 'class FooSomeElement extends HTMLElement {}',
      filename: 'fooSomeElement.js',
      options: [
        {
          prefix: 'Foo'
        }
      ]
    },
    {
      code: 'class FooSomeElement extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          prefix: ['Foo']
        }
      ]
    },
    {
      code: 'class SomeElementFoo extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          suffix: 'Foo'
        }
      ]
    },
    {
      code: 'class SomeElementFoo extends HTMLElement {}',
      filename: 'someElementFoo.js',
      options: [
        {
          suffix: 'Foo'
        }
      ]
    },
    {
      code: 'class SomeElementFoo extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          suffix: ['Foo']
        }
      ]
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'src/foo/someElement.js',
      options: [
        {
          matchDirectory: true
        }
      ]
    },
    {
      code: 'class BarSomeElement extends HTMLElement {}',
      filename: 'foo/bar/someElement.js',
      options: [
        {
          matchDirectory: true
        }
      ]
    },
    {
      code: 'class FooBarSomeElement extends HTMLElement {}',
      filename: 'foo/bar/someElement.js',
      options: [
        {
          matchDirectory: true
        }
      ]
    },
    {
      code: 'class FooSomeElementBar extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          prefix: 'Foo',
          suffix: 'Bar'
        }
      ]
    },
    {
      code: 'class SomeElementBar extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          prefix: 'Foo',
          suffix: 'Bar'
        }
      ]
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          prefix: 'Foo',
          suffix: 'Bar'
        }
      ]
    },
    {
      code: 'class FooSomeElement extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          prefix: 'Foo',
          suffix: 'Bar'
        }
      ]
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'SomeElement.js',
      options: [
        {
          transform: 'none'
        }
      ]
    }
  ],

  invalid: [
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'gibberish.js',
      errors: [
        {
          line: 1,
          column: 7,
          messageId: 'fileMismatch',
          data: {
            expected: 'some-element" or "someElement',
            actual: 'gibberish'
          }
        }
      ]
    },
    {
      code: 'class SomeElement extends HTMLElement {}',
      filename: 'someElement.js',
      options: [
        {
          transform: 'snake'
        }
      ],
      errors: [
        {
          line: 1,
          column: 7,
          messageId: 'fileMismatch',
          data: {
            expected: 'some_element',
            actual: 'someElement'
          }
        }
      ]
    },
    {
      code: 'class FooSomeElement extends HTMLElement {}',
      filename: 'barSomeElement.js',
      options: [
        {
          prefix: 'Foo'
        }
      ],
      errors: [
        {
          line: 1,
          column: 7,
          messageId: 'fileMismatch',
          data: {
            expected:
              'foo-some-element" or "fooSomeElement" or ' +
              '"some-element" or "someElement',
            actual: 'barSomeElement'
          }
        }
      ]
    },
    {
      code: 'class SomeElementFoo extends HTMLElement {}',
      filename: 'someElementBar.js',
      options: [
        {
          suffix: 'Foo'
        }
      ],
      errors: [
        {
          line: 1,
          column: 7,
          messageId: 'fileMismatch',
          data: {
            expected:
              'some-element-foo" or "someElementFoo" or ' +
              '"some-element" or "someElement',
            actual: 'someElementBar'
          }
        }
      ]
    },
    {
      code: 'class BarSomeElement extends HTMLElement {}',
      filename: 'foo/someElement.js',
      options: [
        {
          matchDirectory: true
        }
      ],
      errors: [
        {
          line: 1,
          column: 7,
          messageId: 'fileMismatch',
          data: {
            expected: 'bar-some-element" or "barSomeElement',
            actual: 'someElement'
          }
        }
      ]
    }
  ]
});
