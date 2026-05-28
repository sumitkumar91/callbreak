import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Card from './components/Card';
import BidModal from './components/BidModal';
import Scoreboard from './components/Scoreboard';
import { isValidPlay } from './engine/gameRules';
import './App.css';

const GameBoard = () => {
  const { 
    gameState, hands, players, currentTrick, turnIndex, 
    playCard, startRound, nextRound, resetGame 
  } = useGame();

  useEffect(() => {
    if (gameState === 'START') {
      startRound();
    }
  }, [gameState, startRound]);

  const p1Hand = hands.p1 || [];
  const isP1Turn = gameState === 'PLAYING' && turnIndex === 0;

  const renderBotHand = (botId, direction) => {
    const hand = hands[botId] || [];
    return (
      <div className={`hand-container bot-hand ${direction}`}>
        {hand.map((c, i) => (
          <div key={c.id || i} className="card-back" style={{ zIndex: i }}></div>
        ))}
      </div>
    );
  };

  const renderTrickCard = (playerId) => {
    const trickEntry = currentTrick.find(t => t.playerId === playerId);
    if (!trickEntry) return null;
    return (
      <div className={`played-card ${playerId} animate-deal`}>
        <Card card={trickEntry.card} index={0} isPlayable={false} />
      </div>
    );
  };

  return (
    <div className="app-container">
      <Scoreboard />
      <BidModal />
      
      {gameState === 'ROUND_OVER' && (
        <div className="overlay">
          <div className="modal glass-panel animate-fade-in">
            <h2>Round Over</h2>
            <button className="primary-btn" onClick={nextRound}>Next Round</button>
          </div>
        </div>
      )}

      {gameState === 'GAME_OVER' && (
        <div className="overlay">
          <div className="modal glass-panel animate-fade-in">
            <h2>Game Over</h2>
            <p>Check the scoreboard for final scores.</p>
            <button className="primary-btn" onClick={resetGame} style={{marginTop: '20px'}}>Play Again</button>
          </div>
        </div>
      )}

      {/* Top: Bot 2 */}
      <div className="top-section">
        {renderBotHand('b2', 'horizontal')}
        {gameState === 'PLAYING' && turnIndex === 2 && <div className="turn-indicator turn-b2">Bot 2's Turn</div>}
      </div>

      {/* Middle: Bot 1, Table, Bot 3 */}
      <div className="middle-section">
        <div style={{ position: 'relative' }}>
          {renderBotHand('b1', 'vertical')}
          {gameState === 'PLAYING' && turnIndex === 1 && <div className="turn-indicator turn-b1">Bot 1's Turn</div>}
        </div>

        <div className="table-area">
          <div className="played-cards-container">
            {renderTrickCard('p1')}
            {renderTrickCard('b1')}
            {renderTrickCard('b2')}
            {renderTrickCard('b3')}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {renderBotHand('b3', 'vertical')}
          {gameState === 'PLAYING' && turnIndex === 3 && <div className="turn-indicator turn-b3">Bot 3's Turn</div>}
        </div>
      </div>

      {/* Bottom: Player 1 */}
      <div className="bottom-section">
        {gameState === 'PLAYING' && turnIndex === 0 && <div className="turn-indicator turn-p1">Your Turn</div>}
        <div className="hand-container horizontal player-hand">
          {p1Hand.map((card, idx) => {
            const isPlayable = isP1Turn && isValidPlay(card, currentTrick, p1Hand);
            return (
              <Card 
                key={card.id} 
                card={card} 
                index={idx} 
                isPlayable={isPlayable}
                onClick={() => playCard('p1', card)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}

export default App;
