import { NODE_META, LAYOUT_META } from '../constants';
import { PF, PS, PC, NBadge, ConnList, DBtn } from './atoms';

// ─── プロパティパネル ──────────────────────────────────────────────────────────
export default function PropertiesPanel({
  mode, selNode, selLayout, edges, nodes, selId,
  updProp, updLP, delNode, delLayout, delEdge, setTutorial,
}) {
  return (
    <aside style={{ width: 248, background: '#0b0b15', borderLeft: '1px solid #13131e', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #13131e', fontSize: 7, letterSpacing: 2.5, color: '#1e1e36', textTransform: 'uppercase' }}>
        プロパティ
      </div>

      {/* ロジックノードのプロパティ */}
      {mode === 'logic' && selNode && (
        <div style={{ padding: 14, overflowY: 'auto', flex: 1 }}>
          <NBadge
            meta={NODE_META[selNode.type] || { color: '#555', icon: '?', label: selNode.type }}
            id={selNode.id}
            onTutorial={() => setTutorial(selNode.type)}
          />
          <PF label="名前" value={selNode.props.name || selNode.label} onChange={v => updProp('name', v)} />
          {selNode.type === 'state' && <>
            <PF label="初期値" value={selNode.props.initialValue ?? ''} onChange={v => updProp('initialValue', v)} />
            <PS label="型" value={selNode.props.valueType || 'any'} opts={['string', 'number', 'boolean', 'array', 'object', 'any']} onChange={v => updProp('valueType', v)} />
          </>}
          {selNode.type === 'element' && <>
            <PS label="HTMLタグ" value={selNode.props.tag || 'div'} opts={['div', 'span', 'p', 'h1', 'h2', 'h3', 'button', 'input', 'form', 'ul', 'li', 'section', 'article', 'img', 'label']} onChange={v => updProp('tag', v)} />
            <PF label="Tailwindクラス" value={selNode.props.className ?? ''} onChange={v => updProp('className', v)} />
          </>}
          {selNode.type === 'effect' && (
            <PC label="クリーンアップ関数あり" checked={selNode.props.cleanup} onChange={v => updProp('cleanup', v)} />
          )}
          <ConnList edges={edges} nodes={nodes} selId={selId} delEdge={delEdge} />
          <DBtn onClick={delNode} />
        </div>
      )}

      {/* レイアウト要素のプロパティ */}
      {mode === 'layout' && selLayout && (
        <div style={{ padding: 14, overflowY: 'auto', flex: 1 }}>
          <NBadge meta={LAYOUT_META[selLayout.ltype] || { color: '#555', icon: '?', label: selLayout.ltype }} id={selLayout.id} />
          <PF label="テキスト" value={selLayout.props.text ?? ''} onChange={v => updLP('text', v)} />
          <PF label="Tailwindクラス" value={selLayout.props.tw ?? ''} onChange={v => updLP('tw', v)} />
          {['input'].includes(selLayout.props.tag) && (
            <PF label="プレースホルダー" value={selLayout.props.placeholder ?? ''} onChange={v => updLP('placeholder', v)} />
          )}
          {['img'].includes(selLayout.props.tag) && (
            <PF label="画像URL" value={selLayout.props.src ?? ''} onChange={v => updLP('src', v)} />
          )}
          <PS label="HTMLタグ" value={selLayout.props.tag || 'div'} opts={['div', 'section', 'article', 'nav', 'header', 'footer', 'main', 'aside', 'span', 'p', 'h1', 'h2', 'h3', 'button', 'input', 'img', 'form', 'ul', 'li', 'hr']} onChange={v => updLP('tag', v)} />
          <DBtn onClick={delLayout} />
        </div>
      )}

      {/* 選択なし状態 */}
      {((mode === 'logic' && !selNode) || (mode === 'layout' && !selLayout)) && (
        <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 9, color: '#1e1e2e', lineHeight: 2.2 }}>
            {mode === 'logic' ? 'ノードを選択してください' : 'レイアウト要素を選択してください'}
          </div>
          <div style={{ padding: 12, background: '#08080f', borderRadius: 5, border: '1px solid #111120', fontSize: 8, color: '#1e1e36', lineHeight: 2.4 }}>
            <div style={{ color: '#2a2a4a', marginBottom: 6, letterSpacing: 1, fontSize: 8 }}>📌 操作ガイド</div>
            <div>⊕ サイドバーからドラッグ</div>
            {mode === 'logic' && <>
              <div>⊕ ポートをドラッグして接続</div>
              <div>⊕ エッジをダブルクリックで削除</div>
              <div style={{ marginTop: 8, color: NODE_META.output.color }}>▶ 最後に出力ノードへ接続！</div>
            </>}
            {mode === 'layout' && <>
              <div>⊕ 要素の中にドロップで入れ子</div>
              <div>⊕ クラスを直接編集して確認</div>
            </>}
            <div style={{ marginTop: 8 }}>Del キー：削除</div>
          </div>

          {mode === 'logic' && (
            <div style={{ padding: 10, background: '#100500', borderRadius: 5, border: `1px solid ${NODE_META.output.color}30`, fontSize: 8, color: '#334155', lineHeight: 2 }}>
              <div style={{ color: NODE_META.output.color, marginBottom: 4, fontWeight: 700 }}>▶ 出力ノードとは？</div>
              <div>Element や Component の出力ポートを</div>
              <div>出力ノードの jsx1〜4 に繋ぐと</div>
              <div>return文のJSXが生成されます。</div>
              <button
                onClick={() => setTutorial('output')}
                style={{ marginTop: 6, background: 'none', border: `1px solid ${NODE_META.output.color}50`, borderRadius: 3, color: NODE_META.output.color, cursor: 'pointer', fontSize: 8, padding: '2px 10px' }}
              >
                使い方を見る →
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
