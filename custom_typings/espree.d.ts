declare module 'espree' {
  export function parse(code: string, opts?: Record<string, unknown>): import('estree').Node;
}
