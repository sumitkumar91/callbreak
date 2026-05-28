import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateDeck, shuffleDeck, dealCards, sortHand } from '../engine/deck';
import { calculateBotBid, determineBotPlay } from '../engine/botAI';
import { isValidPlay, determineTrickWinner, calculateRoundScores } from '../engine/gameRules';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState('START'); // START, BIDDING, PLAYING, ROUND_OVER, GAME_OVER
  const [round, setRound] = useState(1);
  const [players, setPlayers] = useState([
    { id: 'p1', name: 'You', isBot: false },
    { id: 'b1', name: 'Bot 1', isBot: true },
    { id: 'b2', name: 'Bot 2', isBot: true },
    { id: 'b3', name: 'Bot 3', isBot: true },
  ]);
  
  const [hands, setHands] = useState({ p1: [], b1: [], b2: [], b3: [] });
  const [bids, setBids] = useState({});
  const [tricksWon, setTricksWon] = useState({ p1: 0, b1: 0, b2: 0, b3: 0 });
  const [totalScores, setTotalScores] = useState({ p1: 0, b1: 0, b2: 0, b3: 0 });
  
  const [currentTrick, setCurrentTrick] = useState([]); // Array of { playerId, card }
  const [turnIndex, setTurnIndex] = useState(0); // 0 = p1, 1 = b1, 2 = b2, 3 = b3
  const [startingPlayerIndex, setStartingPlayerIndex] = useState(0);

  const startRound = useCallback(() => {
    const deck = shuffleDeck(generateDeck());
    const dealt = dealCards(deck);
    
    setHands({
      p1: sortHand(dealt[0]),
      b1: sortHand(dealt[1]),
      b2: sortHand(dealt[2]),
      b3: sortHand(dealt[3]),
    });
    
    setBids({});
    setTricksWon({ p1: 0, b1: 0, b2: 0, b3: 0 });
    setCurrentTrick([]);
    setGameState('BIDDING');
    
    // In call break, dealing/starting shifts, but for simplicity let's say winner of last trick starts, 
    // or p1 starts the very first round.
    setTurnIndex(startingPlayerIndex);
  }, [startingPlayerIndex]);

  useEffect(() => {
    if (gameState === 'BIDDING') {
      // Auto-generate bot bids
      const newBids = { ...bids };
      let updated = false;
      players.forEach(p => {
        if (p.isBot && !newBids[p.id]) {
          newBids[p.id] = calculateBotBid(hands[p.id]);
          updated = true;
        }
      });
      if (updated) {
        setBids(newBids);
      }
    }
  }, [gameState, bids, players, hands]);

  const placeHumanBid = (bid) => {
    setBids(prev => ({ ...prev, p1: bid }));
    setGameState('PLAYING');
  };

  const playCard = useCallback((playerId, card) => {
    // Validate play
    if (playerId === 'p1' && !isValidPlay(card, currentTrick, hands['p1'])) {
      alert("Invalid move! You must follow suit if you can.");
      return;
    }

    // Remove card from hand
    setHands(prev => {
      const newHand = prev[playerId].filter(c => c.id !== card.id);
      return { ...prev, [playerId]: newHand };
    });

    // Add to trick
    setCurrentTrick(prev => {
      const newTrick = [...prev, { playerId, card }];
      return newTrick;
    });

    // Move to next turn
    setTurnIndex(prev => (prev + 1) % 4);
  }, [currentTrick, hands]);

  // Handle trick resolution
  useEffect(() => {
    if (currentTrick.length === 4) {
      // Trick is complete
      const timer = setTimeout(() => {
        const winner = determineTrickWinner(currentTrick);
        const winnerId = winner.playerId;
        
        setTricksWon(prev => ({ ...prev, [winnerId]: prev[winnerId] + 1 }));
        setCurrentTrick([]);
        
        const winnerIndex = players.findIndex(p => p.id === winnerId);
        setTurnIndex(winnerIndex);
        
        // Check if round is over
        if (hands.p1.length === 0 && hands.b1.length === 0 && hands.b2.length === 0 && hands.b3.length === 0) {
          endRound();
        }
      }, 1500); // 1.5s delay to show the complete trick
      
      return () => clearTimeout(timer);
    }
  }, [currentTrick, hands, players]);

  // Handle bot turns
  useEffect(() => {
    if (gameState === 'PLAYING' && currentTrick.length < 4) {
      const currentPlayer = players[turnIndex];
      if (currentPlayer.isBot) {
        const timer = setTimeout(() => {
          const cardToPlay = determineBotPlay(currentPlayer.id, hands[currentPlayer.id], currentTrick);
          if (cardToPlay) {
            playCard(currentPlayer.id, cardToPlay);
          }
        }, 1000); // 1s delay for bot "thinking"
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, turnIndex, currentTrick, players, hands, playCard]);

  const endRound = () => {
    const roundScores = calculateRoundScores(bids, tricksWon);
    setTotalScores(prev => ({
      p1: prev.p1 + (roundScores.p1 || 0),
      b1: prev.b1 + (roundScores.b1 || 0),
      b2: prev.b2 + (roundScores.b2 || 0),
      b3: prev.b3 + (roundScores.b3 || 0),
    }));
    
    setGameState('ROUND_OVER');
  };

  const nextRound = () => {
    if (round >= 5) {
      setGameState('GAME_OVER');
    } else {
      setRound(prev => prev + 1);
      setStartingPlayerIndex(prev => (prev + 1) % 4);
      startRound();
    }
  };

  const resetGame = () => {
    setRound(1);
    setTotalScores({ p1: 0, b1: 0, b2: 0, b3: 0 });
    setStartingPlayerIndex(0);
    startRound();
  };

  return (
    <GameContext.Provider value={{
      gameState, round, players, hands, bids, tricksWon, totalScores,
      currentTrick, turnIndex,
      startRound, placeHumanBid, playCard, nextRound, resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};
