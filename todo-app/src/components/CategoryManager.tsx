'use client';

import { useState, FormEvent } from 'react';
import { Category, CategoryInput } from '@/lib/types';

// カテゴリ管理コンポーネント（v1.1.0で追加）
interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (input: CategoryInput) => boolean;
  onDeleteCategory: (id: string) => boolean;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

// プリセットカラー
const PRESET_COLORS = [
  '#FF5733', // 赤
  '#33FF57', // 緑
  '#3357FF', // 青
  '#FF33F5', // ピンク
  '#F5FF33', // 黄色
  '#33FFF5', // シアン
  '#FF8C33', // オレンジ
  '#8C33FF', // 紫
];

export default function CategoryManager({
  categories,
  onAddCategory,
  onDeleteCategory,
  selectedCategoryId,
  onSelectCategory,
}: CategoryManagerProps) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // カテゴリ追加フォーム送信
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      alert('カテゴリ名を入力してください');
      return;
    }

    if (trimmedName.length > 50) {
      alert('カテゴリ名は50文字以内で入力してください');
      return;
    }

    setIsSubmitting(true);
    const success = onAddCategory({ name: trimmedName, color: categoryColor });
    setIsSubmitting(false);

    if (success) {
      setCategoryName('');
      // 次のカテゴリのためにカラーを変更
      const currentIndex = PRESET_COLORS.indexOf(categoryColor);
      const nextIndex = (currentIndex + 1) % PRESET_COLORS.length;
      setCategoryColor(PRESET_COLORS[nextIndex]);
    } else {
      alert('カテゴリの追加に失敗しました');
    }
  };

  // カテゴリ削除
  const handleDelete = (id: string, name: string) => {
    if (confirm(`カテゴリ「${name}」を削除しますか？\nこのカテゴリを使用しているTodoは未分類になります。`)) {
      const success = onDeleteCategory(id);
      if (!success) {
        alert('カテゴリの削除に失敗しました');
      }
      // 削除したカテゴリが選択されていた場合、フィルタをクリア
      if (selectedCategoryId === id) {
        onSelectCategory(null);
      }
    }
  };

  return (
    <div className="card p-5 mb-4 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">カテゴリ管理</h2>

      {/* カテゴリ追加フォーム */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="新しいカテゴリ名..."
            className="input flex-1 text-base"
            maxLength={50}
            disabled={isSubmitting}
          />
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={categoryColor}
              onChange={(e) => setCategoryColor(e.target.value)}
              className="w-12 h-10 rounded border-2 border-border cursor-pointer"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary min-w-[80px] disabled:opacity-50"
            >
              {isSubmitting ? '追加中...' : '追加'}
            </button>
          </div>
        </div>
        {categoryName.length > 40 && (
          <p className="text-sm text-secondary">
            残り {50 - categoryName.length} 文字
          </p>
        )}
      </form>

      {/* カテゴリ一覧 */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-secondary text-sm">カテゴリがありません</p>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-surface rounded border border-border hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="text-error hover:text-error/80 text-sm font-medium px-3 py-1 rounded hover:bg-error/10 transition-colors"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>

      {/* プリセットカラーパレット */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-secondary mb-2">プリセットカラー:</p>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setCategoryColor(color)}
              className={`w-8 h-8 rounded border-2 transition-all ${
                categoryColor === color
                  ? 'border-primary scale-110'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ backgroundColor: color }}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
