import { http } from "./axios";

const base = "/api/v1/todos"
const map = (dto) => ({
  id: dto.todoId,
  title: dto.content,
  completed: !!dto.done,
  date: (dto.date ?? "").slice(0, 10),
});

const toLocalISODate = (d = new Date()) => {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
};

export async function getTodos({ userId, mode = "all" }) {
  if (!userId) throw new Error("userId가 필요합니다.");
  const path = mode === "today" ? `${base}/list/today` : `${base}/list`;
  const { data } = await http.get(path, { params: { userId } });
  return (data?.todoList ?? []).map(map);
}

export async function createTodo({ userId, content }) {
  const { data } = await http.post(`${base}/register`, {
    userId, content
  });
  console.log("[debug] createTodo response:", data);
  return data?.todoId ? map(data) : {
    id: Date.now(), title: content, completed: false, date: toLocalISODate(),
  };
}

export async function toggleTodoStatus({ todoId, userId }) {
  try {
    await http.patch(`${base}/${todoId}/status`, null, { params: { userId } });
  } catch (e) {
    if (e.response?.status === 405) {
      await http.post(`${base}/${todoId}/status`, null, { params: { userId } });
    } else throw e;
  }
  return true;
}

export async function updateTodo({ userId, todoId, content }) {
  const { data } = await http.patch(`${base}/patch`, {
    userId, todoId, content
  });
  return data ?? null;
}

export async function deleteTodo({ todoId, userId }) {
  await http.delete(`${base}/${todoId}/delete`, { params: { userId } });
  return true;
}

