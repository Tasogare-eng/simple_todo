'use client';

import { useState, FormEvent } from 'react';
import { TodoInput, Category, Priority } from '@/lib/types';

// Todo追加フォームコンポーネント（v1.1.0で拡張）
interface TodoFormProps {
  onAddTodo: (input: TodoInput) => boolean;
  categories?: Category[]; // v1.1.0: カテゴリ一覧
}

export default function TodoForm({ onAddTodo, categories = [] }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined); // v1.1.0
  const [priority, setPriority] = useState<Priority>('medium'); // v1.1.0
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォーム送信処理
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // バリデーション: 空白のみの入力は無効
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('Todoのタイトルを入力してください');
      return;
    }

    // タイトルの文字数チェック
    if (trimmedTitle.length > 100) {
      alert('タイトルは100文字以内で入力してください');
      return;
    }

    // Todoを追加（v1.1.0: カテゴリと優先度を含める）
    setIsSubmitting(true);
    const success = onAddTodo({
      title: trimmedTitle,
      categoryId: categoryId,
      priority: priority,
    });
    setIsSubmitting(false);

    if (success) {
      setTitle(''); // 入力欄をクリア
      setCategoryId(undefined); // カテゴリをリセット
      setPriority('medium'); // 優先度をリセット
    } else {
      alert('Todoの追加に失敗しました');
    }
  };

  // 追加ボタンクリック
  const handleAddClick = () => {
    const form = document.querySelector('form');
    form?.requestSubmit();
  };

  return (
    <div className="card p-5 mb-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* タイトル入力 */}
        <div className="flex gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="新しいTodoを入力..."
            className="input flex-1 text-base"
            maxLength={100}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={handleAddClick}
            disabled={isSubmitting}
            className="btn btn-primary min-w-[80px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '追加中...' : '追加'}
          </button>
        </div>

        {/* v1.1.0: カテゴリと優先度の選択 */}
        <div className="flex gap-3">
          {/* カテゴリ選択 */}
          <div className="flex-1">
            <label className="block text-sm text-secondary mb-1">カテゴリ</label>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value || undefined)}
              className="input w-full text-base"
              disabled={isSubmitting}
            >
              <option value="">未分類</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 優先度選択 */}
          <div className="flex-1">
            <label className="block text-sm text-secondary mb-1">優先度</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="input w-full text-base"
              disabled={isSubmitting}
            >
              <option value="high">高 🔴</option>
              <option value="medium">中 🟡</option>
              <option value="low">低 🟢</option>
            </select>
          </div>
        </div>

        {title.length > 80 && (
          <p className="text-sm text-secondary">
            残り {100 - title.length} 文字
          </p>
        )}
      </form>
    </div>
  );
}
