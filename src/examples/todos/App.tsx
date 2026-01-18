import React, { useEffect, useState } from 'react';

const TODOS = [
  { id: 0, content: 'You often feel completely overwhelmed' },
  { id: 1, content: 'You sometimes forget to do things that are important' },
  { id: 2, content: 'People have to chase you to get things done' },
  { id: 3, content: 'You find it a struggle to keep to deadlines' },
  { id: 4, content: "If the link in your email doesn't work" }
];

export default function App() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(false);

  // Without useCallback: This is a "new" function every single render
  const getTodos = () => {
    const len = TODOS.length;
    const idx = ((count % len) + len) % len;
    return TODOS[idx];
  };

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', lineHeight: '1.5' }}>
      <h1>Mentorship: The "Broken" Identity Lab</h1>
      <p style={{ color: 'red' }}><strong>Note:</strong> useCallback is removed. Watch the console!</p>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div style={{ flex: 1, border: '2px solid #007bff', padding: 15, borderRadius: 8 }}>
          <h3>1. Relevant State</h3>
          <button onClick={() => setCount(c => c + 1)}>Count +1</button>
          <p><strong>Count:</strong> {count}</p>
        </div>

        <div style={{ 
          flex: 1, 
          border: '2px solid #28a745', 
          padding: 15, 
          borderRadius: 8,
          backgroundColor: otherState ? '#e6ffed' : 'transparent' 
        }}>
          <h3>2. Irrelevant State</h3>
          <button onClick={() => setOtherState(s => !s)}>
            Toggle UI Theme
          </button>
          <p><strong>Theme:</strong> {otherState ? 'Light Green' : 'Default'}</p>
        </div>
      </div>

      <TodoSection getTodos={getTodos} />
    </div>
  );
}

function TodoSection({ getTodos }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const next = getTodos();
    if (!next) return;

    setHistory(prev => {
      if (prev.some(t => t.id === next.id)) return prev;
      return [...prev, next];
    });

    console.log('%c❌ Effect Triggered Unnecessarily!', 'color: red; font-weight: bold;');
  }, [getTodos]);

  return (
    <div style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8, background: '#f9f9f9' }}>
      <h4>History:</h4>
      <ul>
        {history.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </div>
  );
}