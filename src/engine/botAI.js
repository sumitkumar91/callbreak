import { getValidCards, determineTrickWinner } from './gameRules';

// Simple heuristic to bid based on high cards
export const calculateBotBid = (hand) => {
  let bid = 0;
  hand.forEach(card => {
    // Count Aces and Kings as likely winners across all suits
    if (card.value >= 13) bid++;
  });
  
  // Minimum bid is 1
  return Math.max(1, bid);
};

// Simple logic for bot to play a card
export const determineBotPlay = (botId, hand, currentTrickCards) => {
  const validCards = getValidCards(currentTrickCards, hand);
  
  // Sort valid cards from lowest to highest value
  const sortedValid = [...validCards].sort((a, b) => {
    return a.value - b.value;
  });

  if (currentTrickCards.length === 0) {
    // Bot is leading. Lead with the highest card they have for better chance to win, 
    // or lowest if they have no good cards. We'll simply lead the highest card.
    return sortedValid[sortedValid.length - 1];
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
