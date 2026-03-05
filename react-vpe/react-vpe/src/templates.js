// ─── サイドバーテンプレート一覧 ───────────────────────────────────────────────
export const SIDEBAR_LOGIC = [
  // ── State ──
  { id: 'cnt-state',   type: 'state',    label: 'カウンター',         props: { name: 'count',   initialValue: '0',     valueType: 'number'  } },
  { id: 'txt-state',   type: 'state',    label: 'テキスト入力',       props: { name: 'text',    initialValue: "''",    valueType: 'string'  } },
  { id: 'bool-state',  type: 'state',    label: 'フラグ（表示切替）', props: { name: 'isOpen',  initialValue: 'false', valueType: 'boolean' } },
  { id: 'arr-state',   type: 'state',    label: 'リスト',             props: { name: 'items',   initialValue: '[]',    valueType: 'array'   } },
  { id: 'obj-state',   type: 'state',    label: 'オブジェクト',       props: { name: 'user',    initialValue: '{}',    valueType: 'object'  } },
  // ── Function ──
  { id: 'click-fn',    type: 'fn',       label: 'クリック処理',       props: { name: 'handleClick'   } },
  { id: 'change-fn',   type: 'fn',       label: '入力変更処理',       props: { name: 'handleChange'  } },
  { id: 'submit-fn',   type: 'fn',       label: 'フォーム送信処理',   props: { name: 'handleSubmit'  } },
  // ── Effect ──
  { id: 'fetch-eff',   type: 'effect',   label: 'データ取得',         props: { name: 'fetchEffect', cleanup: true  } },
  { id: 'mount-eff',   type: 'effect',   label: 'マウント時処理',     props: { name: 'onMount',     cleanup: false } },
  { id: 'interval-eff',type: 'effect',   label: 'タイマー',           props: { name: 'interval',    cleanup: true  } },
  // ── Element ──
  { id: 'btn-el',      type: 'element',  label: 'ボタン',             props: { tag: 'button', className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium' } },
  { id: 'inp-el',      type: 'element',  label: 'テキスト入力',       props: { tag: 'input',  className: 'border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none' } },
  { id: 'div-el',      type: 'element',  label: 'コンテナDiv',        props: { tag: 'div',    className: 'flex flex-col gap-3 p-4' } },
  { id: 'h1-el',       type: 'element',  label: '見出しH1',           props: { tag: 'h1',     className: 'text-2xl font-bold text-gray-900' } },
  { id: 'p-el',        type: 'element',  label: '段落テキスト',       props: { tag: 'p',      className: 'text-gray-600 text-sm' } },
  // ── Component ──
  { id: 'form-comp',   type: 'component',label: 'フォーム',           props: { name: 'Form'  } },
  { id: 'card-comp',   type: 'component',label: 'カード',             props: { name: 'Card'  } },
  { id: 'modal-comp',  type: 'component',label: 'モーダル',           props: { name: 'Modal' } },
  // ── Hook ──
  { id: 'use-fetch',   type: 'hook',     label: 'useFetch（通信）',   props: { name: 'useFetch'  } },
  { id: 'use-form',    type: 'hook',     label: 'useForm（フォーム）',props: { name: 'useForm'   } },
  { id: 'use-toggle',  type: 'hook',     label: 'useToggle（切替）',  props: { name: 'useToggle' } },
  // ── Output ──
  { id: 'output',      type: 'output',   label: '出力（レンダリング）',props: { name: 'output' } },
];
