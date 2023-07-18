/**
 * @fileoverview Disallows exports alongside custom element exports
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import rule from '../../rules/no-exports-with-element';
import {RuleTester} from 'eslint';

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015
  }
});

ruleTester.run('no-exports-with-element', rule, {
  valid: [
    'const x = 808;',
    'export class Foo {}',
    'export const x = 303;',
    'export class Foo extends HTMLElement {}',
    'class Foo extends HTMLElement {} export {Foo};',
    'export const Foo = class extends HTMLElement {}',
    `/** @customElement x-foo */
    export class Foo extends Bar {}`,
    `export class Foo extends HTMLElement {}
    export class FooEvent extends Event {}`,
    `class Foo extends HTMLElement {}
    export default Foo`,
    `export class Foo extends HTMLElement {}
    export let bar;`,
    `export class Foo extends HTMLElement {}
    export default class Bar extends Event {}`,
    `export class Foo extends HTMLElement {}
    export default Bar = class extends Event {}`,
    {
      code: 'export class Foo extends Bar {}',
      settings: {
        wc: {
          elementBaseClasses: ['Bar']
        }
      }
    }
  ],

  invalid: [
    {
      code: `
        export class Foo extends HTMLElement {}
        export const bar = 303;
      `,
      errors: [
        {
          line: 3,
          column: 28,
          messageId: 'noExports'
        }
      ]
    },
    {
      code: `
        export const bar = 303;
        export class Foo extends HTMLElement {}
      `,
      errors: [
        {
          line: 2,
          column: 28,
          messageId: 'noExports'
        }
      ]
    },
    {
      code: `
        export class Foo extends HTMLElement {}
        export class Bar extends Baz {}
      `,
      errors: [
        {
          line: 3,
          column: 16,
          messageId: 'noExports'
        }
      ]
    },
    {
      code: `
        export class Foo extends HTMLElement {}
        export class Bar {}
      `,
      errors: [
        {
          line: 3,
          column: 16,
          messageId: 'noExports'
        }
      ]
    },
    {
      code: `
        export class Foo extends HTMLElement {}
        export const Bar = class {};
      `,
      errors: [
        {
          line: 3,
          column: 28,
          messageId: 'noExports'
        }
      ]
    },
    {
      code: `
        export class Foo extends HTMLElement {}
        export function bar() {}
      `,
      errors: [
        {
          line: 3,
          column: 16,
          messageId: 'noExports'
        }
      ]
    },
    {
      code: `
        export class Foo extends HTMLElement {}
        const x = 5;
        export {x};
      `,
      errors: [
        {
          line: 3,
          column: 15,
          messageId: 'noExports'
        }
      ]
    },
    {
      code: `
        export class Foo extends HTMLElement {}
        let bar;
        export default bar = 303;
      `,
      errors: [
        {
          line: 4,
          column: 30,
          messageId: 'noExports'
        }
      ]
    },
    {
      code: `
        export class Foo extends HTMLElement {}
        const bar = 303;
        export default bar;
      `,
      errors: [
        {
          line: 3,
          column: 15,
          messageId: 'noExports'
        }
      ]
    }
  ]
});
