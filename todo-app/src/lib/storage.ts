import { Todo, TodoInput, TodoUpdate, Category, CategoryInput, CategoryUpdate } from './types';

// Local Storageのキー名
const STORAGE_KEY = 'todos';
const CATEGORIES_KEY = 'categories';
const VERSION_KEY = 'app_version';
const CURRENT_VERSION = '1.1.0';

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
      // v1.1.0: カテゴリと優先度のデフォルト値
      categoryId: input.categoryId,
      priority: input.priority || 'medium',
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

// ============================================
// カテゴリ関連の操作（v1.1.0で追加）
// ============================================

/**
 * Local Storageからすべてのカテゴリを取得
 * @returns カテゴリの配列
 */
export function getCategories(): Category[] {
  try {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (!stored) {
      return [];
    }

    const categories = JSON.parse(stored) as Category[];
    return categories;
  } catch (error) {
    console.error('カテゴリ取得エラー:', error);
    return [];
  }
}

/**
 * すべてのカテゴリをLocal Storageに保存
 * @param categories 保存するカテゴリの配列
 * @returns 成功した場合true、失敗した場合false
 */
export function saveCategories(categories: Category[]): boolean {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    const json = JSON.stringify(categories);
    localStorage.setItem(CATEGORIES_KEY, json);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage容量超過エラー:', error);
        alert('保存容量が不足しています。');
      } else {
        console.error('カテゴリ保存エラー:', error);
      }
    }
    return false;
  }
}

/**
 * 新しいカテゴリを追加
 * @param input カテゴリ作成時の入力データ
 * @returns 作成されたカテゴリ、失敗した場合null
 */
export function addCategory(input: CategoryInput): Category | null {
  try {
    // バリデーション: カテゴリ名は1文字以上50文字以内
    if (!input.name || input.name.length === 0 || input.name.length > 50) {
      console.error('カテゴリ名は1文字以上50文字以内である必要があります');
      return null;
    }

    const newCategory: Category = {
      id: generateId(),
      name: input.name.trim(),
      color: input.color || '#808080',
      createdAt: new Date().toISOString(),
    };

    const categories = getCategories();
    categories.push(newCategory);

    if (saveCategories(categories)) {
      return newCategory;
    }
    return null;
  } catch (error) {
    console.error('カテゴリ追加エラー:', error);
    return null;
  }
}

/**
 * 既存のカテゴリを更新
 * @param id 更新するカテゴリのID
 * @param update 更新データ
 * @returns 更新されたカテゴリ、失敗した場合null
 */
export function updateCategory(id: string, update: CategoryUpdate): Category | null {
  try {
    const categories = getCategories();
    const index = categories.findIndex((cat) => cat.id === id);

    if (index === -1) {
      console.error('指定されたIDのカテゴリが見つかりません:', id);
      return null;
    }

    // カテゴリ名のバリデーション
    if (update.name !== undefined) {
      if (update.name.length === 0 || update.name.length > 50) {
        console.error('カテゴリ名は1文字以上50文字以内である必要があります');
        return null;
      }
    }

    const updatedCategory: Category = {
      ...categories[index],
      ...update,
      name: update.name?.trim() ?? categories[index].name,
    };

    categories[index] = updatedCategory;

    if (saveCategories(categories)) {
      return updatedCategory;
    }
    return null;
  } catch (error) {
    console.error('カテゴリ更新エラー:', error);
    return null;
  }
}

/**
 * カテゴリを削除
 * @param id 削除するカテゴリのID
 * @returns 成功した場合true、失敗した場合false
 */
export function deleteCategory(id: string): boolean {
  try {
    const categories = getCategories();
    const filteredCategories = categories.filter((cat) => cat.id !== id);

    if (filteredCategories.length === categories.length) {
      console.error('指定されたIDのカテゴリが見つかりません:', id);
      return false;
    }

    // カテゴリを削除する際、そのカテゴリを使用しているTodoのcategoryIdをundefinedに設定
    const todos = getTodos();
    const updatedTodos = todos.map((todo) =>
      todo.categoryId === id ? { ...todo, categoryId: undefined } : todo
    );
    saveTodos(updatedTodos);

    return saveCategories(filteredCategories);
  } catch (error) {
    console.error('カテゴリ削除エラー:', error);
    return false;
  }
}

// ============================================
// データマイグレーション（v1.1.0で追加）
// ============================================

/**
 * データをv1.1.0にマイグレーション
 * 既存のTodoにpriorityプロパティを追加
 */
export function migrateToV1_1_0(): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    // バージョン確認
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (currentVersion === CURRENT_VERSION) {
      // 既にマイグレーション済み
      return;
    }

    console.log('v1.1.0へのデータマイグレーションを開始...');

    // Todoのマイグレーション
    const todos = getTodos();
    const migratedTodos = todos.map((todo) => ({
      ...todo,
      // priorityが存在しない場合のみデフォルト値を設定
      priority: todo.priority || 'medium',
      // categoryIdはundefinedのまま（既に型定義上はオプショナル）
    })) as Todo[];

    saveTodos(migratedTodos);

    // バージョン番号を保存
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);

    console.log('マイグレーション完了');
  } catch (error) {
    console.error('マイグレーションエラー:', error);
  }
}

/**
 * アプリ初期化時に実行する関数
 * データマイグレーションを実行
 */
export function initializeApp(): void {
  migrateToV1_1_0();
}
