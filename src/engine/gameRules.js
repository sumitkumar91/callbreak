// Call Break game rules and validations

export const determineTrickWinner = (trickCards) => {
  if (trickCards.length === 0) return null;

  // The active/winning suit is the suit of the most recently played card
  const finalSuit = trickCards[trickCards.length - 1].card.suit;
  
  let winningCard = null;

  for (let i = 0; i < trickCards.length; i++) {
    const current = trickCards[i];
    
    // Only cards matching the final active suit can win
    if (current.card.suit === finalSuit) {
      if (!winningCard || current.card.value > winningCard.card.value) {
        winningCard = current;
      }
    }
  }

  return winningCard;
};

// Gets strictly valid cards a player can play based on obligation to win
export const getValidCards = (currentTrickCards, playerHand) => {
  // If first to play, any card is valid
  if (currentTrickCards.length === 0) return playerHand;

  // The required suit is dynamically set by the last card played
  const currentRequiredSuit = currentTrickCards[currentTrickCards.length - 1].card.suit;
  const currentWinner = determineTrickWinner(currentTrickCards);

  // Does the player have the required suit?
  const cardsOfRequiredSuit = playerHand.filter(c => c.suit === currentRequiredSuit);

  if (cardsOfRequiredSuit.length > 0) {
    // Must follow the required suit
    // Must try to beat the current winner if the winner's suit is the required suit
    if (currentWinner && currentWinner.card.suit === currentRequiredSuit) {
      const winningValue = currentWinner.card.value;
      const higherCards = cardsOfRequiredSuit.filter(c => c.value > winningValue);
      if (higherCards.length > 0) {
        return higherCards; // Obligation to beat the current highest card
      }
    }
    // Cannot beat, but must follow suit
    return cardsOfRequiredSuit;
  }

  // If they don't have the required suit, they can play any card (which will change the active suit)
  return playerHand;
};

// Determines if a card play is valid based on the current trick and hand
export const isValidPlay = (card, currentTrickCards, playerHand) => {
  const validCards = getValidCards(currentTrickCards, playerHand);
  return validCards.some(c => c.id === card.id);
};

// Calculate scores at the end of a round
// bids: { p1: 3, p2: 2, ... }
// tricksWon: { p1: 3, p2: 1, ... }
export const calculateRoundScores = (bids, tricksWon) => {
  const scores = {};
  for (const playerId in bids) {
    const bid = bids[playerId];
    const won = tricksWon[playerId] || 0;
    
    if (won < bid) {
      // Failed to meet bid
      scores[playerId] = -bid;
    } else {
      // Met or exceeded bid (0.1 for each overtrick)
      const overtricks = won - bid;
      scores[playerId] = bid + (overtricks * 0.1);
    }
  }
  return scores;
};
