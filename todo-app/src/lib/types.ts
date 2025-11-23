// Todo型定義

/**
 * 優先度の型
 */
export type Priority = 'high' | 'medium' | 'low';

/**
 * Todoアイテムの型（v1.1.0で拡張）
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO 8601形式の日付文字列
  completed: boolean;
  createdAt: string; // ISO 8601形式の日付文字列
  updatedAt: string; // ISO 8601形式の日付文字列
  // v1.1.0で追加
  categoryId?: string; // カテゴリID（未分類の場合はundefined）
  priority: Priority; // 優先度（デフォルト: 'medium'）
}

/**
 * Todoフィルターの型
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * Todo作成時の入力データ型（idとタイムスタンプは自動生成）
 */
export type TodoInput = Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'completed'>;

/**
 * Todo更新時の入力データ型（部分更新可能）
 */
export type TodoUpdate = Partial<Omit<Todo, 'id' | 'createdAt'>>;

/**
 * カテゴリの型（v1.1.0で追加）
 */
export interface Category {
  id: string;
  name: string;
  color: string; // カラーコード（例: #FF5733）
  createdAt: string; // ISO 8601形式の日付文字列
}

/**
 * カテゴリ作成時の入力データ型（idとタイムスタンプは自動生成）
 */
export type CategoryInput = Omit<Category, 'id' | 'createdAt'>;

/**
 * カテゴリ更新時の入力データ型（部分更新可能）
 */
export type CategoryUpdate = Partial<Omit<Category, 'id' | 'createdAt'>>;
