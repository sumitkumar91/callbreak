export const SUITS = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const RANK_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

// Generates a standard 52-card deck
export const generateDeck = () => {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
        value: RANK_VALUES[rank]
      });
    }
  }
  return deck;
};

// Fisher-Yates Shuffle
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deal cards to 4 players (13 each)
export const dealCards = (shuffledDeck) => {
  return [
    shuffledDeck.slice(0, 13),
    shuffledDeck.slice(13, 26),
    shuffledDeck.slice(26, 39),
    shuffledDeck.slice(39, 52),
  ];
};

// Sorts hand by suit (Spades first) and then by value (High to Low)
export const sortHand = (hand) => {
  const suitOrder = { 'Spades': 4, 'Hearts': 3, 'Clubs': 2, 'Diamonds': 1 };
  
  return [...hand].sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[b.suit] - suitOrder[a.suit];
    }
    return b.value - a.value;
  });
};
