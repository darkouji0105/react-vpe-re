import { NODE_W, HEADER_H, PORT_H, NODE_META, LAYOUT_META } from './constants';

// ─── 文字列ユーティリティ ──────────────────────────────────────────────────────
export function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }

// ─── UID生成 ──────────────────────────────────────────────────────────────────
let _uid = 200;
export const uid  = () => `n${++_uid}`;
export const luid = () => `l${++_uid}`;

// ─── ポート定義生成 ────────────────────────────────────────────────────────────
export function makePorts(id, type) {
  const I = (n, t) => ({ id: `${id}_i_${n}`, name: n, type: t, dir: 'in'  });
  const O = (n, t) => ({ id: `${id}_o_${n}`, name: n, type: t, dir: 'out' });
  return ({
    state:     { inputs: [I('setter', 'fn')],                                     outputs: [O('value', 'any'), O('setValue', 'fn')] },
    props:     { inputs: [],                                                       outputs: [O('props', 'object')] },
    effect:    { inputs: [I('dep1', 'any'), I('dep2', 'any'), I('dep3', 'any')],   outputs: [] },
    component: { inputs: [I('children', 'node'), I('props', 'object')],            outputs: [O('jsx', 'node')] },
    hook:      { inputs: [I('arg', 'any')],                                        outputs: [O('result', 'any')] },
    element:   { inputs: [I('onClick', 'fn'), I('value', 'any'), I('children', 'node')], outputs: [O('jsx', 'node')] },
    fn:        { inputs: [I('arg', 'any')],                                        outputs: [O('handler', 'fn')] },
    output:    { inputs: [I('jsx1', 'node'), I('jsx2', 'node'), I('jsx3', 'node'), I('jsx4', 'node')], outputs: [] },
  })[type] || { inputs: [], outputs: [] };
}

// ─── ノード生成 ────────────────────────────────────────────────────────────────
export function mkNode(type, x, y, props = {}) {
  const id = uid();
  return { id, type, x, y, label: props.name || NODE_META[type]?.label || type, ports: makePorts(id, type), props };
}

// ─── レイアウト要素生成 ────────────────────────────────────────────────────────
export function mkLayout(ltype) {
  return { id: luid(), ltype, children: [], props: { ...LAYOUT_META[ltype]?.defaultProps } };
}

// ─── ポート座標計算 ────────────────────────────────────────────────────────────
export function portPos(node, portId) {
  const all = [...node.ports.inputs, ...node.ports.outputs];
  const port = all.find(p => p.id === portId);
  if (!port) return { x: 0, y: 0 };
  const isOut = port.dir === 'out';
  const list  = isOut ? node.ports.outputs : node.ports.inputs;
  const idx   = list.findIndex(p => p.id === portId);
  return { x: isOut ? node.x + NODE_W : node.x, y: node.y + HEADER_H + idx * PORT_H + PORT_H / 2 };
}

// ─── ベジェ曲線パス生成 ────────────────────────────────────────────────────────
export function bezier(x1, y1, x2, y2) {
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
}

// ─── ポートカラー ──────────────────────────────────────────────────────────────
export function portColor(t) {
  return ({ fn: '#ec4899', str: '#f59e0b', node: '#fb923c', object: '#6366f1', any: '#475569' })[t] || '#475569';
}

// ─── ツリーヘルパー ────────────────────────────────────────────────────────────
export function findInTree(tree, id) {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) { const f = findInTree(n.children, id); if (f) return f; }
  }
  return null;
}

export function updateInTree(tree, id, fn) {
  return tree.map(n => {
    if (n.id === id) return fn(n);
    if (n.children) return { ...n, children: updateInTree(n.children, id, fn) };
    return n;
  });
}

export function removeFromTree(tree, id) {
  return tree.filter(n => n.id !== id).map(n =>
    n.children ? { ...n, children: removeFromTree(n.children, id) } : n
  );
}

export function flattenTree(tree, d = 0) {
  return tree.flatMap(n => [
    { ...n, _d: d },
    ...(n.children ? flattenTree(n.children, d + 1) : [])
  ]);
}

// ─── シンタックスハイライト ────────────────────────────────────────────────────
export function hlLine(l) {
  return l
    .replace(/\b(import|export|default|const|let|var|function|return|if|else|async|await)\b/g,
      '<span style="color:#a78bfa">$1</span>')
    .replace(/\b(useState|useEffect|useRef|useMemo|useCallback)\b/g,
      '<span style="color:#34d399">$1</span>')
    .replace(/(\/\/.*)/g, '<span style="color:#3d4d5a">$1</span>')
    .replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color:#fbbf24">$1</span>')
    .replace(/(&lt;\/?[\w]+)/g, s => `<span style="color:#fb923c">${s}</span>`);
}
