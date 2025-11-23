'use client';

import { TodoFilter as TodoFilterType, Category } from '@/lib/types';

// フィルターボタンコンポーネント（v1.1.0で拡張）
interface TodoFilterProps {
  currentFilter: TodoFilterType;
  onFilterChange: (filter: TodoFilterType) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
  // v1.1.0で追加
  categories?: Category[];
  categoryFilter?: string | null;
  onCategoryFilterChange?: (categoryId: string | null) => void;
  prioritySort?: boolean;
  onPrioritySortToggle?: () => void;
}

export default function TodoFilter({
  currentFilter,
  onFilterChange,
  stats,
  categories = [],
  categoryFilter = null,
  onCategoryFilterChange,
  prioritySort = false,
  onPrioritySortToggle,
}: TodoFilterProps) {
  // フィルターボタンの設定
  const filters: Array<{
    value: TodoFilterType;
    label: string;
    count: number;
  }> = [
    { value: 'all', label: '全て', count: stats.total },
    { value: 'active', label: '未完了', count: stats.active },
    { value: 'completed', label: '完了済み', count: stats.completed },
  ];

  return (
    <div className="card p-5 mb-4 animate-fade-in space-y-4">
      {/* 完了状態フィルター */}
      <div>
        <h3 className="text-sm font-medium text-secondary mb-2">表示フィルター</h3>
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => {
            const isActive = currentFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-md scale-105'
                      : 'bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)] hover:scale-105'
                  }
                `}
              >
                {filter.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? 'bg-white/20'
                      : 'bg-[var(--background)] text-[var(--secondary)]'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* v1.1.0: カテゴリフィルター */}
      {onCategoryFilterChange && categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-secondary mb-2">カテゴリフィルター</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onCategoryFilterChange(null)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  categoryFilter === null
                    ? 'bg-[var(--primary)] text-white shadow-md'
                    : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]'
                }
              `}
            >
              全カテゴリ
            </button>
            <button
              onClick={() => onCategoryFilterChange('uncategorized')}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  categoryFilter === 'uncategorized'
                    ? 'bg-[var(--primary)] text-white shadow-md'
                    : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]'
                }
              `}
            >
              未分類
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryFilterChange(cat.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                  ${
                    categoryFilter === cat.id
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]'
                  }
                `}
              >
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* v1.1.0: 優先度ソート */}
      {onPrioritySortToggle && (
        <div>
          <h3 className="text-sm font-medium text-secondary mb-2">並び順</h3>
          <button
            onClick={onPrioritySortToggle}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${
                prioritySort
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)]'
              }
            `}
          >
            {prioritySort ? '✓ 優先度順' : '優先度順で並べる'}
          </button>
        </div>
      )}
    </div>
  );
}
