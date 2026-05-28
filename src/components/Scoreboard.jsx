import React from 'react';
import { useGame } from '../context/GameContext';
import { RefreshCw } from 'lucide-react';

const Scoreboard = () => {
  const { players, round, bids, tricksWon, totalScores, resetGame } = useGame();

  return (
    <>
      <div className="hud glass-panel">
        <h3 style={{ marginBottom: '10px', color: 'var(--accent)' }}>Scores</h3>
        {players.map(p => {
          const bid = bids[p.id] || '-';
          const won = tricksWon[p.id] || 0;
          const score = totalScores[p.id] !== undefined ? totalScores[p.id].toFixed(1) : 0;
          return (
            <div key={p.id} className="hud-row">
              <span className="name">{p.name}</span>
              <span className="stats">
                Bid: {bid} | Won: {won} | <b style={{color: '#fff'}}>{score}</b>
              </span>
            </div>
          );
        })}
      </div>
      <div className="round-info glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <div>Round {round} / 5</div>
        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to restart the game?")) {
              resetGame();
            }
          }}
          style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', 
            color: 'white', padding: '6px 10px', borderRadius: '6px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.85rem', transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
        >
          <RefreshCw size={14} /> Restart
        </button>
      </div>
    </>
  );
};

export default Scoreboard;
