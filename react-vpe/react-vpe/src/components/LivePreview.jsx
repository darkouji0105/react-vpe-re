import { useRef, useEffect, useMemo } from 'react';
import { buildPreviewHtml } from '../codeGen';

// ─── ライブプレビュー（iframe） ────────────────────────────────────────────────
export default function LivePreview({ nodes, edges, layoutTree, bp }) {
  const iframeRef = useRef(null);
  const html = useMemo(() => buildPreviewHtml(nodes, edges, layoutTree), [nodes, edges, layoutTree]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  const bpW = { desktop: '100%', tablet: '768px', mobile: '375px' }[bp] || '100%';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#06060e' }}>
      {/* ヘッダー */}
      <div style={{ padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #151520', background: '#0a0a14', flexShrink: 0 }}>
        <span style={{ fontSize: 7, color: '#a855f7', letterSpacing: 2, textTransform: 'uppercase' }}>ライブプレビュー</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 9, color: '#334155' }}>{bpW}</span>
      </div>

      {/* プレビュー本体 */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 12, background: '#08080f' }}>
        <div style={{ width: bpW, minHeight: 320, background: '#fff', boxShadow: '0 4px 30px rgba(0,0,0,.5)', borderRadius: 8, overflow: 'hidden', transition: 'width 0.3s' }}>
          <iframe
            ref={iframeRef}
            style={{ width: '100%', height: '100%', minHeight: 320, border: 'none', display: 'block' }}
            sandbox="allow-scripts allow-same-origin"
            title="ライブプレビュー"
          />
        </div>
      </div>
    </div>
  );
}
