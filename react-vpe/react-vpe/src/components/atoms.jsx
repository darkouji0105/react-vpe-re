import { useState } from 'react';
import { NODE_META } from '../constants';

// ─── スタイル定数 ──────────────────────────────────────────────────────────────
const IS = {
  width: '100%', padding: '6px 10px', background: '#080810',
  border: '1px solid #1e1e2e', borderRadius: 4, color: '#e2e8f0',
  fontSize: 11, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};
const LS = {
  fontSize: 8, color: '#334155', letterSpacing: 1.5,
  textTransform: 'uppercase', display: 'block', marginBottom: 5,
};

// ─── テキスト入力フィールド ────────────────────────────────────────────────────
export function PF({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={LS}>{label}</label>
      <input
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        style={IS}
        onFocus={e  => e.target.style.borderColor = '#6366f1'}
        onBlur={e   => e.target.style.borderColor = '#1e1e2e'}
      />
    </div>
  );
}

// ─── セレクトフィールド ────────────────────────────────────────────────────────
export function PS({ label, value, opts, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={LS}>{label}</label>
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        style={{ ...IS, cursor: 'pointer' }}
      >
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── チェックボックスフィールド ────────────────────────────────────────────────
export function PC({ label, checked, onChange }) {
  const id = `c_${label}`;
  return (
    <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        type="checkbox" id={id} checked={!!checked}
        onChange={e => onChange(e.target.checked)}
        style={{ accentColor: '#6366f1' }}
      />
      <label htmlFor={id} style={{ fontSize: 10, color: '#64748b' }}>{label}</label>
    </div>
  );
}

// ─── トグルボタン ──────────────────────────────────────────────────────────────
export function TBtn({ label, color = '#6366f1', onClick, active }) {
  const [h, sH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => sH(true)}
      onMouseLeave={() => sH(false)}
      style={{
        padding: '4px 14px', border: `1px solid ${color}`, borderRadius: 5,
        fontSize: 9, cursor: 'pointer', letterSpacing: 1,
        background: h || active ? color : 'transparent',
        color: h || active ? '#fff' : color,
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  );
}

// ─── ノードバッジ ──────────────────────────────────────────────────────────────
export function NBadge({ meta, id, onTutorial }) {
  return (
    <div style={{
      padding: '7px 10px', marginBottom: 14, borderRadius: 5,
      background: `${meta.color}0e`, border: `1px solid ${meta.color}25`,
      borderLeft: `3px solid ${meta.color}`, display: 'flex', alignItems: 'center', gap: 9,
    }}>
      <span style={{ fontSize: 15 }}>{meta.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, color: meta.color, fontWeight: 700 }}>{meta.label}</div>
        <div style={{ fontSize: 7, color: '#1e1e36', letterSpacing: 1 }}>id: {id}</div>
      </div>
      {onTutorial && (
        <button
          onClick={onTutorial}
          style={{
            background: 'none', border: `1px solid ${meta.color}40`, borderRadius: 3,
            color: meta.color, cursor: 'pointer', fontSize: 8, padding: '2px 7px', flexShrink: 0,
          }}
        >
          使い方
        </button>
      )}
    </div>
  );
}

// ─── 接続リスト ────────────────────────────────────────────────────────────────
export function ConnList({ edges, nodes, selId, delEdge }) {
  const conns = edges.filter(e => e.src === selId || e.tgt === selId);
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 7, color: '#1e1e36', letterSpacing: 2, marginBottom: 7, textTransform: 'uppercase' }}>
        接続（{conns.length}件）
      </div>
      {conns.length === 0
        ? <div style={{ fontSize: 9, color: '#111118', fontStyle: 'italic' }}>接続なし</div>
        : conns.map(ed => {
          const other = nodes.find(n => n.id === (ed.src === selId ? ed.tgt : ed.src));
          const meta  = NODE_META[other?.type] || { color: '#555', icon: '?' };
          return (
            <div key={ed.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 0', borderBottom: '1px solid #0d0d18', fontSize: 9 }}>
              <span style={{ color: meta.color, fontSize: 10 }}>{ed.src === selId ? '→' : '←'}</span>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
              <span style={{ color: '#475569', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {other?.label || '不明'}
              </span>
              <button
                onClick={() => delEdge(ed.id)}
                style={{ background: 'none', border: 'none', color: '#1e1e36', cursor: 'pointer', fontSize: 13, padding: '0 2px', lineHeight: 1 }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#1e1e36'}
              >×</button>
            </div>
          );
        })
      }
    </div>
  );
}

// ─── 削除ボタン ────────────────────────────────────────────────────────────────
export function DBtn({ onClick }) {
  const [h, sH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => sH(true)}
      onMouseLeave={() => sH(false)}
      style={{
        marginTop: 18, width: '100%', padding: '7px',
        background: h ? '#1a0505' : 'transparent',
        border: '1px solid #2a0a0a', borderRadius: 4,
        color: '#ef4444', fontSize: 8, cursor: 'pointer',
        letterSpacing: 2, textTransform: 'uppercase', transition: 'all .12s',
      }}
    >
      削除
    </button>
  );
}
