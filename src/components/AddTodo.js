import React, { useState } from 'react';

export default function AddTodo({ onAdd, disabled }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  }

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        className="add-todo-input"
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        maxLength={200}
        autoFocus
      />
      <button
        className="btn btn-primary add-todo-btn"
        type="submit"
        disabled={disabled || !text.trim()}
      >
        + Add Block
      </button>
    </form>
  );
}
