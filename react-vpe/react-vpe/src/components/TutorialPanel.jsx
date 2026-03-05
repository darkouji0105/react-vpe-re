import { NODE_META } from '../constants';

// ─── チュートリアルモーダル ────────────────────────────────────────────────────
export default function TutorialPanel({ type, onClose }) {
  const meta = NODE_META[type];
  if (!meta || !meta.tutorial) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.75)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: 520, maxHeight: '80vh', background: '#0b0b16',
        border: `1px solid ${meta.color}40`, borderTop: `3px solid ${meta.color}`,
        borderRadius: 10, display: 'flex', flexDirection: 'column',
        boxShadow: `0 20px 60px rgba(0,0,0,.7),0 0 40px ${meta.color}15`,
      }}>
        {/* ヘッダー */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #151520', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, color: meta.color }}>{meta.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: meta.color }}>{meta.label}</div>
            <div style={{ fontSize: 9, color: '#334155', letterSpacing: 1, marginTop: 2 }}>{meta.desc}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#cbd5e1'}
            onMouseLeave={e => e.currentTarget.style.color = '#334155'}
          >×</button>
        </div>

        {/* 本文 */}
        <div style={{ overflowY: 'auto', padding: '18px 18px', flex: 1 }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 11, color: '#94a3b8', lineHeight: 2, fontFamily: '"JetBrains Mono","Fira Code",monospace' }}>
            {meta.tutorial.split('\n').map((line, i) => {
              const isSection = line.startsWith('■');
              const isCode    = line.startsWith('const ') || line.startsWith('function ') || line.startsWith('  ') || line.startsWith('<') || line.startsWith('//');
              if (isSection)
                return <div key={i} style={{ color: meta.color, fontWeight: 700, marginTop: i ? 14 : 0, marginBottom: 4 }}>{line}</div>;
              if (line.startsWith('・'))
                return <div key={i} style={{ color: '#64748b', paddingLeft: 8 }}>{line}</div>;
              if (isCode && !isSection)
                return <div key={i} style={{ color: '#7dd3fc', paddingLeft: 8, fontFamily: 'monospace' }}>{line}</div>;
              return <div key={i}>{line || '\u00a0'}</div>;
            })}
          </pre>
        </div>

        {/* フッター */}
        <div style={{ padding: '10px 18px', borderTop: '1px solid #151520', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '6px 20px', background: meta.color, border: 'none', borderRadius: 5, color: '#fff', fontSize: 10, cursor: 'pointer', letterSpacing: 1 }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
