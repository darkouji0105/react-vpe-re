import { NODE_META, LAYOUT_META } from '../constants';
import { SIDEBAR_LOGIC } from '../templates';
import { flattenTree } from '../helpers';

// ─── サイドバー ────────────────────────────────────────────────────────────────
export default function Sidebar({ mode, tab, setTab, nodes, edges, layoutTree, selId, setSelId, setTutorial }) {
  const sidebarTabs = mode === 'logic' ? ['nodes', 'hooks'] : ['elements', 'tree'];
  const flatLayout  = flattenTree(layoutTree);

  return (
    <aside style={{ width: 218, background: '#0b0b15', borderRight: '1px solid #13131e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* ロゴ */}
      <div style={{ padding: '13px 14px', borderBottom: '1px solid #13131e', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>⬡</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#818cf8', letterSpacing: 3 }}>REACT</div>
          <div style={{ fontSize: 7, color: '#1e1e36', letterSpacing: 3 }}>ビジュアルスタジオ</div>
        </div>
      </div>

      {/* タブ切替 */}
      <div style={{ display: 'flex', background: '#080810', borderBottom: '1px solid #13131e' }}>
        {sidebarTabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '7px 2px', border: 'none', cursor: 'pointer',
              background: tab === t ? '#0b0b15' : 'transparent',
              color: tab === t ? '#818cf8' : '#1e1e36',
              fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase',
              borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent',
            }}
          >
            {({ nodes: 'ノード', hooks: 'Hook', elements: '要素', tree: 'ツリー' })[t] || t}
          </button>
        ))}
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '10px 8px' }}>

        {/* ロジックモード: ノード一覧 */}
        {mode === 'logic' && tab === 'nodes' && (() => {
          const g = SIDEBAR_LOGIC.reduce((a, t) => { (a[t.type] = a[t.type] || []).push(t); return a; }, {});
          const order = ['output', 'state', 'fn', 'effect', 'element', 'component', 'hook'];
          return order.filter(type => g[type]).map(type => (
            <div key={type} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 7, color: NODE_META[type]?.color || '#555', letterSpacing: 2, marginBottom: 5, padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>{NODE_META[type]?.icon}</span>
                  <span>{NODE_META[type]?.label || type}</span>
                </div>
                <button
                  onClick={() => setTutorial(type)}
                  title="使い方を見る"
                  style={{ background: 'none', border: `1px solid ${NODE_META[type]?.color || '#555'}40`, borderRadius: 3, color: NODE_META[type]?.color || '#555', cursor: 'pointer', fontSize: 9, padding: '1px 6px', lineHeight: 1.4 }}
                >?</button>
              </div>
              {g[type].map(tmpl => (
                <div
                  key={tmpl.id}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('tid', tmpl.id)}
                  style={{ padding: '6px 10px', marginBottom: 3, borderRadius: 4, cursor: 'grab', fontSize: 10, color: '#475569', userSelect: 'none', background: '#09090f', border: '1px solid #13131e', borderLeft: `3px solid ${NODE_META[type]?.color || '#555'}40`, transition: 'all .12s', display: 'flex', alignItems: 'center', gap: 7 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.borderLeftColor = NODE_META[type]?.color || '#555'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderLeftColor = `${NODE_META[type]?.color || '#555'}40`; }}
                >
                  <span style={{ flexShrink: 0, fontSize: 9, opacity: .6 }}>{NODE_META[type]?.icon}</span>
                  {tmpl.label}
                </div>
              ))}
            </div>
          ));
        })()}

        {/* ロジックモード: 組み込みHook */}
        {mode === 'logic' && tab === 'hooks' && (
          <div>
            <div style={{ fontSize: 7, color: '#334155', letterSpacing: 1.5, marginBottom: 10, padding: '0 4px' }}>組み込みHook（React公式）</div>
            {[
              ['useState',        '状態を保持する'],
              ['useEffect',       '副作用を実行する'],
              ['useRef',          'DOMや値を参照する'],
              ['useMemo',         '計算結果をキャッシュ'],
              ['useCallback',     '関数をキャッシュ'],
              ['useContext',      'グローバル状態を読む'],
              ['useReducer',      '複雑な状態管理'],
              ['useLayoutEffect', 'DOM確定後に実行'],
            ].map(([h, desc]) => (
              <div key={h} style={{ padding: '7px 10px', marginBottom: 4, borderRadius: 4, background: '#09090f', border: '1px solid #13131e', borderLeft: '3px solid #a855f740' }}>
                <div style={{ fontSize: 10, color: '#a855f7' }}>{h}</div>
                <div style={{ fontSize: 8, color: '#334155', marginTop: 2 }}>{desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* レイアウトモード: 要素パレット */}
        {mode === 'layout' && tab === 'elements' && (() => {
          const grps = {
            レイアウト: ['container', 'row', 'col'],
            コンテンツ: ['card', 'btn', 'input', 'text', 'heading', 'image', 'badge', 'divider'],
          };
          return Object.entries(grps).map(([gname, ltypes]) => (
            <div key={gname} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 7, color: '#334155', letterSpacing: 2, marginBottom: 5, padding: '0 4px' }}>{gname}</div>
              {ltypes.map(lt => {
                const m = LAYOUT_META[lt];
                return (
                  <div
                    key={lt}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('ltype', lt)}
                    style={{ padding: '6px 10px', marginBottom: 3, borderRadius: 4, cursor: 'grab', fontSize: 10, color: '#475569', userSelect: 'none', background: '#09090f', border: '1px solid #13131e', borderLeft: `3px solid ${m.color}40`, display: 'flex', alignItems: 'center', gap: 7, transition: 'all .12s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.borderLeftColor = m.color; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderLeftColor = `${m.color}40`; }}
                  >
                    <span style={{ fontSize: 11 }}>{m.icon}</span>{m.label}
                  </div>
                );
              })}
            </div>
          ));
        })()}

        {/* レイアウトモード: ツリー表示 */}
        {mode === 'layout' && tab === 'tree' && (
          <div>
            <div style={{ fontSize: 7, color: '#334155', letterSpacing: 2, marginBottom: 8, padding: '0 4px' }}>レイヤーツリー</div>
            {flatLayout.length === 0
              ? <div style={{ fontSize: 9, color: '#1e1e2e', fontStyle: 'italic', padding: '8px 4px' }}>まだ要素がありません</div>
              : flatLayout.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelId(n.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', marginBottom: 2, marginLeft: n._d * 12, borderRadius: 4, cursor: 'pointer', background: selId === n.id ? `${LAYOUT_META[n.ltype]?.color}15` : 'transparent', border: `1px solid ${selId === n.id ? LAYOUT_META[n.ltype]?.color + '40' : 'transparent'}`, transition: 'all .1s' }}
                >
                  <span style={{ fontSize: 10, color: LAYOUT_META[n.ltype]?.color, flexShrink: 0 }}>{LAYOUT_META[n.ltype]?.icon}</span>
                  <span style={{ fontSize: 9, color: selId === n.id ? LAYOUT_META[n.ltype]?.color : '#475569', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {LAYOUT_META[n.ltype]?.label}
                  </span>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* フッター統計 */}
      <div style={{ padding: '9px 14px', borderTop: '1px solid #13131e', fontSize: 8, color: '#1e1e36', lineHeight: 1.9 }}>
        <div style={{ color: '#2a2a4a' }}>{nodes.length}ノード・{edges.length}接続</div>
        <div>{flatLayout.length}レイアウト要素</div>
      </div>
    </aside>
  );
}
