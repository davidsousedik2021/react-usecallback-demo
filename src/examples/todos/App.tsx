
// src/App.js
import React, { useCallback, useEffect, useState } from 'react'

// Static data
const TODOS = [
  { id: 0, content: 'You often feel completely overwhelmed' },
  { id: 1, content: 'You sometimes forget to do things that are important' },
  { id: 2, content: 'People have to chase you to get things done' },
  { id: 3, content: 'You find it a struggle to keep to deadlines' },
  { id: 4, content: "If the link in your email doesn't work" }
]

export default function App() {
  const [count, setCount] = useState(0)

  // Memoize the function so its identity only changes when `count` changes.
  // Also guard the index with wrap-around to avoid out-of-bounds.
  const getTodos = useCallback(() => {
    const len = TODOS.length
    if (len === 0) return null
    const idx = ((count % len) + len) % len
    return TODOS[idx]
  }, [count])

  return (
    <div className="App" style={{ padding: 16, fontFamily: 'sans-serif' }}>
      <h2>Todos (function-prop version)</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <button type="button" onClick={() => setCount(c => c + 1)}>+1</button>
        <button type="button" onClick={() => setCount(c => c - 1)}>-1</button>
        <span>count: {count}</span>
      </div>

      <TodoSection getTodos={getTodos} />
    </div>
  )
}

function TodoSection({ getTodos }) {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    const next = getTodos()

    setTodos(prev => {
      if (!next) return prev
      // Optional de-dup by id so cycling doesn't append the same item repeatedly
      if (prev.some(t => t.id === next.id)) return prev
      return [...prev, next]
    })

    console.log('getTodos function called')
  }, [getTodos])

  return (
    <div>
      {todos.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No items yet — click +1/-1 to add the current todo.</p>
      ) : (
        todos.map((todo, i) => (
          <p key={`${todo.id}-${i}`}>{todo.content}</p>
        ))
      )}
      {todos.length > 0 && (
        <button
          type="button"
          onClick={() => setTodos([])}
          style={{ marginTop: 8 }}
        >
          Reset list
        </button>
      )}
    </div>
  )
}
