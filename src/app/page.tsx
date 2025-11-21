'use client';

import TodoForm from '@/components/TodoForm';
import TodoFilter from '@/components/TodoFilter';
import TodoList from '@/components/TodoList';
import { useTodos } from '@/hooks/useTodos';

// メインページ
export default function Home() {
  const {
    todos,
    filter,
    setFilter,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    stats,
  } = useTodos();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <header className="card p-8 mb-6 animate-fade-in text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] bg-clip-text text-transparent">
            Todo List
          </h1>
          <p className="text-[var(--secondary)] mt-2 text-sm">
            シンプルで使いやすいTodoアプリ
          </p>
        </header>

        {/* 入力エリア */}
        <TodoForm onAddTodo={addTodo} />

        {/* フィルターエリア */}
        <TodoFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          stats={stats}
        />

        {/* Todoリスト */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          isLoading={isLoading}
        />

        {/* フッター */}
        <footer className="mt-8 text-center text-sm text-[var(--secondary)] animate-fade-in">
          <p>データはブラウザのLocal Storageに保存されます</p>
        </footer>
      </div>
    </div>
  );
}
