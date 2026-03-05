// ─── キャンバス定数 ────────────────────────────────────────────────────────────
export const NODE_W   = 240;
export const HEADER_H = 44;
export const PORT_H   = 28;
export const PORT_R   = 7;

// ─── ノードメタ情報 ────────────────────────────────────────────────────────────
export const NODE_META = {
  state: {
    label: "State（状態変数）",
    color: "#3b82f6",
    bg: "#070f1e",
    icon: "◆",
    desc: "useState",
    tutorial: `■ State（状態変数）とは？
コンポーネントが「記憶」する値です。
ボタンを押した回数、入力テキスト、
表示/非表示フラグなど何でも保持できます。

■ 使い方
出力ポート「value」→ Element の value へ接続
出力ポート「setValue」→ Function の arg へ接続

■ コード例
const [count, setCount] = useState(0);
const [text, setText]   = useState("");
const [open, setOpen]   = useState(false);

■ ポイント
・初期値は任意（0, "", false, [], {} など）
・setValue を呼ぶと画面が自動で再描画される
・同じコンポーネントに何個でも持てる`,
  },
  props: {
    label: "Props（引数）",
    color: "#f59e0b",
    bg: "#160f00",
    icon: "⇥",
    desc: "Component Props",
    tutorial: `■ Props とは？
親コンポーネントから子コンポーネントへ
渡すデータです。関数の引数に似ています。

■ 使い方
出力ポート「props」→ Component の props へ接続

■ コード例
// 親側
<UserCard name="田中" age={25} />

// 子側（Propsノードが生成するコード）
function UserCard({ name, age }) {
  return <p>{name}（{age}歳）</p>;
}

■ ポイント
・Props は読み取り専用（変更不可）
・型定義で TypeScript の恩恵を受けられる
・デフォルト値を設定できる`,
  },
  effect: {
    label: "Effect（副作用）",
    color: "#ef4444",
    bg: "#180404",
    icon: "⚡",
    desc: "useEffect",
    tutorial: `■ Effect（副作用）とは？
レンダリング後に実行したい処理を書く場所。
API通信、タイマー、DOM操作などに使います。

■ 使い方
入力ポート「dep1〜3」← 依存するStateを接続
依存配列が変化したときだけ実行されます

■ コード例
// マウント時に1回だけ実行
useEffect(() => {
  fetchData();
}, []);

// countが変わるたびに実行
useEffect(() => {
  document.title = \`カウント: \${count}\`;
}, [count]);

// クリーンアップあり（タイマーなど）
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // ← cleanup
}, []);

■ ポイント
・依存配列が空[] → マウント時1回のみ
・依存配列なし → 毎レンダリング後に実行
・クリーンアップでメモリリークを防ぐ`,
  },
  component: {
    label: "Component（部品）",
    color: "#10b981",
    bg: "#030f08",
    icon: "⬡",
    desc: "React Component",
    tutorial: `■ Component とは？
UI部品の定義です。ボタン・カード・
フォームなど、再利用できる単位で作ります。

■ 使い方
入力ポート「props」← Propsノードを接続
出力ポート「jsx」→ 出力ノードへ接続

■ コード例
function UserCard({ name, avatar }) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
    </div>
  );
}

// 使う側
<UserCard name="田中" avatar="/img.png" />

■ ポイント
・名前は大文字で始める（例: MyButton）
・小さく単機能に保つと再利用しやすい
・ダブルクリックで内部を編集できる`,
  },
  hook: {
    label: "Hook（ロジック部品）",
    color: "#a855f7",
    bg: "#0c0518",
    icon: "◎",
    desc: "Custom Hook",
    tutorial: `■ Custom Hook とは？
State・Effect などのロジックを
コンポーネントから切り出して再利用する仕組み。

■ 使い方
入力ポート「arg」← 設定値などを接続
出力ポート「result」→ Componentへ接続

■ コード例
// カウンターロジックを切り出した例
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const reset     = () => setCount(initial);
  return { count, increment, reset };
}

// 使う側
function Counter() {
  const { count, increment } = useCounter(10);
  return <button onClick={increment}>{count}</button>;
}

■ ポイント
・名前は必ず "use" で始める
・複数コンポーネントで同じロジックを共有できる
・useState / useEffect を自由に組み合わせられる`,
  },
  element: {
    label: "Element（HTML要素）",
    color: "#64748b",
    bg: "#0a0d12",
    icon: "</>",
    desc: "JSX Element",
    tutorial: `■ Element とは？
画面に表示されるHTML要素です。
button, input, div, p などを配置します。

■ 使い方
入力ポート「onClick」← Function を接続
入力ポート「value」  ← State の value を接続
出力ポート「jsx」    → 出力ノードへ接続

■ コード例
// ボタン
<button onClick={handleClick} className="btn">
  クリック
</button>

// 入力フォーム
<input
  value={text}
  onChange={e => setText(e.target.value)}
  placeholder="入力してください"
/>

// 条件付き表示
{isOpen && <Modal />}

■ ポイント
・className を使う（class ではない）
・イベントはキャメルケース（onClick, onChange）
・自己終了タグに注意（<input /> など）`,
  },
  fn: {
    label: "Function（イベント処理）",
    color: "#ec4899",
    bg: "#180310",
    icon: "ƒ",
    desc: "Event Handler",
    tutorial: `■ Function（イベントハンドラ）とは？
ボタンクリックや入力変化などに
応じて実行される処理です。

■ 使い方
出力ポート「handler」→ Element の onClick へ接続

■ コード例
// クリックカウント
const handleClick = () => {
  setCount(c => c + 1);
};

// 入力値を State に保存
const handleChange = (e) => {
  setText(e.target.value);
};

// フォーム送信（デフォルト動作を止める）
const handleSubmit = (e) => {
  e.preventDefault();
  console.log("送信:", text);
};

■ ポイント
・アロー関数 () => {} で書くのが一般的
・State の更新関数（setXxx）を呼べる
・非同期処理も書ける（async/await）`,
  },
  output: {
    label: "出力（レンダリング）",
    color: "#f97316",
    bg: "#150800",
    icon: "▶",
    desc: "JSX Output",
    tutorial: `■ 出力ノードとは？
ノードグラフの「終点」です。
ここに接続されたJSXが画面に表示されます。

■ 使い方
入力ポート「jsx1〜4」← Element や Component を接続
複数のJSXを上から順に並べてレンダリングします。

■ コード例
// 出力ノードが生成するreturn文
return (
  <div className="p-4">
    {/* jsx1 に接続されたもの */}
    <h1>タイトル</h1>
    {/* jsx2 に接続されたもの */}
    <button onClick={handleClick}>クリック</button>
  </div>
);

■ ポイント
・必ず1つ配置してください
・接続順（上から）が描画順になります
・ここに到達しないノードはコードに含まれません
・Componentノードの出力もここへ繋げられます`,
  },
};

// ─── レイアウトメタ ────────────────────────────────────────────────────────────
export const LAYOUT_META = {
  container: { label: "コンテナ",   icon: "▣", color: "#6366f1", defaultProps: { tag: "div",    tw: "flex flex-col gap-4 p-6 min-h-screen bg-gray-50" } },
  row:       { label: "横並び",     icon: "⇔", color: "#3b82f6", defaultProps: { tag: "div",    tw: "flex flex-row gap-4 items-start flex-wrap" } },
  col:       { label: "縦並び",     icon: "⇕", color: "#0ea5e9", defaultProps: { tag: "div",    tw: "flex flex-col gap-3 flex-1" } },
  card:      { label: "カード",     icon: "◻", color: "#a855f7", defaultProps: { tag: "div",    tw: "bg-white rounded-xl shadow p-6 border border-gray-100" } },
  btn:       { label: "ボタン",     icon: "⬭", color: "#10b981", defaultProps: { tag: "button", tw: "px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors", text: "クリック" } },
  input:     { label: "入力欄",     icon: "▭", color: "#f59e0b", defaultProps: { tag: "input",  tw: "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "入力してください" } },
  text:      { label: "テキスト",   icon: "T",  color: "#94a3b8", defaultProps: { tag: "p",     tw: "text-gray-700 text-sm leading-relaxed", text: "ここにテキストを入力します。" } },
  heading:   { label: "見出し",     icon: "H₁", color: "#f1f5f9", defaultProps: { tag: "h1",    tw: "text-2xl font-bold text-gray-900", text: "見出しテキスト" } },
  image:     { label: "画像",       icon: "🖼", color: "#fb923c", defaultProps: { tag: "img",   tw: "w-full h-40 object-cover rounded-lg bg-gray-200", src: "https://picsum.photos/400/200?grayscale" } },
  badge:     { label: "バッジ",     icon: "◉", color: "#34d399", defaultProps: { tag: "span",  tw: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800", text: "NEW" } },
  divider:   { label: "区切り線",   icon: "─", color: "#475569", defaultProps: { tag: "hr",    tw: "border-gray-200 my-2" } },
};
