import { LAYOUT_META } from '../constants';
import { mkLayout, updateInTree, removeFromTree } from '../helpers';

// ─── レイアウトツリーの1ノード ─────────────────────────────────────────────────
export default function LayoutNodeView({ el, selId, setSelId, setTree }) {
  if (!el || !el.ltype) return null;
  const meta  = LAYOUT_META[el.ltype];
  const isSel = el.id === selId;
  const hasCh = el.children && el.children.length > 0;

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    const lt = e.dataTransfer.getData('ltype');
    if (!lt) return;
    const n = mkLayout(lt);
    setTree(prev => updateInTree(prev, el.id, nd => ({ ...nd, children: [...(nd.children || []), n] })));
    setSelId(n.id);
  };

  return (
    <div
      onClick={e => { e.stopPropagation(); setSelId(el.id); }}
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={handleDrop}
      style={{
        marginBottom: 8, borderRadius: 6, cursor: 'pointer', userSelect: 'none',
        border: `1px solid ${isSel ? meta.color : '#1a1a28'}`,
        borderLeft: `3px solid ${isSel ? meta.color : meta.color + '50'}`,
        background: isSel ? `${meta.color}0c` : '#0d0d1a',
        transition: 'all .15s',
      }}
    >
      {/* ヘッダー行 */}
      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: hasCh ? '1px solid #111120' : 'none' }}>
        <span style={{ fontSize: 13, color: meta.color, flexShrink: 0 }}>{meta.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: isSel ? meta.color : '#475569', fontWeight: isSel ? 700 : 400 }}>
            {meta.label}
          </div>
          {el.props?.text && (
            <div style={{ fontSize: 7, color: '#1e2a3a', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              "{el.props.text}"
            </div>
          )}
          {el.props?.tw && (
            <div style={{ fontSize: 7, color: '#1e1e36', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {el.props.tw}
            </div>
          )}
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            setTree(p => removeFromTree(p, el.id));
            if (selId === el.id) setSelId(null);
          }}
          style={{ background: 'none', border: 'none', color: '#1e1e36', cursor: 'pointer', fontSize: 14, padding: '0 3px', lineHeight: 1, flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={e => e.currentTarget.style.color = '#1e1e36'}
        >×</button>
      </div>

      {/* 子要素エリア */}
      {hasCh && (
        <div style={{ padding: '8px 8px 8px 24px' }}>
          {el.children.map(ch => (
            <LayoutNodeView key={ch.id} el={ch} selId={selId} setSelId={setSelId} setTree={setTree} />
          ))}
          <div style={{ padding: '4px 8px', border: '1px dashed #1a1a28', borderRadius: 4, fontSize: 7, color: '#1a1a26', textAlign: 'center' }}>
            + ここにドロップ
          </div>
        </div>
      )}
      {!hasCh && (
        <div style={{ padding: '3px 12px 7px', fontSize: 7, color: '#131320', fontStyle: 'italic' }}>
          ここにドロップして入れ子にする
        </div>
      )}
    </div>
  );
}
