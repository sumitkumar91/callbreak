// Call Break game rules and validations

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

// Gets strictly valid cards a player can play based on obligation to win
export const getValidCards = (currentTrickCards, playerHand) => {
  // If first to play, any card is valid
  if (currentTrickCards.length === 0) return playerHand;

  const leadSuit = currentTrickCards[0].card.suit;
  const currentWinner = determineTrickWinner(currentTrickCards);

  // Does the player have the lead suit?
  const cardsOfLeadSuit = playerHand.filter(c => c.suit === leadSuit);

  if (cardsOfLeadSuit.length > 0) {
    // Must follow suit
    // Must try to win if possible
    if (currentWinner.card.suit === leadSuit) {
      const winningValue = currentWinner.card.value;
      const higherCards = cardsOfLeadSuit.filter(c => c.value > winningValue);
      if (higherCards.length > 0) {
        return higherCards; // Obligation to beat the current highest card
      }
    }
    // Either a spade is winning, or we can't beat the highest lead suit card
    return cardsOfLeadSuit;
  }

  // If player doesn't have the lead suit, check if they have a Spade
  const spades = playerHand.filter(c => c.suit === 'Spades');

  if (spades.length > 0) {
    // Must play a spade
    let winningSpadeValue = 0;
    if (currentWinner.card.suit === 'Spades') {
      winningSpadeValue = currentWinner.card.value;
    }
    
    const higherSpades = spades.filter(c => c.value > winningSpadeValue);
    if (higherSpades.length > 0) {
      return higherSpades; // Obligation to beat the current winning spade
    }
    
    // We can't beat the winning spade, but must still play a spade
    return spades;
  }

  // If they have neither the lead suit nor spades, they can play any card
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
