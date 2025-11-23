'use client';

import { useState, FormEvent } from 'react';
import { TodoInput } from '@/lib/types';

// Todo追加フォームコンポーネント
interface TodoFormProps {
  onAddTodo: (input: TodoInput) => boolean;
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');
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

    // Todoを追加
    setIsSubmitting(true);
    const success = onAddTodo({ title: trimmedTitle });
    setIsSubmitting(false);

    if (success) {
      setTitle(''); // 入力欄をクリア
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
      <form onSubmit={handleSubmit} className="flex gap-3">
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
      </form>
      {title.length > 80 && (
        <p className="text-sm text-secondary mt-2">
          残り {100 - title.length} 文字
        </p>
      )}
    </div>
  );
}
