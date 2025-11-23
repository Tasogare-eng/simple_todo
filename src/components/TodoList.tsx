'use client';

import { Todo } from '@/lib/types';
import TodoItem from './TodoItem';

// Todoリストコンポーネント
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  isLoading,
}: TodoListProps) {
  // ローディング中
  if (isLoading) {
    return (
      <div className="card p-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>
          <p className="text-[var(--secondary)] font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  // Todoが空の場合
  if (todos.length === 0) {
    return (
      <div className="card p-12 animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-4">
          <svg
            className="w-20 h-20 text-[var(--secondary)] opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <div className="text-center">
            <p className="text-lg font-medium text-[var(--foreground)] mb-1">
              Todoがありません
            </p>
            <p className="text-sm text-[var(--secondary)]">
              新しいTodoを追加してください
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 animate-fade-in">
      <ul className="list-none space-y-0">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
