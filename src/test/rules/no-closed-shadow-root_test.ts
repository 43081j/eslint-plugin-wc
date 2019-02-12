/**
 * @fileoverview Disallows closed shadow roots
 * @author James Garbutt <htttps://github.com/43081j>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../rules/no-closed-shadow-root';
import {RuleTester} from 'eslint';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module'
  }
});

ruleTester.run('no-closed-shadow-root', rule, {
  valid: [
    {code: `this.attachShadow({ mode: 'open' })`},
    {code: `this.attachShadow({ 'mode': 'open' })`},
    {code: `node.attachShadow()`},
    {code: `foo.bar.baz.attachShadow({ mode: 'open' })`}
  ],

  invalid: [
    {
      code: `this.attachShadow({ mode: 'closed' })`,
      errors: [
        {
          message: 'Closed shadow roots are rarely needed and generally ' +
            'not recommended',
          line: 1,
          column: 21
        }
      ]
    },
    {
      code: `this.attachShadow({ 'mode': 'closed' })`,
      errors: [
        {
          message: 'Closed shadow roots are rarely needed and generally ' +
            'not recommended',
          line: 1,
          column: 21
        }
      ]
    },
    {
      code: `foo.bar.baz.attachShadow({ mode: 'closed' })`,
      errors: [
        {
          message: 'Closed shadow roots are rarely needed and generally ' +
            'not recommended',
          line: 1,
          column: 28
        }
      ]
    },
    {
      code: `function f(n) { n.attachShadow({ mode: 'closed' }); }`,
      errors: [
        {
          message: 'Closed shadow roots are rarely needed and generally ' +
            'not recommended',
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
          message: 'Closed shadow roots are rarely needed and generally ' +
            'not recommended',
          line: 3,
          column: 9
        }
      ]
    }
  ]
});
