/**
 * @fileoverview Disallows closed shadow roots
 * @author James Garbutt <https://github.com/43081j>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-closed-shadow-root.js';
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

ruleTester.run('no-closed-shadow-root', rule, {
  valid: [
    {code: `this.attachShadow({ mode: 'open' })`},
    {code: `this.attachShadow({ 'mode': 'open' })`},
    {code: `node.attachShadow()`},
    {code: `foo.bar.baz.attachShadow({ mode: 'open' })`},
    {code: `this.setAttribute('mode', 'closed')`},
    {code: `this.attachShadow('closed')`}
  ],

  invalid: [
    {
      code: `this.attachShadow({ mode: 'closed' })`,
      errors: [
        {
          messageId: 'closedRoot',
          line: 1,
          column: 21
        }
      ]
    },
    {
      code: `this.attachShadow({ 'mode': 'closed' })`,
      errors: [
        {
          messageId: 'closedRoot',
          line: 1,
          column: 21
        }
      ]
    },
    {
      code: `foo.bar.baz.attachShadow({ mode: 'closed' })`,
      errors: [
        {
          messageId: 'closedRoot',
          line: 1,
          column: 28
        }
      ]
    },
    {
      code: `function f(n) { n.attachShadow({ mode: 'closed' }); }`,
      errors: [
        {
          messageId: 'closedRoot',
          line: 1,
          column: 34
        }
      ]
    },
    {
      code: `this.attachShadow({
        'unknown': 5,
        'mode': 'closed',
        'anotherunknown': 6
      })`,
      errors: [
        {
          messageId: 'closedRoot',
          line: 3,
          column: 9
        }
      ]
    }
  ]
});
