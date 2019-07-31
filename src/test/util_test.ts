import * as util from '../util';
import {parse} from 'espree';
import {expect} from 'chai';
import * as ESTree from 'estree';
import {AST, Rule} from 'eslint';

const parseExpr = (expr: string): ESTree.Node => {
  const parsed = parse(expr, {
    loc: true,
    ecmaVersion: 6,
    sourceType: 'module'
  });
  return (parsed as ESTree.Program).body[0];
};

const mockContext = ({
  settings: {}
} as unknown) as Rule.RuleContext;

describe('util', () => {
  describe('isCustomElement', () => {
    it('should parse direct sub classes of HTMLElement', () => {
      const doc = parseExpr(`class Foo extends HTMLElement {}`);
      expect(util.isCustomElement(mockContext, doc)).to.equal(true);
    });

    it('should parse direct sub classes of custom bases', () => {
      const doc = parseExpr(`class Foo extends MyBase {}`);
      mockContext.settings = {
        wc: {
          elementBaseClasses: ['MyBase']
        }
      };
      expect(util.isCustomElement(mockContext, doc)).to.equal(true);
    });

    it('should parse annotated classes', () => {
      const jsdoc: AST.Token = {
        type: 'String',
        value: '* @customElement *',
        range: [0, 0],
        loc: {
          start: {line: 0, column: 0},
          end: {line: 0, column: 0}
        }
      };
      const doc = parseExpr(`/** @customElement **/
        class Foo extends Bar {}`);
      expect(util.isCustomElement(mockContext, doc, jsdoc)).to.equal(true);
    });

    it('should be false for normal classes', () => {
      let doc = parseExpr(`class Foo extends Bar {}`);
      expect(util.isCustomElement(mockContext, doc)).to.equal(false);

      doc = parseExpr(`class Foo {}`);
      expect(util.isCustomElement(mockContext, doc)).to.equal(false);
    });
  });
});
