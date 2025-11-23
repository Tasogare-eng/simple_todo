'use client';

import { Todo, Category } from '@/lib/types';
import { useState } from 'react';

// Todoアイテムコンポーネント（v1.1.0で拡張）
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  category?: Category; // v1.1.0: カテゴリ情報
}

export default function TodoItem({ todo, onToggle, onDelete, category }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // v1.1.0: 優先度に応じた色を返す
  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high':
        return '#ef4444'; // 赤
      case 'medium':
        return '#f59e0b'; // 黄色
      case 'low':
        return '#10b981'; // 緑
      default:
        return '#6b7280'; // グレー
    }
  };

  // v1.1.0: 優先度のラベルを返す
  const getPriorityLabel = () => {
    switch (todo.priority) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  // 削除確認ダイアログ
  const handleDelete = async () => {
    if (window.confirm(`「${todo.title}」を削除しますか？`)) {
      setIsDeleting(true);
      // 削除アニメーションのために少し待つ
      await new Promise(resolve => setTimeout(resolve, 200));
      onDelete(todo.id);
    }
  };

  return (
    <li
      className={`card p-4 mb-3 flex items-center justify-between group animate-slide-in hover:shadow-lg transition-all ${
        isDeleting ? 'opacity-0 scale-95' : ''
      }`}
      style={{ transition: 'all 0.2s ease' }}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* チェックボックス */}
        <div className="relative flex-shrink-0">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="w-5 h-5 cursor-pointer accent-[var(--primary)] rounded"
          />
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className={`text-base font-medium transition-all ${
              todo.completed
                ? 'line-through opacity-60'
                : 'text-[var(--foreground)]'
            }`}
          >
            {todo.title}
          </span>

          {todo.description && (
            <span className="text-sm text-[var(--secondary)] mt-1 truncate">
              {todo.description}
            </span>
          )}

          {todo.deadline && (
            <span className="text-xs text-[var(--secondary)] mt-1 flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              期限: {new Date(todo.deadline).toLocaleDateString('ja-JP')}
            </span>
          )}

          {/* v1.1.0: カテゴリと優先度の表示 */}
          <div className="flex items-center gap-2 mt-2">
            {/* 優先度バッジ */}
            <span
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{
                backgroundColor: `${getPriorityColor()}20`,
                color: getPriorityColor(),
              }}
            >
              優先度: {getPriorityLabel()}
            </span>

            {/* カテゴリバッジ */}
            {category && (
              <span
                className="text-xs px-2 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 削除ボタン */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="btn-danger ml-3 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity disabled:opacity-50"
      >
        {isDeleting ? '削除中...' : '削除'}
      </button>
    </li>
  );
}
