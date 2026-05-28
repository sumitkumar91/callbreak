import React from 'react';
import { useGame } from '../context/GameContext';

const BidModal = () => {
  const { gameState, placeHumanBid, hands } = useGame();

  if (gameState !== 'BIDDING') return null;

  const humanHand = hands['p1'] || [];

  return (
    <div className="overlay bid-overlay">
      <div className="modal glass-panel animate-fade-in">
        <h2>Place Your Bid</h2>
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
          Look at your hand below. How many tricks can you win? (Minimum 1)
        </p>
        <div className="bid-options">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(bid => (
            <button 
              key={bid} 
              className="bid-btn"
              onClick={() => placeHumanBid(bid)}
            >
              {bid}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BidModal;
