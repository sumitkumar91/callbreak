// Call Break game rules and validations

// Determines if a card play is valid based on the current trick and hand
export const isValidPlay = (card, currentTrickCards, playerHand) => {
  // If first to play, any card is valid
  if (currentTrickCards.length === 0) return true;

  const leadSuit = currentTrickCards[0].suit;
  
  // Does the player have the lead suit?
  const hasLeadSuit = playerHand.some(c => c.suit === leadSuit);

  if (hasLeadSuit) {
    // Must follow suit
    if (card.suit === leadSuit) {
      return true;
    } else {
      return false; // Invalid: Has lead suit but didn't play it
    }
  }

  // If player doesn't have the lead suit, they can play any card (trump or discard)
  return true;
};

// Gets valid cards a player can play
export const getValidCards = (currentTrickCards, playerHand) => {
  return playerHand.filter(card => isValidPlay(card, currentTrickCards, playerHand));
};

// Determines the winning card in a trick
export const determineTrickWinner = (trickCards) => {
  if (trickCards.length === 0) return null;

  const leadSuit = trickCards[0].card.suit;
  let winningCard = trickCards[0];

  for (let i = 1; i < trickCards.length; i++) {
    const current = trickCards[i];
    
    // If current is a spade (trump) and winning card is not a spade
    if (current.card.suit === 'Spades' && winningCard.card.suit !== 'Spades') {
      winningCard = current;
    }
    // If both are spades, higher value wins
    else if (current.card.suit === 'Spades' && winningCard.card.suit === 'Spades') {
      if (current.card.value > winningCard.card.value) {
        winningCard = current;
      }
    }
    // If neither are spades, but current matches lead suit and is higher
    else if (current.card.suit === leadSuit && winningCard.card.suit === leadSuit) {
      if (current.card.value > winningCard.card.value) {
        winningCard = current;
      }
    }
  }

  return winningCard;
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
