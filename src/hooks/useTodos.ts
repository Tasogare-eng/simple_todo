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
 * Todo管理用カスタムフック
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isLoading, setIsLoading] = useState(true);

  // 初回マウント時にLocal StorageからTodoを読み込み
  useEffect(() => {
    const loadedTodos = getTodos();
    setTodos(loadedTodos);
    setIsLoading(false);
  }, []);

  // フィルターに基づいてTodoをフィルタリング
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'の場合
  });

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
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    stats,
  };
}
