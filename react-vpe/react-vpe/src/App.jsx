import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { NODE_W, HEADER_H, PORT_H, PORT_R, NODE_META, LAYOUT_META } from './constants';
import { uid, mkNode, mkLayout, portPos, bezier, portColor, findInTree, updateInTree, removeFromTree, flattenTree } from './helpers';
import { genCode } from './codeGen';
import { INIT_NODES, makeInitLayout } from './initialData';
import { SIDEBAR_LOGIC } from './templates';

import TutorialPanel    from './components/TutorialPanel';
import Sidebar          from './components/Sidebar';
import PropertiesPanel  from './components/PropertiesPanel';
import CodePanel        from './components/CodePanel';
import LivePreview      from './components/LivePreview';
import LayoutNodeView   from './components/LayoutNodeView';
import { TBtn }         from './components/atoms';

// ─── メインアプリ ──────────────────────────────────────────────────────────────
export default function App() {
  const [mode,     setMode]  = useState('logic');
  const [nodes,    setNodes] = useState(INIT_NODES);
  const [edges,    setEdges] = useState([]);
  const [layoutTree, setLT]  = useState(makeInitLayout);
  const [selId,    setSelId] = useState(null);
  const [drag,     setDrag]  = useState(null);
  const [conn,     setConn]  = useState(null);
  const [mouse,    setMouse] = useState({ x: 0, y: 0 });
  const [pan,      setPan]   = useState({ x: 100, y: 50 });
  const [panBase,  setPBase] = useState(null);
  const [zoom,     setZoom]  = useState(1);
  const [tab,      setTab]   = useState('nodes');
  const [showCode, setShowCode] = useState(false);
  const [showPrev, setShowPrev] = useState(true);
  const [bp,       setBP]    = useState('desktop');
  const [tutorial, setTutorial] = useState(null);

  const cvs = useRef(null);

  const selNode   = nodes.find(n => n.id === selId);
  const selLayout = selId ? findInTree(layoutTree, selId) : null;

  // ── 座標変換 ────────────────────────────────────────────────────────────────
  const toCanvas = useCallback((cx, cy) => {
    const r = cvs.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: (cx - r.left - pan.x) / zoom, y: (cy - r.top - pan.y) / zoom };
  }, [pan, zoom]);

  // ── キャンバス操作 ───────────────────────────────────────────────────────────
  const onCvsDn = useCallback(e => {
    if (e.target === cvs.current || e.target.tagName === 'svg' || e.target.tagName === 'SVG') {
      setSelId(null);
      if (e.button === 0) setPBase({ mx: e.clientX - pan.x, my: e.clientY - pan.y });
    }
  }, [pan]);

  const onCvsMv = useCallback(e => {
    if (panBase) setPan({ x: e.clientX - panBase.mx, y: e.clientY - panBase.my });
    if (drag) {
      const p = toCanvas(e.clientX, e.clientY);
      setNodes(prev => prev.map(n => n.id === drag.nodeId ? { ...n, x: p.x - drag.ox, y: p.y - drag.oy } : n));
    }
    if (conn) setMouse(toCanvas(e.clientX, e.clientY));
  }, [panBase, drag, conn, toCanvas]);

  const onCvsUp = useCallback(() => { setPBase(null); setDrag(null); setConn(null); }, []);

  // ── ノード操作 ───────────────────────────────────────────────────────────────
  const onNodeDn = useCallback((e, nid) => {
    e.stopPropagation();
    setSelId(nid);
    const node = nodes.find(n => n.id === nid);
    const p = toCanvas(e.clientX, e.clientY);
    setDrag({ nodeId: nid, ox: p.x - node.x, oy: p.y - node.y });
  }, [nodes, toCanvas]);

  // ── ポート接続 ───────────────────────────────────────────────────────────────
  const onOutDn = useCallback((e, nid, pid) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nid);
    const pos = portPos(node, pid);
    setConn({ src: nid, srcPort: pid, ...pos });
    setMouse(pos);
  }, [nodes]);

  const onInUp = useCallback((e, nid, pid) => {
    e.stopPropagation();
    if (conn && conn.src !== nid) {
      setEdges(prev => [
        ...prev.filter(ed => !(ed.tgt === nid && ed.tgtPort === pid)),
        { id: `e${Date.now()}`, src: conn.src, srcPort: conn.srcPort, tgt: nid, tgtPort: pid },
      ]);
    }
    setConn(null);
  }, [conn]);

  // ── ドロップ ─────────────────────────────────────────────────────────────────
  const onDropCanvas = useCallback(e => {
    e.preventDefault();
    const tid = e.dataTransfer.getData('tid');
    const tmpl = SIDEBAR_LOGIC.find(t => t.id === tid);
    if (!tmpl) return;
    const p = toCanvas(e.clientX, e.clientY);
    setNodes(prev => [...prev, mkNode(tmpl.type, p.x - NODE_W / 2, p.y - 22, tmpl.props)]);
  }, [toCanvas]);

  const onDropLayout = useCallback(e => {
    e.preventDefault();
    const lt = e.dataTransfer.getData('ltype');
    if (!lt) return;
    const n = mkLayout(lt);
    setLT(prev => [...prev, n]);
    setSelId(n.id);
  }, []);

  // ── プロパティ更新 ────────────────────────────────────────────────────────────
  const updProp = useCallback((k, v) => {
    if (!selId) return;
    setNodes(prev => prev.map(n => {
      if (n.id !== selId) return n;
      return { ...n, props: { ...n.props, [k]: v }, label: k === 'name' ? (v || n.label) : n.label };
    }));
  }, [selId]);

  const updLP = useCallback((key, val) => {
    if (!selId) return;
    setLT(prev => updateInTree(prev, selId, n => ({ ...n, props: { ...n.props, [key]: val } })));
  }, [selId]);

  // ── 削除 ─────────────────────────────────────────────────────────────────────
  const delNode = useCallback(() => {
    if (!selId) return;
    setNodes(p => p.filter(n => n.id !== selId));
    setEdges(p => p.filter(e => e.src !== selId && e.tgt !== selId));
    setSelId(null);
  }, [selId]);

  const delLayout = useCallback(() => {
    if (!selId) return;
    setLT(p => removeFromTree(p, selId));
    setSelId(null);
  }, [selId]);

  const delEdge = useCallback(eid => setEdges(p => p.filter(e => e.id !== eid)), []);

  // ── ホイールズーム ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = cvs.current;
    if (!el) return;
    const h = e => {
      e.preventDefault();
      setZoom(z => Math.min(2.5, Math.max(0.2, z * (e.deltaY > 0 ? .92 : 1.08))));
    };
    el.addEventListener('wheel', h, { passive: false });
    return () => el.removeEventListener('wheel', h);
  }, []);

  // ── キーボード削除 ────────────────────────────────────────────────────────────
  useEffect(() => {
    const h = e => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selId &&
        !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        mode === 'layout' ? delLayout() : delNode();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selId, mode, delNode, delLayout]);

  // ── モード切替時リセット ──────────────────────────────────────────────────────
  useEffect(() => {
    setTab(mode === 'logic' ? 'nodes' : 'elements');
    setSelId(null);
  }, [mode]);

  // ── メモ計算 ─────────────────────────────────────────────────────────────────
  const edgePaths = useMemo(() => edges.map(ed => {
    const sn = nodes.find(n => n.id === ed.src);
    const tn = nodes.find(n => n.id === ed.tgt);
    if (!sn || !tn) return null;
    const sp = portPos(sn, ed.srcPort);
    const tp = portPos(tn, ed.tgtPort);
    return { id: ed.id, d: bezier(sp.x, sp.y, tp.x, tp.y), color: NODE_META[sn.type]?.color || '#888' };
  }).filter(Boolean), [edges, nodes]);

  const liveEdge = useMemo(() => {
    if (!conn) return null;
    const sn = nodes.find(n => n.id === conn.src);
    if (!sn) return null;
    const sp = portPos(sn, conn.srcPort);
    return bezier(sp.x, sp.y, mouse.x, mouse.y);
  }, [conn, mouse, nodes]);

  const code = useMemo(() => genCode(nodes, edges, layoutTree), [nodes, edges, layoutTree]);

  // 出力ノードの接続状態
  const outputNode      = nodes.find(n => n.type === 'output');
  const outputConnected = outputNode && edges.some(e => e.tgt === outputNode.id);

  // ─── レンダリング ────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#07070d', color: '#cbd5e1', fontFamily: '"JetBrains Mono","Fira Code",monospace', overflow: 'hidden' }}>

      {/* チュートリアルモーダル */}
      {tutorial && <TutorialPanel type={tutorial} onClose={() => setTutorial(null)} />}

      {/* サイドバー */}
      <Sidebar
        mode={mode} tab={tab} setTab={setTab}
        nodes={nodes} edges={edges} layoutTree={layoutTree}
        selId={selId} setSelId={setSelId}
        setTutorial={setTutorial}
      />

      {/* メインエリア */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ツールバー */}
        <div style={{ height: 46, background: '#0b0b15', borderBottom: '1px solid #13131e', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0 }}>
          <div style={{ padding: '3px 12px', background: '#111122', border: '1px solid #252540', borderRadius: 4, fontSize: 9, color: '#818cf8' }}>MyApp.tsx</div>
          <div style={{ width: 1, height: 22, background: '#13131e' }} />

          {/* モード切替 */}
          <div style={{ display: 'flex', background: '#080810', border: '1px solid #13131e', borderRadius: 6, padding: 2 }}>
            {[['logic', 'ロジック'], ['layout', 'レイアウト']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{ padding: '3px 14px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 8, letterSpacing: 1, background: mode === m ? '#111130' : 'transparent', color: mode === m ? '#818cf8' : '#2a2a4a', transition: 'all .15s' }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />

          {/* 出力ノードインジケーター */}
          {mode === 'logic' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 4, background: outputConnected ? '#03150a' : '#150300', border: `1px solid ${outputConnected ? '#10b98130' : '#ef444430'}`, fontSize: 8, color: outputConnected ? '#10b981' : '#ef4444' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: outputConnected ? '#10b981' : '#ef4444', boxShadow: outputConnected ? '0 0 6px #10b981' : '0 0 6px #ef4444' }} />
              {outputConnected ? '出力あり' : '出力未接続'}
            </div>
          )}

          {/* ブレークポイント切替 */}
          <div style={{ display: 'flex', gap: 2, background: '#080810', border: '1px solid #13131e', borderRadius: 5, padding: 2 }}>
            {[['desktop', '⬜', 'PC'], ['tablet', '▭', 'タブレット'], ['mobile', '▯', 'スマホ']].map(([b, ic, label]) => (
              <button
                key={b}
                onClick={() => setBP(b)}
                title={label}
                style={{ width: 28, height: 22, border: 'none', cursor: 'pointer', borderRadius: 3, fontSize: 11, background: bp === b ? '#1a1a30' : 'transparent', color: bp === b ? '#818cf8' : '#2a2a4a', transition: 'all .15s' }}
              >
                {ic}
              </button>
            ))}
          </div>

          {mode === 'logic' && (
            <TBtn label="＋ ノード追加" color="#10b981" onClick={() => {
              const n = mkNode('state', 200, 200, { name: `state${nodes.length}`, initialValue: 'null', valueType: 'any' });
              setNodes(p => [...p, n]);
            }} />
          )}
          {mode === 'layout' && (
            <TBtn label="＋ ルート追加" color="#6366f1" onClick={() => {
              const n = mkLayout('container');
              setLT(p => [...p, n]);
              setSelId(n.id);
            }} />
          )}
          <TBtn label={showPrev ? '▼ プレビュー' : '▲ プレビュー'} color="#a855f7" active={showPrev} onClick={() => setShowPrev(s => !s)} />
          <TBtn label={showCode ? '▼ コード'    : '▶ コード'}    color="#6366f1" active={showCode}  onClick={() => setShowCode(s => !s)} />
        </div>

        {/* ワークスペース */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* キャンバス */}
          <div
            ref={cvs}
            style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: panBase ? 'grabbing' : conn ? 'crosshair' : 'default', background: '#07070d' }}
            onMouseDown={onCvsDn}
            onMouseMove={onCvsMv}
            onMouseUp={onCvsUp}
            onDragOver={e => e.preventDefault()}
            onDrop={mode === 'logic' ? onDropCanvas : onDropLayout}
          >
            {/* グリッド背景 */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                <pattern id="sg4" width={20 * zoom} height={20 * zoom} x={pan.x % (20 * zoom)} y={pan.y % (20 * zoom)} patternUnits="userSpaceOnUse">
                  <path d={`M ${20 * zoom} 0 L 0 0 0 ${20 * zoom}`} fill="none" stroke="#0d0d1a" strokeWidth="0.6" />
                </pattern>
                <pattern id="bg4" width={100 * zoom} height={100 * zoom} x={pan.x % (100 * zoom)} y={pan.y % (100 * zoom)} patternUnits="userSpaceOnUse">
                  <rect width={100 * zoom} height={100 * zoom} fill="url(#sg4)" />
                  <path d={`M ${100 * zoom} 0 L 0 0 0 ${100 * zoom}`} fill="none" stroke="#111120" strokeWidth="0.9" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bg4)" />
            </svg>

            <div style={{ position: 'absolute', top: 0, left: 0, transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', width: 5000, height: 5000 }}>

              {/* ロジックモード */}
              {mode === 'logic' && <>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
                  {edgePaths.map(ep => (
                    <g key={ep.id}>
                      <path d={ep.d} stroke={ep.color} strokeWidth={2} fill="none" strokeOpacity={0.6} style={{ filter: `drop-shadow(0 0 4px ${ep.color}40)` }} />
                      <path d={ep.d} stroke="transparent" strokeWidth={14} fill="none" style={{ cursor: 'pointer', pointerEvents: 'stroke' }} onDoubleClick={() => delEdge(ep.id)} />
                    </g>
                  ))}
                  {liveEdge && <path d={liveEdge} stroke="#a855f7" strokeWidth={2} fill="none" strokeDasharray="8,4" strokeOpacity={0.9} />}
                </svg>

                {nodes.map(node => {
                  const meta   = NODE_META[node.type] || { label: node.type, color: '#555', bg: '#111', icon: '?', desc: '' };
                  const isSel  = node.id === selId;
                  const maxP   = Math.max(node.ports.inputs.length, node.ports.outputs.length);
                  const isOutput = node.type === 'output';

                  return (
                    <div
                      key={node.id}
                      onMouseDown={e => onNodeDn(e, node.id)}
                      style={{
                        position: 'absolute', left: node.x, top: node.y, width: NODE_W,
                        background: meta.bg,
                        border: `1px solid ${isSel ? meta.color : '#13131e'}`,
                        borderTop: `3px solid ${meta.color}`,
                        borderRadius: 7,
                        boxShadow: isSel
                          ? `0 0 0 1px ${meta.color}25,0 8px 26px rgba(0,0,0,.7),0 0 20px ${meta.color}18`
                          : isOutput
                          ? `0 0 12px ${meta.color}30,0 4px 18px rgba(0,0,0,.5)`
                          : '0 4px 18px rgba(0,0,0,.5)',
                        cursor: 'grab', userSelect: 'none',
                        zIndex: isSel ? 20 : isOutput ? 15 : 1,
                        transition: 'box-shadow .15s',
                      }}
                    >
                      {/* ノードヘッダー */}
                      <div style={{ height: HEADER_H, padding: '0 11px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #0d0d18' }}>
                        <span style={{ fontSize: 14, opacity: .75 }}>{meta.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: meta.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.label}</div>
                          <div style={{ fontSize: 7, color: '#1e1e36', letterSpacing: 1.5 }}>{meta.desc}</div>
                        </div>
                        <button
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => { e.stopPropagation(); setTutorial(node.type); }}
                          style={{ background: 'none', border: `1px solid ${meta.color}40`, borderRadius: 3, color: meta.color, cursor: 'pointer', fontSize: 9, padding: '1px 5px', lineHeight: 1.4, flexShrink: 0, opacity: .7 }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '.7'}
                        >?</button>
                      </div>

                      {/* ポートエリア */}
                      <div style={{ position: 'relative', height: maxP * PORT_H + 10 }}>
                        {node.ports.inputs.map((port, idx) => {
                          const connected = edges.some(e => e.tgtPort === port.id);
                          const pc = portColor(port.type);
                          return (
                            <div key={port.id} style={{ position: 'absolute', left: 0, top: idx * PORT_H + 5, height: PORT_H, display: 'flex', alignItems: 'center', paddingLeft: 18 }}>
                              <div
                                onMouseUp={e => onInUp(e, node.id, port.id)}
                                style={{ position: 'absolute', left: -PORT_R, width: PORT_R * 2, height: PORT_R * 2, borderRadius: '50%', background: connected ? pc : '#08080f', border: `2px solid ${pc}`, cursor: 'crosshair', zIndex: 3, boxShadow: connected ? `0 0 6px ${pc}60` : 'none', transition: 'all .12s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.45)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              />
                              <span style={{ fontSize: 9, color: '#475569', marginRight: 5 }}>{port.name}</span>
                              <span style={{ fontSize: 7, color: '#1e1e2e' }}>{port.type}</span>
                            </div>
                          );
                        })}
                        {node.ports.outputs.map((port, idx) => {
                          const connected = edges.some(e => e.srcPort === port.id);
                          const pc = portColor(port.type);
                          return (
                            <div key={port.id} style={{ position: 'absolute', right: 0, top: idx * PORT_H + 5, height: PORT_H, display: 'flex', alignItems: 'center', paddingRight: 18, justifyContent: 'flex-end' }}>
                              <span style={{ fontSize: 7, color: '#1e1e2e', marginRight: 5 }}>{port.type}</span>
                              <span style={{ fontSize: 9, color: '#475569' }}>{port.name}</span>
                              <div
                                onMouseDown={e => onOutDn(e, node.id, port.id)}
                                style={{ position: 'absolute', right: -PORT_R, width: PORT_R * 2, height: PORT_R * 2, borderRadius: '50%', background: connected ? pc : '#08080f', border: `2px solid ${pc}`, cursor: 'crosshair', zIndex: 3, boxShadow: connected ? `0 0 6px ${pc}60` : 'none', transition: 'all .12s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.45)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* 出力ノード専用フッター */}
                      {isOutput && (
                        <div style={{ padding: '6px 12px', borderTop: '1px solid #1a0a00', background: '#100500', borderRadius: '0 0 6px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: outputConnected ? '#f97316' : '#333', flexShrink: 0, boxShadow: outputConnected ? '0 0 6px #f97316' : 'none' }} />
                          <span style={{ fontSize: 8, color: outputConnected ? '#f97316' : '#334155' }}>
                            {outputConnected ? 'レンダリング中' : '接続待ち'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>}

              {/* レイアウトモード */}
              {mode === 'layout' && (
                <div style={{ padding: 24, minWidth: 600 }} onClick={() => setSelId(null)}>
                  <div style={{ marginBottom: 12, fontSize: 7, color: '#334155', letterSpacing: 2, textTransform: 'uppercase' }}>
                    レイアウトツリー ─ サイドバーから要素をドロップ
                  </div>
                  {layoutTree.length === 0
                    ? <div style={{ padding: 40, border: '2px dashed #1a1a28', borderRadius: 8, textAlign: 'center', color: '#1e1e36', fontSize: 11 }}>
                        サイドバーから要素をドロップして開始
                      </div>
                    : layoutTree.map(el => (
                      <LayoutNodeView key={el.id} el={el} selId={selId} setSelId={setSelId} setTree={setLT} />
                    ))
                  }
                </div>
              )}
            </div>

            {/* モードバッジ */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, padding: '4px 14px', borderRadius: 20, background: '#0c0c18', border: '1px solid #1a1a30', fontSize: 7, color: '#334155', letterSpacing: 2, pointerEvents: 'none', textTransform: 'uppercase' }}>
              {mode === 'logic' ? '⬡ ロジックモード' : '▣ レイアウトモード'}
            </div>

            {/* 操作ヒント */}
            <div style={{ position: 'absolute', bottom: 14, right: 14, padding: '6px 14px', borderRadius: 8, background: '#0c0c18', border: '1px solid #1a1a30', fontSize: 8, color: '#1e1e36', lineHeight: 2, pointerEvents: 'none', textAlign: 'right' }}>
              <div>スクロール：ズーム</div>
              <div>ドラッグ：移動</div>
              <div>エッジをダブルクリック：削除</div>
            </div>
          </div>

          {/* プロパティパネル */}
          <PropertiesPanel
            mode={mode}
            selNode={selNode}
            selLayout={selLayout}
            edges={edges}
            nodes={nodes}
            selId={selId}
            updProp={updProp}
            updLP={updLP}
            delNode={delNode}
            delLayout={delLayout}
            delEdge={delEdge}
            setTutorial={setTutorial}
          />

          {/* コードパネル */}
          {showCode && <CodePanel code={code} />}

          {/* ライブプレビュー */}
          {showPrev && (
            <div style={{ width: 340, borderLeft: '1px solid #13131e', flexShrink: 0 }}>
              <LivePreview nodes={nodes} edges={edges} layoutTree={layoutTree} bp={bp} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
