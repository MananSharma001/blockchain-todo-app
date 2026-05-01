import React from 'react';

export default function TodoItem({ todo, onToggle, onDelete, disabled }) {
  return (
    <div className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
      <button
        className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        disabled={disabled}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed ? '✓' : ''}
      </button>

      <span className="todo-text">{todo.text}</span>

      <span className="todo-block-ref" title={`Recorded in block #${todo.blockIndex}`}>
        #{todo.blockIndex}
      </span>

      <button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
        disabled={disabled}
        aria-label="Delete todo"
        title="Delete (creates a DELETE block)"
      >
        ✕
      </button>
    </div>
  );
}
