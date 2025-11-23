// Todo型定義

/**
 * Todoアイテムの型
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO 8601形式の日付文字列
  completed: boolean;
  createdAt: string; // ISO 8601形式の日付文字列
  updatedAt: string; // ISO 8601形式の日付文字列
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
