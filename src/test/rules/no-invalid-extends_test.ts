/**
 * @fileoverview Disallows invalid class inheritance for custom elements
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import {fileURLToPath} from 'node:url';
import rule from '../../rules/no-invalid-extends.js';
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

ruleTester.run('no-invalid-extends', rule, {
  valid: [
    'const x = 808;',
    'class Foo {}',
    'class Foo extends HTMLElement {}',
    'someOtherCallExpr()',
    'customElements.define(nonsense)',
    `customElements.define('a', unresolveable)`,
    `customElements.define('a', unresolveable, {extends: 'div'})`,
    `const x = 303; customElements.define('a', x);`,
    {
      code: `class A extends HTMLElement {}
        customElements.define('a', A);`
    },
    {
      code: `class A {}
        customElements.define('a', A);`
    },
    {
      code: `/** @customElement */
        class A extends Complex(Nonsense()) {}
        customElements.define('a', A);`
    },
    {
      code: `customElements.define('a', class A extends HTMLElement {})`
    },
    {
      code: `customElements.define(
        'a',
        /** customElement */ class A extends HTMLDivElement {},
        {extends: 'div'}
      )`
    },
    {
      code: `customElements.define(
        'a',
        /** customElement */ class A extends HTMLDivElement {},
        {extends: \`div\`}
      )`
    },
    {
      code: `/** @customElement */
        class A extends HTMLDivElement {}
        customElements.define('a', A, {extends: 'div'});`
    },
    {
      code: `/** @customElement */
        class A extends HTMLDivElement {}
        customElements.define('a', A, {'extends': 'div'});`
    },
    {
      code: `
        /**
         * @customElement
         */
        class A extends SomeElement {}
        customElements.define('a', A);
      `,
      options: [
        {
          allowedSuperNames: ['SomeElement']
        }
      ]
    },
    {
      code: `class A extends SomeElement {}
      customElements.define('a', A);`,
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement']
        }
      },
      options: [
        {
          allowedSuperNames: ['SomeElement']
        }
      ]
    },
    {
      code: `class A extends SomeElement {}
      customElements.define('a', A);`,
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement', 'SomeOtherElement']
        }
      },
      options: [
        {
          allowedSuperNames: ['SomeElement', 'SomeOtherElement']
        }
      ]
    },
    {
      code: `@customElement('x-foo')
      class A extends SomeElement {}`,
      parser
    },
    {
      code: `class A extends SomeElement {}
      customElements.define('a', A);`,
      settings: {
        wc: {
          elementBaseClasses: ['SomeElement']
        }
      }
    }
  ],

  invalid: [
    {
      code: `
        /** @customElement */
        class Foo {}
        customElements.define('foo', Foo);
      `,
      errors: [
        {
          messageId: 'invalid',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement'
          }
        }
      ]
    },
    {
      code: `
        /** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo, {extends: 'nonsense'});
      `,
      errors: [
        {
          messageId: 'unknownExtends',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement',
            superName: 'Bar',
            actualExtends: 'nonsense'
          }
        }
      ]
    },
    {
      code: `
        /** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo, {extends: 'nonsense'});
      `,
      errors: [
        {
          messageId: 'unknownExtends',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement',
            superName: 'Bar',
            actualExtends: 'nonsense'
          }
        }
      ]
    },
    {
      code: `
        /** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo, {extends: \`nonsense\`});
      `,
      errors: [
        {
          messageId: 'unknownExtends',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement',
            superName: 'Bar',
            actualExtends: 'nonsense'
          }
        }
      ]
    },
    {
      code: `
        /** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo);
      `,
      errors: [
        {
          messageId: 'invalid',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement'
          }
        }
      ]
    },
    {
      code: `
        /** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo);
      `,
      options: [
        {
          allowedSuperNames: ['SomeElement']
        }
      ],
      errors: [
        {
          messageId: 'invalid',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'SomeElement or HTMLElement'
          }
        }
      ]
    },
    {
      code: `
        /** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo);
      `,
      options: [
        {
          allowedSuperNames: ['SomeElement', 'SomeOtherElement']
        }
      ],
      errors: [
        {
          messageId: 'invalid',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'SomeElement, SomeOtherElement, or HTMLElement'
          }
        }
      ]
    },
    {
      code: `
        /** @customElement */
        class Foo extends HTMLDivElement {}
        customElements.define('foo', Foo);
      `,
      errors: [
        {
          messageId: 'invalidOrMissingExtends',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement',
            expectedExtends: 'div'
          }
        }
      ]
    },
    {
      code: `
        /** @customElement */
        class Foo extends HTMLDivElement {}
        customElements.define('foo', Foo, {extends: 'span'});
      `,
      errors: [
        {
          messageId: 'invalidExtends',
          line: 4,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLSpanElement',
            superName: 'HTMLDivElement',
            actualExtends: 'span',
            expectedExtends: 'div'
          }
        }
      ]
    },
    {
      code: `/** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo, unresolveable);`,
      errors: [
        {
          messageId: 'invalid',
          line: 3,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement'
          }
        }
      ]
    },
    {
      code: `/** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo, {});`,
      errors: [
        {
          messageId: 'invalid',
          line: 3,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement'
          }
        }
      ]
    },
    {
      code: `/** @customElement */
        class Foo extends Bar {}
        customElements.define('foo', Foo, {extends: unresolveable});`,
      errors: [
        {
          messageId: 'invalid',
          line: 3,
          column: 9,
          data: {
            allowedSuperNames: 'HTMLElement'
          }
        }
      ]
    }
  ]
});
