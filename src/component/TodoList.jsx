import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getTodos, createTodo, updateTodo, toggleTodoStatus, deleteTodo
} from "../api/todos";
import TodoItem from "./TodoItem";

const toLocalISODate = (d = new Date()) => {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
};

export default function TodoList({ mode = "all", dateISO, compact = false }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  }, []);
  const userId = user?.userId; 

  const todayISO = new Date().toISOString().slice(0,10);
  const listForRender = dateISO
    ? todos.filter(t => t.date === dateISO)              
    : (mode === "today"
        ? todos.filter(t => t.date === todayISO)         
        : todos); 

  const load = useCallback(async () => {
    if(!userId) {
        setTodos([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    setErr("");
    try {
      const data = await getTodos({ userId, mode }); 
      setTodos(data);
    } catch (e) {
      setErr(e?.message || "투두 리스트 불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, [userId, mode]);

  useEffect(() => { load(); }, [load]);

  async function onAdd(e) {
    e.preventDefault();
    const content = title.trim();
    if (!content || !userId ) return;

    const temp = {
      id: `tmp-${Date.now()}`,
      title: content,
      completed: false,
      date: dateISO || toLocalISODate(),
    };
    setTodos(prev => [temp, ...prev]);
    setTitle("");

    try {
      const saved = await createTodo({ userId, content });
      setTodos(prev => prev.map(t => t.id === temp.id ? saved : t));
    } catch (e) {
      setTodos(prev => prev.filter(t => t.id !== temp.id));
      setErr(e?.message || "추가 실패");
    }
  }

  async function onToggle(id, next) {
    const prev = todos;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: next } : t));
    try {
      await toggleTodoStatus({ todoId: id, userId });
    } catch (e) {
      setTodos(prev);
      setErr(e?.message || "상태 변경 실패");
    }
  }

  async function onEdit(id, updates) {
    const prev = todos;
    const nextTitle = updates.title ?? "";
    setTodos(prev => prev.map(t => t.id === id ? { ...t, title: nextTitle } : t));
    try {
      await updateTodo({
        userId,
        todoId: id,
        content: nextTitle
      });
    } catch (e) {
      setTodos(prev);
      setErr(e?.message || "수정 실패");
    }
  }

  async function onDelete(id) {
    const prev = todos;
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await deleteTodo({ todoId: id, userId });
    } catch (e) {
      setTodos(prev);
      setErr(e?.message || "삭제 실패");
    }
  }


  if (loading) return <div>Loading…</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {!compact && (
        <form onSubmit={onAdd} style={{ display: "flex", gap: 8 }}>
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
          <button
            type="submit"
            disabled={!title.trim()}
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              background: title.trim() ? "#ed5454" : "#f0a5a5",
              color: "#fff",
              border: 0,
              cursor: title.trim() ? "pointer" : "not-allowed"
            }}
          >
            추가
          </button>
        </form>
      )}

      {!!err && <div style={{ color: "#ef4444", fontSize: 13 }}>{err}</div>}

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {listForRender.map(t => (
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
        {!listForRender.length && <li style={{ opacity: .7 }}>할 일이 없습니다.</li>}
      </ul>
    </div>
  );
}
