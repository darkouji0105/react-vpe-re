import { cap } from './helpers';

// ─── Reactコード生成 ───────────────────────────────────────────────────────────
export function genCode(nodes, edges, layoutTree) {
  const byType = t => nodes.filter(n => n.type === t);
  const compName = byType('component')[0]?.label || 'MyComponent';
  let out = `import React, { useState, useEffect } from 'react';\n\n`;

  // カスタムHook
  byType('hook').forEach(h => {
    const n = h.props.name || 'useCustom';
    out += `// カスタムHook: ${n}\nfunction ${n.startsWith('use') ? n : 'use' + cap(n)}(arg) {\n  // TODO: ロジックを記述\n  return { result: null };\n}\n\n`;
  });

  out += `export default function ${cap(compName)}() {\n`;
  out += `  // ── State（状態変数） ──────────────────────────────────\n`;
  byType('state').forEach(s => {
    const n = s.props.name || 'state', init = s.props.initialValue ?? 'null';
    out += `  const [${n}, set${cap(n)}] = useState(${init}); // ${s.props.valueType || 'any'}\n`;
  });
  if (!byType('state').length) out += `  // ※ Stateノードを追加してください\n`;
  out += `\n`;

  out += `  // ── イベントハンドラ ────────────────────────────────────\n`;
  byType('fn').forEach(f => {
    out += `  const ${f.props.name || 'handler'} = (e) => {\n    // TODO: 処理を記述\n  };\n\n`;
  });

  out += `  // ── 副作用（useEffect） ─────────────────────────────────\n`;
  byType('effect').forEach(ef => {
    const deps = edges
      .filter(e => e.tgt === ef.id)
      .map(e => nodes.find(n => n.id === e.src)?.props?.name)
      .filter(Boolean);
    out += `  useEffect(() => {\n    // ${ef.props.name || 'effect'}: 処理を記述\n`;
    if (ef.props.cleanup) out += `    return () => {\n      // クリーンアップ処理\n    };\n`;
    out += `  }, [${deps.join(', ')}]);\n\n`;
  });

  // 出力ノードに繋がったJSX要素を収集
  const outputNode = byType('output')[0];
  const connectedJSX = outputNode
    ? outputNode.ports.inputs.map(port => {
        const edge = edges.find(e => e.tgtPort === port.id);
        if (!edge) return null;
        return nodes.find(n => n.id === edge.src) || null;
      }).filter(Boolean)
    : [];

  out += `  // ── レンダリング ────────────────────────────────────────\n`;
  out += `  return (\n    <div className="p-4 flex flex-col gap-4">\n`;
  if (connectedJSX.length) {
    connectedJSX.forEach(el => {
      const tag = el.props.tag || 'div';
      const cls = el.props.className ? ` className="${el.props.className}"` : '';
      const self = ['input', 'img', 'br', 'hr'].includes(tag);
      if (self) out += `      <${tag}${cls} />\n`;
      else      out += `      <${tag}${cls}>{/* ${el.label} */}</${tag}>\n`;
    });
  } else {
    out += `      {/* 出力ノードにElementやComponentを接続してください */}\n`;
    byType('element').forEach(el => {
      const tag = el.props.tag || 'div';
      const cls = el.props.className ? ` className="${el.props.className}"` : '';
      const self = ['input', 'img', 'br', 'hr'].includes(tag);
      if (self) out += `      <${tag}${cls} />\n`;
      else      out += `      <${tag}${cls}>{/* ${el.label} */}</${tag}>\n`;
    });
  }
  out += `    </div>\n  );\n}\n`;

  // レイアウトモードのJSXも追記
  if (layoutTree.length) {
    out += `\n// ── レイアウトモードで生成されたJSX ──────────────\n`;
    const renderJSX = (els, indent = '  ') => {
      els.forEach(el => {
        const tag = el.props?.tag || 'div';
        const tw  = el.props?.tw  ? ` className="${el.props.tw}"` : '';
        const text = el.props?.text || '';
        const self = ['input', 'img', 'hr', 'br'].includes(tag);
        const ph   = el.props?.placeholder ? ` placeholder="${el.props.placeholder}"` : '';
        const src  = el.props?.src ? ` src="${el.props.src}" alt=""` : '';
        if (self) { out += `${indent}<${tag}${tw}${ph}${src} />\n`; return; }
        if (el.children && el.children.length) {
          out += `${indent}<${tag}${tw}>\n`;
          renderJSX(el.children, indent + '  ');
          out += `${indent}</${tag}>\n`;
        } else {
          out += `${indent}<${tag}${tw}>${text}</${tag}>\n`;
        }
      });
    };
    out += `/*\n`;
    renderJSX(layoutTree, '  ');
    out += `*/\n`;
  }
  return out;
}

// ─── ライブプレビューHTML生成 ─────────────────────────────────────────────────
export function buildPreviewHtml(nodes, edges, layoutTree) {
  const renderHTML = (els) => {
    if (!els || !els.length) return '';
    return els.map(el => {
      if (!el || !el.ltype) return '';
      const tag  = el.props?.tag || 'div';
      const tw   = el.props?.tw || '';
      const text = el.props?.text || '';
      const self = ['input', 'img', 'hr', 'br'].includes(tag);
      const ph   = el.props?.placeholder ? ` placeholder="${el.props.placeholder}"` : '';
      const src  = el.props?.src ? ` src="${el.props.src}" alt=""` : '';
      if (self) return `<${tag} class="${tw}"${ph}${src}>`;
      const inner = (el.children && el.children.length) ? renderHTML(el.children) : text;
      return `<${tag} class="${tw}">${inner}</${tag}>`;
    }).join('\n');
  };

  const byType = t => nodes.filter(n => n.type === t);

  const states = byType('state').map(s => {
    const n = s.props.name || 'state', init = s.props.initialValue ?? 'null';
    return `let ${n}=${init};\nfunction set${cap(n)}(v){${n}=v;_render();}`;
  }).join('\n');

  const fns = byType('fn').map(f =>
    `function ${f.props.name || 'handler'}(e){_render();}`
  ).join('\n');

  // 出力ノードに繋がったElementを取得
  const outNode = byType('output')[0];
  const connJSX = outNode
    ? outNode.ports.inputs.map(p => {
        const e = edges.find(ed => ed.tgtPort === p.id);
        return e ? nodes.find(n => n.id === e.src) : null;
      }).filter(Boolean)
    : byType('element');

  const elemHTML = connJSX.map(el => {
    if (!el) return '';
    const tag = el.props?.tag || 'div';
    const cls = el.props?.className || '';
    const self = ['input', 'img', 'br', 'hr'].includes(tag);
    if (self) return `<${tag} class="${cls}" data-node="${el.id}">`;
    return `<${tag} class="${cls}" data-node="${el.id}">${el.label || tag}</${tag}>`;
  }).join('\n');

  const body = layoutTree.length
    ? renderHTML(layoutTree)
    : (elemHTML || `<div style="padding:32px;text-align:center;color:#94a3b8;font-size:13px;font-family:system-ui"><p>🔗 出力ノードにElementを接続するか</p><p>レイアウトモードでUIを構築してください</p></div>`);

  const clickBindings = byType('fn').map(f => `
  document.querySelectorAll('[data-node]').forEach(el=>{
    if(!el._b){el._b=true;el.addEventListener('click',()=>{
      if(typeof ${f.props.name}==='function')${f.props.name}();
    });}
  });`).join('');

  const inputStateUpdates = byType('state')
    .filter(s => s.props.valueType === 'string')
    .map(s => `set${cap(s.props.name || 'state')}(e.target.value)`)
    .join(';') || '_render()';

  return `<!DOCTYPE html>
<html lang="ja"><head>
<meta charset="UTF-8">
<script src="https://cdn.tailwindcss.com"><\/script>
<style>body{margin:0;font-family:system-ui,sans-serif}#app{min-height:100vh}</style>
</head><body>
<div id="app"></div>
<script>
${states}
${fns}
function _render(){
  document.getElementById('app').innerHTML=\`<div class="p-4">${body.replace(/`/g, '\\`').replace(/\$/g, '\\$')}</div>\`;
  ${clickBindings}
  document.querySelectorAll('input[data-node]').forEach(i=>{
    if(!i._b){i._b=true;i.addEventListener('input',e=>{${inputStateUpdates};});}
  });
}
_render();
<\/script></body></html>`;
}
