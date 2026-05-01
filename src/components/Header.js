import React from 'react';

export default function Header({ blockCount, isValid, onExport, onReset, mining }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-icon">⛓</span>
        <div>
          <h1 className="header-title">Blockchain Todo</h1>
          <p className="header-subtitle">Immutable. Transparent. Yours.</p>
        </div>
      </div>

      <div className="header-meta">
        <span className={`validity-badge ${isValid ? 'valid' : 'invalid'}`}>
          {isValid ? '✓ Chain Valid' : '✗ Chain Invalid'}
        </span>
        <span className="block-count">{blockCount} block{blockCount !== 1 ? 's' : ''}</span>
        {mining && <span className="mining-badge">⛏ Mining…</span>}
      </div>

      <div className="header-actions">
        <button className="btn btn-secondary" onClick={onExport} title="Export blockchain as JSON">
          ↓ Export Ledger
        </button>
        <button className="btn btn-danger" onClick={onReset} title="Reset blockchain (irreversible)">
          ↺ Reset
        </button>
      </div>
    </header>
  );
}
