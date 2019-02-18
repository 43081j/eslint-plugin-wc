import * as util from '../util';
import { parse } from 'espree';
import { expect } from 'chai';
import * as ESTree from 'estree';

const parseExpr = (expr: string): ESTree.Node => {
  const parsed = parse(expr, {
    loc: true,
    ecmaVersion: 6,
    sourceType: 'module'
  });
  return (parsed as ESTree.Program).body[0];
};

describe('util', () => {
  describe('isCustomElement', () => {
    const doc = parseExpr(`class Foo extends HTMLElement {
    }`);
    expect(util.isCustomElement(doc)).to.equal(true);
  });
});
