# React ビジュアルスタジオ

Reactコンポーネントをノードベースでビジュアル設計できるツールです。

## 📁 ファイル構成

```
src/
├── main.jsx              # エントリーポイント
├── App.jsx               # メインアプリ（キャンバス・ツールバー）
├── constants.js          # ノードメタ情報・レイアウトメタ・定数
├── helpers.js            # ユーティリティ関数（座標計算・UID・ツリー操作など）
├── templates.js          # サイドバーのテンプレート一覧
├── codeGen.js            # Reactコード生成・プレビューHTML生成
├── initialData.js        # 初期ノード・初期レイアウトツリー
└── components/
    ├── atoms.jsx          # 小さなUIパーツ（PF, PS, PC, TBtn, NBadge, DBtn など）
    ├── TutorialPanel.jsx  # チュートリアルモーダル
    ├── LivePreview.jsx    # iframeライブプレビュー
    ├── LayoutNodeView.jsx # レイアウトツリーの1ノード
    ├── Sidebar.jsx        # サイドバー全体
    ├── PropertiesPanel.jsx# プロパティパネル
    └── CodePanel.jsx      # 生成コード表示パネル
```

## 🚀 Vercelへのデプロイ手順

### 1. 依存パッケージをインストール

```bash
npm install
```

### 2. ローカルで確認

```bash
npm run dev
```

### 3. Vercelにデプロイ

```bash
# Vercel CLIを使う場合
npm i -g vercel
vercel

# または GitHubにpushしてVercelダッシュボードからインポート
```

### Vercel設定（自動検出されます）
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## ✨ 機能

| 機能 | 説明 |
|------|------|
| ロジックモード | State・Effect・Function などをノードで接続してReactロジックを設計 |
| レイアウトモード | ドラッグ&ドロップでUIツリーを構築 |
| コード生成 | 設計したノードグラフからTSXコードをリアルタイム生成 |
| ライブプレビュー | 生成したUIをiframeでその場プレビュー |
| チュートリアル | 各ノードの「?」ボタンで日本語解説を表示 |

## 🎮 操作方法

- **スクロール**: ズーム
- **キャンバスドラッグ**: パン移動
- **ノードヘッダードラッグ**: ノード移動
- **ポートをドラッグ**: ノード接続
- **エッジをダブルクリック**: 接続削除
- **Delete/Backspaceキー**: 選択中のノードを削除
