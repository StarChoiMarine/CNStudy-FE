//mockdata
let mockTodos = [
  { id: 1, title: "테스트 1(mockdata)", completed: false },
  { id: 2, title: "테스트 2(mockdata)", completed: true },
  { id: 3, title: "테스트 3(mockdata)", completed: false },
];

// 전체 불러오기
export async function getTodos() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockTodos]), 300); 
  });
}

// 추가
export async function createTodo(todo) {
  const newTodo = { id: Date.now(), completed: false, ...todo };
  mockTodos = [newTodo, ...mockTodos];
  return newTodo;
}

// 수정
export async function updateTodo(id, updates) {
  mockTodos = mockTodos.map((t) => (t.id === id ? { ...t, ...updates } : t));
  return mockTodos.find((t) => t.id === id);
}

// 완료 토글
export async function toggleTodoStatus(id, completed) {
  return updateTodo(id, { completed });
}

// 삭제
export async function deleteTodo(id) {
  mockTodos = mockTodos.filter((t) => t.id !== id);
  return true;
}