'use client';

import { useState, useEffect } from 'react';

/**
 * Local Storageと同期するカスタムフック
 * @param key Local Storageのキー
 * @param initialValue 初期値
 * @returns [値, 更新関数]のタプル
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // SSR対策: 初回レンダリング時は初期値を使用
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのみLocal Storageから読み込み
  useEffect(() => {
    setIsClient(true);

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Local Storage読み込みエラー (key: ${key}):`, error);
      // エラーが発生した場合は初期値を使用
    }
  }, [key]);

  // 値を更新する関数
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // 関数の場合は現在の値を渡して実行
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // 状態を更新
      setStoredValue(valueToStore);

      // クライアントサイドでのみLocal Storageに保存
      if (isClient && typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Storage quota超過などのエラーをキャッチ
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          console.error('Storage容量超過エラー:', error);
          alert('保存容量が不足しています。データを削減してください。');
        } else {
          console.error(`Local Storage保存エラー (key: ${key}):`, error);
        }
      }
    }
  };

  return [storedValue, setValue];
}
