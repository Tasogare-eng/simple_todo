'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoInput, TodoUpdate, TodoFilter } from '@/lib/types';
import {
  getTodos,
  addTodo as addTodoToStorage,
  updateTodo as updateTodoInStorage,
  deleteTodo as deleteTodoFromStorage,
  toggleTodoCompleted,
} from '@/lib/storage';

/**
 * Todo管理用カスタムフック（v1.1.0で拡張）
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null); // v1.1.0: カテゴリフィルタ
  const [prioritySort, setPrioritySort] = useState(false); // v1.1.0: 優先度ソート
  const [isLoading, setIsLoading] = useState(true);

  // 初回マウント時にLocal StorageからTodoを読み込み
  useEffect(() => {
    const loadedTodos = getTodos();
    setTodos(loadedTodos);
    setIsLoading(false);
  }, []);

  // フィルターに基づいてTodoをフィルタリング
  let filteredTodos = todos.filter((todo) => {
    // 完了状態フィルタ
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    // v1.1.0: カテゴリフィルタ
    if (categoryFilter !== null) {
      if (categoryFilter === 'uncategorized') {
        // 未分類フィルタ
        if (todo.categoryId !== undefined) return false;
      } else {
        // 特定カテゴリフィルタ
        if (todo.categoryId !== categoryFilter) return false;
      }
    }

    return true;
  });

  // v1.1.0: 優先度ソート
  if (prioritySort) {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filteredTodos = [...filteredTodos].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // Todoを追加
  const addTodo = useCallback((input: TodoInput) => {
    const newTodo = addTodoToStorage(input);
    if (newTodo) {
      setTodos((prev) => [...prev, newTodo]);
      return true;
    }
    return false;
  }, []);

  // Todoを更新
  const updateTodo = useCallback((id: string, update: TodoUpdate) => {
    const updatedTodo = updateTodoInStorage(id, update);
    if (updatedTodo) {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      return true;
    }
    return false;
  }, []);

  // Todoを削除
  const deleteTodo = useCallback((id: string) => {
    const success = deleteTodoFromStorage(id);
    if (success) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      return true;
    }
    return false;
  }, []);

  // Todoの完了状態を切り替え
  const toggleTodo = useCallback((id: string) => {
    const updatedTodo = toggleTodoCompleted(id);
    if (updatedTodo) {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      return true;
    }
    return false;
  }, []);

  // 統計情報
  const stats = {
    total: todos.length,
    active: todos.filter((todo) => !todo.completed).length,
    completed: todos.filter((todo) => todo.completed).length,
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    categoryFilter, // v1.1.0
    setCategoryFilter, // v1.1.0
    prioritySort, // v1.1.0
    setPrioritySort, // v1.1.0
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    stats,
  };
}
