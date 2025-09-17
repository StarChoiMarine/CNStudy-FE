import { useState } from "react";

export default function TodoItem({ id, title, completed, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);

  function handleEdit(e) {
    e.preventDefault();
    onEdit(id, { title: value });
    setEditing(false);
  }

  return (
    <li style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => onToggle(id, e.target.checked)}
      />

      {editing ? (
        <form onSubmit={handleEdit} style={{ flex: 1 }}>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </form>
      ) : (
        <span
          style={{
            flex: 1,
            textDecoration: completed ? "line-through" : "none",
            color: completed ? "gray" : "black",
          }}
          onDoubleClick={() => setEditing(true)}
        >
          {title}
        </span>
      )}

      <button onClick={() => onDelete(id)} 
            style={{ 
                marginRight: "30px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#ef6c6cff",
                color: "#fff",
                cursor: "pointer",
                fontSize: "12px"
                }}>삭제</button>
    </li>
  );
}