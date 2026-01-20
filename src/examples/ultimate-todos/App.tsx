import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from "react";

export default function UltimateTodos() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const [editingId, setEditingId] = useState<string | null>(null);

  const draggedIdRef = useRef<string | null>(null);

  // load once
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ultra-dnd-todos");
      if (saved) setTodos(JSON.parse(saved));
    } catch {}
  }, []);

  // save on change
  useEffect(() => {
    try {
      localStorage.setItem("ultra-dnd-todos", JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const addTodo = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = inputValue.trim();
      if (!text) return;

      const id =
        globalThis.crypto?.randomUUID?.() ?? String(Date.now());

      setTodos((prev) => [
        ...prev,
        { id, text, completed: false, important: false },
      ]);
      setInputValue("");
    },
    [inputValue]
  );

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }, []);

  const toggleImportant = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, important: !t.important } : t
      )
    );
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setEditingId((prev) => (prev === id ? null : prev));
  }, []);

  const updateTodo = useCallback((id: string, text: string) => {
    const value = text.trim();
    if (!value) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: value } : t))
    );
    setEditingId(null);
  }, []);

  const handleDragStart = useCallback((id: string) => {
    draggedIdRef.current = id;
  }, []);

  const handleDragEnter = useCallback((targetId: string) => {
    const draggedId = draggedIdRef.current;
    if (!draggedId || draggedId === targetId) return;

    setTodos((prev) => {
      const from = prev.findIndex((t) => t.id === draggedId);
      const to = prev.findIndex((t) => t.id === targetId);
      if (from < 0 || to < 0) return prev;

      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    draggedIdRef.current = null;
  }, []);

  const filteredTodos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? todos.filter((t) => t.text.toLowerCase().includes(q)) : todos;
  }, [todos, query]);

  return (
    <div
      style={{
        padding: 40,
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#f4f7f6" : "#121212",
        color: theme === "light" ? "#333" : "#eee",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Pro Todo Lab</h1>
          <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </header>

        <form onSubmit={addTodo} style={{ display: "flex", gap: 10, margin: "20px 0" }}>
          <input
            style={{ flex: 1, padding: 10 }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs doing?"
          />
          <button>Add</button>
        </form>

        <input
          style={{ width: "100%", padding: 10, marginBottom: 20 }}
          placeholder="🔍 Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingId === todo.id}
              onToggle={toggleTodo}
              onImportant={toggleImportant}
              onRemove={removeTodo}
              onUpdate={updateTodo}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
              setEditing={() => setEditingId(todo.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TodoItem = memo(function TodoItem({
  todo,
  isEditing,
  onToggle,
  onImportant,
  onRemove,
  onUpdate,
  onDragStart,
  onDragEnter,
  onDragEnd,
  setEditing,
  onCancel,
}: any) {
  const [editText, setEditText] = useState(todo.text);

  useEffect(() => {
    if (isEditing) setEditText(todo.text);
  }, [todo.text, isEditing]);

  const style = {
    display: "flex",
    gap: 12,
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 6,
    background: todo.important ? "#fff9c4" : isEditing ? "#e3f2fd" : "#fff",
  };

  if (isEditing) {
    return (
      <div style={style}>
        <input value={editText} onChange={(e) => setEditText(e.target.value)} />
        <button onClick={() => onUpdate(todo.id, editText)}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={() => onDragStart(todo.id)}
      onDragEnter={() => onDragEnter(todo.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      style={style}
    >
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      <span style={{ flex: 1 }}>{todo.text}</span>
      <button onClick={() => onImportant(todo.id)}>{todo.important ? "★" : "☆"}</button>
      <button onClick={setEditing}>Edit</button>
      <button onClick={() => onRemove(todo.id)}>✕</button>
    </div>
  );
});
