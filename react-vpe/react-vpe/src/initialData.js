import { mkNode, mkLayout } from './helpers';

// ─── 初期ノード ────────────────────────────────────────────────────────────────
export const INIT_NODES = [
  mkNode('state',   50,  50,  { name: 'count',        initialValue: '0',  valueType: 'number' }),
  mkNode('state',   50,  230, { name: 'text',          initialValue: "''" , valueType: 'string' }),
  mkNode('fn',      50,  410, { name: 'handleClick' }),
  mkNode('element', 360, 80,  { tag: 'button', className: 'px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors' }),
  mkNode('element', 360, 260, { tag: 'input',  className: 'border border-gray-300 rounded-lg px-3 py-2 w-full' }),
  mkNode('output',  680, 170, { name: 'output' }),
];

// ─── 初期レイアウトツリー ──────────────────────────────────────────────────────
export function makeInitLayout() {
  const cont = mkLayout('container');
  const row  = mkLayout('row');
  const col1 = mkLayout('col');
  const col2 = mkLayout('col');
  const h1   = mkLayout('heading');
  const para = mkLayout('text');
  const card = mkLayout('card');
  const btn  = mkLayout('btn');
  const inp  = mkLayout('input');

  col1.children  = [h1, para];
  card.children  = [btn, inp];
  col2.children  = [card];
  row.children   = [col1, col2];
  cont.children  = [row];

  return [cont];
}
