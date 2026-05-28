import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { isValidPlay } from '../engine/gameRules';

const suitSymbols = {
  Spades: '♠',
  Hearts: '♥',
  Clubs: '♣',
  Diamonds: '♦'
};

const Card = ({ card, index, isPlayable, onClick }) => {
  const { gameState } = useGame();
  const [justDealt, setJustDealt] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setJustDealt(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  if (!card) return null;

  const symbol = suitSymbols[card.suit];
  const colorClass = card.suit;

  return (
    <div 
      className={`playing-card ${justDealt ? 'animate-deal' : ''} ${colorClass} ${isPlayable ? 'playable' : ''}`}
      style={{ animationDelay: `${index * 0.05}s`, zIndex: index }}
      onClick={() => isPlayable && onClick(card)}
    >
      <div className="card-top-left">
        <span>{card.rank}</span>
        <span>{symbol}</span>
      </div>
      
      <div className="card-center">
        {symbol}
      </div>
      
      <div className="card-bottom-right">
        <span>{card.rank}</span>
        <span>{symbol}</span>
      </div>
    </div>
  );
};

export default Card;
