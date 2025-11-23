'use client';

import { useEffect, useState } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoFilter from '@/components/TodoFilter';
import TodoList from '@/components/TodoList';
import CategoryManager from '@/components/CategoryManager';
import { useTodos } from '@/hooks/useTodos';
import { useCategories } from '@/hooks/useCategories';
import { initializeApp } from '@/lib/storage';

// メインページ（v1.1.0で拡張）
export default function Home() {
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // データマイグレーション実行（v1.1.0）
  useEffect(() => {
    initializeApp();
  }, []);

  // Todoフック
  const {
    todos,
    filter,
    setFilter,
    categoryFilter, // v1.1.0
    setCategoryFilter, // v1.1.0
    prioritySort, // v1.1.0
    setPrioritySort, // v1.1.0
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    stats,
  } = useTodos();

  // カテゴリフック（v1.1.0）
  const {
    categories,
    addCategory,
    deleteCategory,
    getCategoryById,
  } = useCategories();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <header className="card p-8 mb-6 animate-fade-in text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] bg-clip-text text-transparent">
            Todo List
          </h1>
          <p className="text-[var(--secondary)] mt-2 text-sm">
            シンプルで使いやすいTodoアプリ v1.1.0
          </p>
        </header>

        {/* v1.1.0: カテゴリ管理ボタン */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="btn btn-primary"
          >
            {showCategoryManager ? 'カテゴリ管理を閉じる' : 'カテゴリ管理'}
          </button>
        </div>

        {/* v1.1.0: カテゴリ管理パネル */}
        {showCategoryManager && (
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
            selectedCategoryId={categoryFilter}
            onSelectCategory={setCategoryFilter}
          />
        )}

        {/* 入力エリア */}
        <TodoForm onAddTodo={addTodo} categories={categories} />

        {/* フィルターエリア（v1.1.0で拡張） */}
        <TodoFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          stats={stats}
          categories={categories}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          prioritySort={prioritySort}
          onPrioritySortToggle={() => setPrioritySort(!prioritySort)}
        />

        {/* Todoリスト（v1.1.0で拡張） */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          isLoading={isLoading}
          getCategoryById={getCategoryById}
        />

        {/* フッター */}
        <footer className="mt-8 text-center text-sm text-[var(--secondary)] animate-fade-in">
          <p>データはブラウザのLocal Storageに保存されます</p>
          <p className="mt-1 text-xs">v1.1.0 - カテゴリ & 優先度機能対応</p>
        </footer>
      </div>
    </div>
  );
}
