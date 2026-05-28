import { getValidCards, determineTrickWinner } from './gameRules';

// Simple heuristic to bid based on high cards and spades
export const calculateBotBid = (hand) => {
  let bid = 0;
  hand.forEach(card => {
    // Count Aces and Kings as likely winners
    if (card.value >= 13) bid++;
    // Count Spades above 10
    else if (card.suit === 'Spades' && card.value >= 11) bid++;
  });
  
  // Minimum bid is 1
  return Math.max(1, bid);
};

// Simple logic for bot to play a card
export const determineBotPlay = (botId, hand, currentTrickCards) => {
  const validCards = getValidCards(currentTrickCards, hand);
  
  // Sort valid cards from lowest to highest value
  const sortedValid = [...validCards].sort((a, b) => {
    if (a.suit === 'Spades' && b.suit !== 'Spades') return 1;
    if (a.suit !== 'Spades' && b.suit === 'Spades') return -1;
    return a.value - b.value;
  });

  if (currentTrickCards.length === 0) {
    // Bot is leading. Play a safe low non-spade, or highest card if they have lots of spades.
    // For simplicity, lead with the highest non-spade, or lowest spade.
    const nonSpades = sortedValid.filter(c => c.suit !== 'Spades');
    if (nonSpades.length > 0) {
       // lead highest non-spade
       return nonSpades[nonSpades.length - 1];
    }
    // Only spades left, play lowest
    return sortedValid[0];
  }

  // Bot is not leading
  // Let's see if we can win the trick with our valid cards
  let winningCardToPlay = null;
  let lowestCardToPlay = sortedValid[0]; // The absolute lowest value card we can legally play

  for (const card of sortedValid) {
    // Simulate playing this card
    const simulatedTrick = [...currentTrickCards, { playerId: botId, card }];
    const winner = determineTrickWinner(simulatedTrick);
    
    // If playing this card makes us the winner currently, and we haven't found a winning card yet
    if (winner.playerId === botId && !winningCardToPlay) {
      winningCardToPlay = card;
    }
  }

  // If we found a card that can win (and we have no obligation to beat, but we want to win tricks), we play the lowest card that wins
  if (winningCardToPlay) {
    return winningCardToPlay;
  }

  // If we can't win, play the lowest valid card (dumping)
  return lowestCardToPlay;
};
