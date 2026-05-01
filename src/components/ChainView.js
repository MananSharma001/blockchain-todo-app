import React, { useEffect, useRef } from 'react';
import BlockCard from './BlockCard';

export default function ChainView({ chain }) {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end', block: 'nearest' });
    }
  }, [chain.length]);

  if (!chain || chain.length === 0) return null;

  return (
    <section className="chain-view-section">
      <h2 className="chain-view-title">
        <span className="chain-view-title-icon">📒</span>
        Blockchain Ledger
        <span className="chain-view-title-count">{chain.length} block{chain.length !== 1 ? 's' : ''}</span>
      </h2>
      <div className="chain-scroll-wrapper">
        <div className="chain-scroll">
          {chain.map((block, i) => (
            <BlockCard
              key={block.index}
              block={block}
              isLast={i === chain.length - 1}
            />
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </section>
  );
}
