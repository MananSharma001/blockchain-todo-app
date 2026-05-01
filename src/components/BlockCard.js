import React from 'react';

const ACTION_ICONS = {
  GENESIS: '🌐',
  ADD_TODO: '➕',
  TOGGLE_TODO: '✔',
  DELETE_TODO: '🗑',
};

const ACTION_LABELS = {
  GENESIS: 'Genesis',
  ADD_TODO: 'Add Todo',
  TOGGLE_TODO: 'Toggle Todo',
  DELETE_TODO: 'Delete Todo',
};

function shortHash(hash) {
  if (!hash) return '—';
  return hash.slice(0, 8) + '…' + hash.slice(-4);
}

export default function BlockCard({ block, isLast }) {
  const { index, timestamp, data, hash, previousHash, nonce } = block;
  const action = data.action || 'UNKNOWN';
  const isGenesis = index === 0;

  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="block-chain-item">
      <div className={`block-card ${isGenesis ? 'block-card--genesis' : ''}`}>
        <div className="block-card-header">
          <span className="block-index">Block #{index}</span>
          <span className="block-action-icon" title={ACTION_LABELS[action] || action}>
            {ACTION_ICONS[action] || '📦'}
          </span>
        </div>

        <div className="block-action-label">{ACTION_LABELS[action] || action}</div>

        {data.text && (
          <div className="block-payload" title={data.text}>
            "{data.text.length > 30 ? data.text.slice(0, 30) + '…' : data.text}"
          </div>
        )}
        {isGenesis && (
          <div className="block-payload genesis-msg">{data.message}</div>
        )}

        <div className="block-timestamp">
          <span>{dateStr}</span>
          <span>{timeStr}</span>
        </div>

        <div className="block-field">
          <span className="block-field-label">Nonce</span>
          <span className="block-field-value">{nonce.toLocaleString()}</span>
        </div>

        <div className="block-hash-section">
          <div className="block-hash-row">
            <span className="block-field-label">Hash</span>
            <span className="block-hash hash-current" title={hash}>{shortHash(hash)}</span>
          </div>
          <div className="block-hash-row">
            <span className="block-field-label">Prev</span>
            <span className="block-hash hash-prev" title={previousHash}>{shortHash(previousHash)}</span>
          </div>
        </div>
      </div>

      {!isLast && (
        <div className="block-connector" aria-hidden="true">
          <div className="connector-line" />
          <div className="connector-arrow">▶</div>
        </div>
      )}
    </div>
  );
}
