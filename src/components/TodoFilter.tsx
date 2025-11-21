'use client';

import { TodoFilter as TodoFilterType } from '@/lib/types';

// フィルターボタンコンポーネント
interface TodoFilterProps {
  currentFilter: TodoFilterType;
  onFilterChange: (filter: TodoFilterType) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export default function TodoFilter({
  currentFilter,
  onFilterChange,
  stats,
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
    <div className="card p-5 mb-4 animate-fade-in">
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
  );
}
