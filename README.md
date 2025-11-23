# Todo List Web Application

シンプルで使いやすいTodoリストのWebアプリケーションです。

## 機能

- ✅ Todoの追加・編集・削除
- ✅ 完了/未完了の切り替え
- ✅ フィルタリング（全て/未完了/完了済み）
- ✅ データの自動保存（Local Storage）
- ✅ レスポンシブデザイン

## デモ

[デモサイトURL]（デプロイ後に追加）

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: CSS Modules / Tailwind CSS
- **データ保存**: Local Storage
- **デプロイ**: Vercel

## 必要要件

- Node.js 18.17以上
- npm または yarn

## インストール
```bash
# リポジトリのクローン
git clone [リポジトリURL]
cd todo-app

# 依存パッケージのインストール
npm install
# または
yarn install
```

## 開発環境での起動
```bash
# 開発サーバーの起動
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ビルド
```bash
# プロダクションビルド
npm run build
# または
yarn build

# ビルド結果の起動
npm run start
# または
yarn start
```

## 使い方

1. **Todoの追加**: 入力欄にタイトルを入力して「追加」ボタンをクリック
2. **Todoの完了**: チェックボックスをクリックして完了/未完了を切り替え
3. **Todoの編集**: Todoアイテムをダブルクリックして編集モードに
4. **Todoの削除**: 削除ボタンをクリック
5. **フィルタリング**: 「全て」「未完了」「完了済み」ボタンで表示を切り替え

## データの保存について

このアプリケーションはブラウザのLocal Storageにデータを保存します。
- データはブラウザごとに保存されます
- ブラウザのキャッシュをクリアするとデータが削除されます
- 異なるデバイス間でのデータ同期はできません

## プロジェクト構成
```
/src
  /app
    page.tsx          # メインページ
    layout.tsx        # ルートレイアウト
  /components         # UIコンポーネント
  /lib               # ユーティリティ・型定義
  /hooks             # カスタムフック
```

## 開発ドキュメント

開発者向けの詳細なドキュメント:
- [CLAUDE.md](./CLAUDE.md) - 開発ガイドライン
- [DESIGN.md](./DESIGN.md) - 機能設計書
- [MOCKUP.md](./MOCKUP.md) - 画面設計

## ライセンス

MIT License

## 作成者

[あなたの名前]

## 貢献

Issue や Pull Request を歓迎します。

## 今後の予定

- [ ] カテゴリ機能
- [ ] 優先度設定
- [ ] 期限設定とリマインダー
- [ ] ダークモード
- [ ] バックエンドDB対応（複数デバイス同期）