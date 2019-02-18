import * as ESTree from 'estree';
import {AST} from 'eslint';

/**
 * Determines if a node is an element class or not.
 *
 * @param {ESTree.Node} node Node to test
 * @param {AST.Token=} jsdoc JSDoc to parse
 * @return {boolean}
 */
export function isCustomElement(
  node: ESTree.Node,
  jsdoc?: AST.Token | null
): node is ESTree.Class {
  return (
    (node.type === 'ClassExpression' || node.type === 'ClassDeclaration') &&
    ((node.superClass &&
      node.superClass.type === 'Identifier' &&
      node.superClass.name === 'HTMLElement') ||
      (jsdoc !== undefined &&
        jsdoc !== null &&
        jsdoc.value.includes('@customElement')))
  );
}

/**
 * Determines if a node is an extension of HTMLElement class or not.
 *
 * @param {ESTree.Node} node Node to test
 * @return {boolean}
 */
export function isNativeCustomElement(node: ESTree.Node): node is ESTree.Class {
  return (
    (node.type === 'ClassExpression' || node.type === 'ClassDeclaration') &&
    node.superClass !== undefined &&
    node.superClass !== null &&
    node.superClass.type === 'Identifier' &&
    node.superClass.name === 'HTMLElement'
  );
}

const levenshteinMin = (
  d0: number,
  d1: number,
  d2: number,
  bx: number,
  ay: number
): number => {
  return d0 < d1 || d2 < d1
    ? d0 > d2
      ? d2 + 1
      : d0 + 1
    : bx === ay
    ? d1
    : d1 + 1;
};

/**
 * Calculate the levenshtein distance for a given pair of strings
 *
 * @param {string} a First string to compare
 * @param {string} b Second string to compare
 * @return {number} Distance between two strings
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  let la = a.length;
  let lb = b.length;
  let offset = 0;

  while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
    la--;
    lb--;
  }

  while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
    offset++;
  }

  la -= offset;
  lb -= offset;

  if (la === 0 || lb < 3) {
    return lb;
  }

  let x = 0;
  let y;
  let d0;
  let d1;
  let d2;
  let d3;
  let dd = 0;
  let dy;
  let ay;
  let bx0;
  let bx1;
  let bx2;
  let bx3;

  const vector = [];

  for (y = 0; y < la; y++) {
    vector.push(y + 1);
    vector.push(a.charCodeAt(offset + y));
  }

  const len = vector.length - 1;

  for (; x < lb - 3; ) {
    bx0 = b.charCodeAt(offset + (d0 = x));
    bx1 = b.charCodeAt(offset + (d1 = x + 1));
    bx2 = b.charCodeAt(offset + (d2 = x + 2));
    bx3 = b.charCodeAt(offset + (d3 = x + 3));
    dd = x += 4;
    for (y = 0; y < len; y += 2) {
      dy = vector[y];
      ay = vector[y + 1];
      d0 = levenshteinMin(dy, d0, d1, bx0, ay);
      d1 = levenshteinMin(d0, d1, d2, bx1, ay);
      d2 = levenshteinMin(d1, d2, d3, bx2, ay);
      dd = levenshteinMin(d2, d3, dd, bx3, ay);
      vector[y] = dd;
      d3 = d2;
      d2 = d1;
      d1 = d0;
      d0 = dy;
    }
  }

  for (; x < lb; ) {
    bx0 = b.charCodeAt(offset + (d0 = x));
    dd = ++x;
    for (y = 0; y < len; y += 2) {
      dy = vector[y];
      vector[y] = dd = levenshteinMin(dy, d0, dd, bx0, vector[y + 1]);
      d0 = dy;
    }
  }

  return dd;
}
