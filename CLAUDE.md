# Todo List Web Application

## プロジェクト概要
シンプルで使いやすいTodoリストのWebアプリケーション

## ドキュメント構成
- **CLAUDE.md**: プロジェクト全体の概要と開発ガイドライン（本ファイル）
- **DESIGN.md**: 機能設計書（詳細な機能仕様）
- **MOCKUP.md**: 画面モック・UI設計
- **README.md**: ユーザー向けドキュメント

## 技術スタック
- **言語**: TypeScript
- **フレームワーク**: Next.js (App Router)
- **データ永続化**: Local Storage（MVP）
- **デプロイ**: Vercel
- **スタイリング**: CSS Modules / Tailwind CSS（選択）

## ファイル構造
```
/project-root
  CLAUDE.md           # 開発ガイド
  DESIGN.md           # 機能設計書
  DESIGN_V2.md        # 次期バージョン機能設計 ★新規
  MOCKUP.md           # 画面モック・UI設計
  README.md           # ユーザー向けドキュメント
  CHANGELOG.md        # 変更履歴
  /src
    /app
      page.tsx                    # メインページ（Client Component）
      layout.tsx                  # ルートレイアウト
      globals.css                 # グローバルスタイル
    /components
      TodoList.tsx
      TodoItem.tsx
      TodoForm.tsx
      TodoFilter.tsx
    /lib
      storage.ts                  # Local Storage操作
      types.ts                    # 型定義
    /hooks
      useTodos.ts                 # カスタムフック
      useLocalStorage.ts          # Local Storage hook
  package.json
  tsconfig.json
  next.config.js
```

## 開発フロー（重要）

### フェーズ1: セットアップ＆モック作成
1. Next.jsプロジェクト初期化（TypeScript）
2. Local Storage操作用のユーティリティ作成
3. MOCKUP.mdで画面レイアウト・要素を定義
4. 最小限のコンポーネントでモック画面を作成
5. スタイリングは基本的なもののみ（配置程度）

### フェーズ2: 機能実装
1. 型定義（Todo型など）
2. Local Storage操作関数実装
3. DESIGN.mdの機能仕様に従ってフロントエンド実装
4. Client Componentsでの状態管理
5. 動作確認とテスト追加
6. **この段階ではUIの見た目は気にしない**

### フェーズ3: UI調整
1. すべての機能実装が完了後に開始
2. デザインの洗練（色、フォント、spacing等）
3. アニメーション・トランジション追加
4. レスポンシブ対応の最適化
5. ローディング状態・エラー表示の改善

## 開発原則
- **機能とUIを分離**: 機能実装中は見た目を気にしない
- DESIGN.mdの機能仕様に厳密に従う
- Local Storageは`'use client'`ディレクティブを使用
- TypeScriptの型安全性を最大限活用
- モバイルファーストで開発（UI調整フェーズで）
- エラーハンドリングを適切に実装（Storage quota超過など）

## コーディング規約
- コメントは日本語で記述
- 関数・変数名は英語（キャメルケース）
- インデントはスペース2つ
- コンポーネント名はパスカルケース
- 型定義は明示的に記述（anyの使用を避ける）
- CSSクラス名はBEM記法またはTailwindユーティリティ

## Local Storage実装の注意点
- **SSR対策**: `'use client'`を使用し、`useEffect`内でアクセス
- **容量制限**: 通常5-10MB（ブラウザ依存）
- **データ形式**: JSON文字列で保存
- **キー名**: `todos`（統一）
- **エラーハンドリング**: 
  - Storage quota超過
  - JSON parse エラー
  - プライベートブラウジングモード対応
## Git管理戦略

### コミットタイミング
- **機能単位**: DESIGN.mdの各機能実装完了時
- **フェーズ完了時**: 各フェーズが完全に完了した時
- **リファクタリング後**: 大きなコード変更の後
- **デプロイ前**: 本番環境へのデプロイ前

### コミットメッセージ規約
Conventional Commitsに従う:
- `feat:` 新機能追加
- `fix:` バグ修正
- `docs:` ドキュメント変更
- `style:` コードスタイル変更（機能に影響なし）
- `refactor:` リファクタリング
- `test:` テスト追加・修正
- `chore:` ビルド設定など

例:
```
feat: Implement add todo functionality (DESIGN.md 1.1)
fix: Fix validation error in TodoForm
docs: Update README with installation instructions
style: Apply responsive design
refactor: Centralize state management in useTodos hook
```

### Pushタイミング
- 各コミット後に即座にpush（基本方針）
- 作業の区切りが良いタイミング
- 1日の作業終了時（最低限）

### ブランチ戦略
- **個人開発**: mainブランチで直接開発
- **チーム開発**: feature/機能名 でブランチを切る

現在の戦略: **[mainブランチ直接開発]**
```

---

## Claude Codeへのプロンプト例
```
TodoForm.tsxに「Todoの追加」機能を実装してください。

実装完了後、以下のGitコマンドを実行してください:
git add src/components/TodoForm.tsx src/hooks/
git commit -m "feat: Implement add todo functionality (DESIGN.md 1.1)"
git push origin main
```

または
```
DESIGN.mdの「1.1 Todoの追加」機能の実装が完了しました。
適切なコミットメッセージでGitにコミット・プッシュしてください。

## 将来の拡張性
MVPではLocal Storageを使用しますが、将来的にはバックエンドDBへの移行を想定:
- API Routes追加
- データベース接続（SQLite, PostgreSQL等）
- データ同期機能

このため、データ操作を`/lib/storage.ts`に集約し、後で差し替えやすい設計にする。

## Vercelデプロイ
- Local Storageはクライアントサイドのみで動作
- Vercelへのデプロイに特別な設定は不要
- 環境変数も不要（MVPでは）

## フェーズ管理
現在のフェーズ: **[フェーズ1: セットアップ＆モック作成]**
- フェーズ1完了後 → フェーズ2へ移行
- フェーズ2完了後 → フェーズ3へ移行
- 各フェーズ移行時にこのセクションを更新