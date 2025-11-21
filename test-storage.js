// Local Storage機能テストスクリプト
// ブラウザのコンソールで実行してください

console.log('=== Todo App Storage Test ===\n');

// 1. 初期状態の確認
console.log('1. 初期状態の確認');
const initialData = localStorage.getItem('todos');
console.log('Initial data:', initialData);
console.log('✓ Local Storageアクセス成功\n');

// 2. テストデータの作成
console.log('2. テストデータの作成');
const testTodos = [
  {
    id: 'test-1',
    title: 'テストTodo1',
    description: 'これはテスト用のTodoです',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'test-2',
    title: 'テストTodo2',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

localStorage.setItem('todos', JSON.stringify(testTodos));
console.log('✓ テストデータを保存\n');

// 3. データの読み込み確認
console.log('3. データの読み込み確認');
const loadedData = JSON.parse(localStorage.getItem('todos'));
console.log('Loaded todos:', loadedData);
console.log(`✓ ${loadedData.length}件のTodoを読み込み\n`);

// 4. データのバリデーション
console.log('4. データのバリデーション');
let validationPassed = true;

loadedData.forEach((todo, index) => {
  if (!todo.id || !todo.title || typeof todo.completed !== 'boolean') {
    console.error(`✗ Todo ${index + 1} のバリデーション失敗`);
    validationPassed = false;
  }
});

if (validationPassed) {
  console.log('✓ すべてのTodoが正しい形式です\n');
}

// 5. フィルタリングテスト
console.log('5. フィルタリングテスト');
const activeTodos = loadedData.filter(todo => !todo.completed);
const completedTodos = loadedData.filter(todo => todo.completed);
console.log(`未完了: ${activeTodos.length}件`);
console.log(`完了済み: ${completedTodos.length}件`);
console.log('✓ フィルタリング機能OK\n');

// 6. クリーンアップ
console.log('6. クリーンアップ');
if (confirm('テストデータを削除しますか？')) {
  localStorage.removeItem('todos');
  console.log('✓ テストデータを削除');
} else {
  console.log('テストデータはそのまま残ります');
}

console.log('\n=== Test Complete ===');
console.log('ページをリロードしてアプリの動作を確認してください。');
