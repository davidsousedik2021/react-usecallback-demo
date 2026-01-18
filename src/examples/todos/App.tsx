import { useEffect, useMemo, useState } from "react";

type Todo = {
  id: number;
  content: string;
};

const TODOS: Todo[] = [
  { id: 0, content: "You often feel completely overwhelmed" },
  { id: 1, content: "You sometimes forget to do things that are important" },
  { id: 2, content: "People have to chase you to get things done" },
  { id: 3, content: "You find it a struggle to keep to deadlines" },
  { id: 4, content: "If the link in your email doesn't work" },
];

export default function Todos(): JSX.Element {
  console.log("Todos: App rendered");

  const [count, setCount] = useState<number>(0);
  const [reverseCount, setReverseCount] = useState<number>(100);

  // Only changes when `count` changes
  const currentTodo = useMemo<Todo | null>(() => {
    const len = TODOS.length;
    if (len === 0) return null;

    const idx = ((count % len) + len) % len;
    return TODOS[idx];
  }, [count]);

  return (
    <div style={{ padding: 16 }}>
      <h3>Todos</h3>

      {/* Independent reverse counter */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <p style={{ margin: 0 }}>{reverseCount}</p>
        <button onClick={() => setReverseCount(rc => rc - 1)}>
          -1
        </button>
      </div>

      {/* Counter that drives todo selection */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <button onClick={() => setCount(c => c + 1)}>+1</button>
        <span>count: {count}</span>
      </div>

      <TodoSection todo={currentTodo} />
    </div>
  );
}

type TodoSectionProps = {
  todo: Todo | null;
};

function TodoSection({ todo }: TodoSectionProps): JSX.Element {
  const [list, setList] = useState<Todo[]>([]);

  useEffect(() => {
    if (!todo) return;

    setList(prev => {
      if (prev.some(t => t.id === todo.id)) return prev;
      return [...prev, todo];
    });
  }, [todo]);

  return (
    <div style={{ marginTop: 12 }}>
      {list.map(t => (
        <p key={t.id}>{t.content}</p>
      ))}
    </div>
  );
}
