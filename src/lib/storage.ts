import { Todo, TodoInput, TodoUpdate } from './types';

// Local Storageのキー名
const STORAGE_KEY = 'todos';

/**
 * Local StorageからすべてのTodoを取得
 * @returns Todoの配列
 */
export function getTodos(): Todo[] {
  try {
    // SSR対策: windowオブジェクトが存在するか確認
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const todos = JSON.parse(stored) as Todo[];
    return todos;
  } catch (error) {
    console.error('Todo取得エラー:', error);
    // JSON parseエラーの場合は空配列を返す
    return [];
  }
}

/**
 * すべてのTodoをLocal Storageに保存
 * @param todos 保存するTodoの配列
 * @returns 成功した場合true、失敗した場合false
 */
export function saveTodos(todos: Todo[]): boolean {
  try {
    // SSR対策: windowオブジェクトが存在するか確認
    if (typeof window === 'undefined') {
      return false;
    }

    const json = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch (error) {
    // Storage quota超過エラーなどをキャッチ
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage容量超過エラー:', error);
        alert('保存容量が不足しています。不要なTodoを削除してください。');
      } else {
        console.error('Todo保存エラー:', error);
      }
    }
    return false;
  }
}

/**
 * 新しいTodoを追加
 * @param input Todo作成時の入力データ
 * @returns 作成されたTodo、失敗した場合null
 */
export function addTodo(input: TodoInput): Todo | null {
  try {
    // バリデーション: タイトルは1文字以上100文字以内
    if (!input.title || input.title.length === 0 || input.title.length > 100) {
      console.error('タイトルは1文字以上100文字以内である必要があります');
      return null;
    }

    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description?.trim(),
      deadline: input.deadline,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    const todos = getTodos();
    todos.push(newTodo);

    if (saveTodos(todos)) {
      return newTodo;
    }
    return null;
  } catch (error) {
    console.error('Todo追加エラー:', error);
    return null;
  }
}

/**
 * 既存のTodoを更新
 * @param id 更新するTodoのID
 * @param update 更新データ
 * @returns 更新されたTodo、失敗した場合null
 */
export function updateTodo(id: string, update: TodoUpdate): Todo | null {
  try {
    const todos = getTodos();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      console.error('指定されたIDのTodoが見つかりません:', id);
      return null;
    }

    // タイトルのバリデーション
    if (update.title !== undefined) {
      if (update.title.length === 0 || update.title.length > 100) {
        console.error('タイトルは1文字以上100文字以内である必要があります');
        return null;
      }
    }

    const updatedTodo: Todo = {
      ...todos[index],
      ...update,
      title: update.title?.trim() ?? todos[index].title,
      description: update.description?.trim() ?? todos[index].description,
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updatedTodo;

    if (saveTodos(todos)) {
      return updatedTodo;
    }
    return null;
  } catch (error) {
    console.error('Todo更新エラー:', error);
    return null;
  }
}

/**
 * Todoを削除
 * @param id 削除するTodoのID
 * @returns 成功した場合true、失敗した場合false
 */
export function deleteTodo(id: string): boolean {
  try {
    const todos = getTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== id);

    if (filteredTodos.length === todos.length) {
      console.error('指定されたIDのTodoが見つかりません:', id);
      return false;
    }

    return saveTodos(filteredTodos);
  } catch (error) {
    console.error('Todo削除エラー:', error);
    return false;
  }
}

/**
 * Todoの完了状態を切り替え
 * @param id 切り替えるTodoのID
 * @returns 更新されたTodo、失敗した場合null
 */
export function toggleTodoCompleted(id: string): Todo | null {
  try {
    const todos = getTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      console.error('指定されたIDのTodoが見つかりません:', id);
      return null;
    }

    return updateTodo(id, { completed: !todo.completed });
  } catch (error) {
    console.error('Todo完了状態切り替えエラー:', error);
    return null;
  }
}

/**
 * すべてのTodoを削除（テスト用）
 * @returns 成功した場合true、失敗した場合false
 */
export function clearAllTodos(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Todo全削除エラー:', error);
    return false;
  }
}

/**
 * ユニークなIDを生成（タイムスタンプ + ランダム文字列）
 * @returns 生成されたID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
