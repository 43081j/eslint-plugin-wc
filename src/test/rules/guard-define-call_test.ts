/**
 * @fileoverview Require `define(...)` calls to include an `if` statement
 * @author James Garbutt <https://github.com/43081j>
 * @author Keith Cirkel <https://github.com/keithamus>
 */

import rule from '../../rules/guard-define-call.js';
import {RuleTester} from 'eslint';
import {parser} from 'typescript-eslint';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2015
    }
  }
});

ruleTester.run('guard-define-call', rule, {
  valid: [
    'const x = 808;',
    'someRandomCallExpression();',
    'another.callExpression();',
    `if (!customElements.get('foo')) {
      customElements.define('foo', Foo);
    }`,
    `if (!globalThis.customElements.get('foo')) {
      globalThis.customElements.define('foo', Foo);
    }`,
    `if (!window.customElements.get('foo')) {
      window.customElements.define('foo', Foo);
    }`,
    `if (!!!customElements.get('foo')) {
      customElements.define('foo', Foo);
    }`,
    `if (customElements.get('foo') === undefined) {
      customElements.define('foo', Foo);
    }`,
    `try {
      customElements.define('foo', Foo);
    } catch (err) {}`,
    {
      code: `try {
        customElements.define('foo', Foo);
      } catch {}`,
      languageOptions: {parser}
    },
    `if (window.customElements && !window.customElements.get('foo')) {
      window.customElements.define('foo', Foo);
    }`
  ],

  invalid: [
    {
      code: `customElements.define('foo', Foo);`,
      errors: [
        {
          messageId: 'guard',
          line: 1,
          column: 1
        }
      ]
    },
    {
      code: `if (customElements.get('foo')) {
        customElements.define('foo', Foo);
      }`,
      errors: [
        {
          messageId: 'guard',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `if (someUnrelatedCondition) {
        customElements.define('foo', Foo);
      }`,
      errors: [
        {
          messageId: 'guard',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `if (someUnrelatedCondition) {
        customElements.get('foo'); // here to trick you
        customElements.define('foo', Foo);
      }`,
      errors: [
        {
          messageId: 'guard',
          line: 3,
          column: 9
        }
      ]
    },
    {
      code: `if (foo && customElements.get('foo')) {
        customElements.define('foo', Foo);
      }`,
      errors: [
        {
          messageId: 'guard',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `if (!!customElements.get('foo')) {
        customElements.define('foo', Foo);
      }`,
      errors: [
        {
          messageId: 'guard',
          line: 2,
          column: 9
        }
      ]
    },
    {
      code: `try {} catch (err) {
        customElements.define('foo', Foo);
      }`,
      errors: [
        {
          messageId: 'guard',
          line: 2,
          column: 9
        }
      ]
    }
  ]
});
