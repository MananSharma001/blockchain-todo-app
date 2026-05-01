import React, { useState, useEffect, useCallback } from 'react';
import { Blockchain } from './blockchain/Blockchain';
import Header from './components/Header';
import AddTodo from './components/AddTodo';
import TodoItem from './components/TodoItem';
import ChainView from './components/ChainView';
import './App.css';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function useBlockchain() {
  const [bc, setBc] = useState(null);
  const [chain, setChain] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [mining, setMining] = useState(false);

  useEffect(() => {
    Blockchain.create().then((instance) => {
      setBc(instance);
      setChain([...instance.chain]);
      setTodos(instance.getTodos());
      instance.validate().then(setIsValid);
    });
  }, []);

  const mutate = useCallback(
    async (data) => {
      if (!bc || mining) return;
      setMining(true);
      try {
        const newChain = await bc.addBlock(data);
        setChain([...newChain]);
        setTodos(bc.getTodos());
        bc.validate().then(setIsValid);
      } finally {
        setMining(false);
      }
    },
    [bc, mining]
  );

  const addTodo = useCallback(
    (text) => mutate({ action: 'ADD_TODO', todoId: uid(), text }),
    [mutate]
  );

  const toggleTodo = useCallback(
    (todoId) => mutate({ action: 'TOGGLE_TODO', todoId }),
    [mutate]
  );

  const deleteTodo = useCallback(
    (todoId) => mutate({ action: 'DELETE_TODO', todoId }),
    [mutate]
  );

  const exportLedger = useCallback(() => {
    if (!bc) return;
    const blob = new Blob([bc.exportLedger()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blockchain-todo-ledger-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [bc]);

  const resetChain = useCallback(async () => {
    if (!window.confirm('Reset the entire blockchain? This cannot be undone.')) return;
    Blockchain.clear();
    const fresh = await Blockchain.create();
    setBc(fresh);
    setChain([...fresh.chain]);
    setTodos(fresh.getTodos());
    setIsValid(true);
  }, []);

  return { chain, todos, isValid, mining, addTodo, toggleTodo, deleteTodo, exportLedger, resetChain };
}

export default function App() {
  const { chain, todos, isValid, mining, addTodo, toggleTodo, deleteTodo, exportLedger, resetChain } =
    useBlockchain();

  const loading = chain.length === 0;
  const pending = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);

  return (
    <div className="app">
      <Header
        blockCount={chain.length}
        isValid={isValid}
        onExport={exportLedger}
        onReset={resetChain}
        mining={mining}
      />

      <main className="app-main">
        {loading ? (
          <div className="loading-screen">
            <div className="loading-spinner" />
            <p>Initializing blockchain…</p>
          </div>
        ) : (
          <>
            <div className="todo-panel">
              <AddTodo onAdd={addTodo} disabled={mining} />

              {todos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <p>No tasks yet. Add one above to mint your first block!</p>
                </div>
              ) : (
                <>
                  {pending.length > 0 && (
                    <div className="todo-group">
                      <h3 className="todo-group-title">
                        To Do <span className="todo-group-count">{pending.length}</span>
                      </h3>
                      {pending.map((todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                          disabled={mining}
                        />
                      ))}
                    </div>
                  )}

                  {done.length > 0 && (
                    <div className="todo-group">
                      <h3 className="todo-group-title todo-group-title--done">
                        Completed <span className="todo-group-count">{done.length}</span>
                      </h3>
                      {done.map((todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                          disabled={mining}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {mining && (
                <div className="mining-overlay">
                  <div className="loading-spinner small" />
                  <span>Mining new block…</span>
                </div>
              )}
            </div>

            <ChainView chain={chain} />
          </>
        )}
      </main>
    </div>
  );
}
