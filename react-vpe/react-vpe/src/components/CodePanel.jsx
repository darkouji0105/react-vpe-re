import { useState } from 'react';
import { hlLine } from '../helpers';

// ─── コード表示パネル ──────────────────────────────────────────────────────────
export default function CodePanel({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <aside style={{ width: 330, background: '#05050c', borderLeft: '1px solid #13131e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* ヘッダー */}
      <div style={{ padding: '9px 14px', borderBottom: '1px solid #13131e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 7, color: '#6366f1', letterSpacing: 2.5, textTransform: 'uppercase' }}>生成されたTSXコード</div>
          <div style={{ fontSize: 7, color: '#1a1a36', marginTop: 1 }}>リアルタイム自動更新</div>
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: '3px 10px',
            background: copied ? '#10b981' : 'transparent',
            border: `1px solid ${copied ? '#10b981' : '#252540'}`,
            borderRadius: 4, color: copied ? '#fff' : '#6366f1',
            fontSize: 8, cursor: 'pointer', letterSpacing: 1, transition: 'all .2s',
          }}
        >
          {copied ? '✓ コピー完了' : 'コピー'}
        </button>
      </div>

      {/* コード本文 */}
      <div style={{ overflowY: 'auto', flex: 1, padding: 12 }}>
        {code.split('\n').map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 11, lineHeight: 1.85, minHeight: 16 }}>
            <span style={{ color: '#1a1a26', width: 22, textAlign: 'right', flexShrink: 0, fontSize: 9, userSelect: 'none', fontVariantNumeric: 'tabular-nums' }}>
              {i + 1}
            </span>
            <span
              style={{ fontSize: 10, whiteSpace: 'pre', color: '#94a3b8' }}
              dangerouslySetInnerHTML={{ __html: hlLine(line.replace(/</g, '&lt;').replace(/>/g, '&gt;')) || '&nbsp;' }}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
