'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryInput, CategoryUpdate } from '@/lib/types';
import {
  getCategories,
  addCategory as addCategoryToStorage,
  updateCategory as updateCategoryInStorage,
  deleteCategory as deleteCategoryFromStorage,
} from '@/lib/storage';

/**
 * カテゴリ管理用カスタムフック（v1.1.0で追加）
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初回マウント時にLocal Storageからカテゴリを読み込み
  useEffect(() => {
    const loadedCategories = getCategories();
    setCategories(loadedCategories);
    setIsLoading(false);
  }, []);

  // カテゴリを追加
  const addCategory = useCallback((input: CategoryInput) => {
    const newCategory = addCategoryToStorage(input);
    if (newCategory) {
      setCategories((prev) => [...prev, newCategory]);
      return true;
    }
    return false;
  }, []);

  // カテゴリを更新
  const updateCategory = useCallback((id: string, update: CategoryUpdate) => {
    const updatedCategory = updateCategoryInStorage(id, update);
    if (updatedCategory) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );
      return true;
    }
    return false;
  }, []);

  // カテゴリを削除
  const deleteCategory = useCallback((id: string) => {
    const success = deleteCategoryFromStorage(id);
    if (success) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    }
    return false;
  }, []);

  // IDからカテゴリを取得
  const getCategoryById = useCallback(
    (id: string | undefined): Category | undefined => {
      if (!id) return undefined;
      return categories.find((cat) => cat.id === id);
    },
    [categories]
  );

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
}
