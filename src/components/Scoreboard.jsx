import React from 'react';
import { useGame } from '../context/GameContext';

const Scoreboard = () => {
  const { players, round, bids, tricksWon, totalScores } = useGame();

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
      <div className="round-info glass-panel">
        Round {round} / 5
      </div>
    </>
  );
};

export default Scoreboard;
