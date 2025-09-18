// src/components/TodoList.jsx
import { useEffect, useState } from "react";
import {
  getTodos, createTodo, updateTodo, toggleTodoStatus, deleteTodo
} from "../api/todos";
import TodoItem from "./TodoItem";

export default function TodoList({ mode = "all", dateISO, compact = false }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getTodos({
        today: mode === "today",
        date: mode === "date" ? dateISO : undefined,
      });
      setTodos(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [mode, dateISO]);

  async function onAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const temp = { id: `tmp-${Date.now()}`, title: title.trim(), completed: false };
    setTodos((prev) => [temp, ...prev]);
    setTitle("");
    try {
      const saved = await createTodo({ title: temp.title });
      setTodos((prev) => prev.map(t => t.id === temp.id ? saved : t));
    } catch {
      setTodos((prev) => prev.filter(t => t.id !== temp.id));
    }
  }

  async function onToggle(id, next) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: next } : t));
    await toggleTodoStatus(id, next).catch(() => load());
  }

  async function onEdit(id, updates) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    await updateTodo(id, updates).catch(() => load());
  }

  async function onDelete(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
    await deleteTodo(id).catch(() => load());
  }

  if (loading) return <div>불러오는 중…</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {!compact && (
        <form onSubmit={onAdd} style={{ display: "flex", gap: 5 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="오늘의 할 일은?"
            style={{ 
                    border: "none",
                    borderRadius: "2px",
                    backgroundColor: "#F5F5F5",
                    color: "#000",
                    cursor: "pointer",
                    fontSize: "15px"
                    }}
          />
          <button type="submit"
                  style={{ 
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#ed5454ff",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px"
                    }}>추가</button>
        </form>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {todos.map((t) => (
          <TodoItem
            key={t.id}
            id={t.id}
            title={t.title}
            completed={t.completed}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
        {!todos.length && <li style={{ opacity: 0.7 }}>할 일이 없습니다.</li>}
      </ul>
    </div>
  );
}