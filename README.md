# Call Break - Single Player Web Game

A sleek, responsive, and fully-featured single-player implementation of the classic trick-taking card game **Call Break**. Play against three intelligent AI opponents directly in your web browser.

## Features

- **Progressive Web App (PWA)**: Installable on iOS and Android devices for a native app-like experience.
- **Intelligent AI Bots**: Bots analyze their hands to make realistic bids and play strategic cards during tricks.
- **Mobile-First Responsive Design**: Flawlessly adapts to phone, tablet, and desktop screens.
- **Rich UI & Animations**: Built with a premium "dark casino" aesthetic featuring glassmorphism elements, dynamic glowing indicators, and smooth card dealing/playing micro-animations.
- **Strict Rule Enforcement**: Visual pop-outs clearly indicate which cards are valid to play on your turn based on official Call Break rules.

## Official Game Rules Implemented

The game consists of **5 rounds** played with a standard 52-card deck.

1. **Bidding**: At the start of each round, players review their 13 cards and "bid" the number of tricks they expect to win (minimum of 1).
2. **Gameplay & Following Suit**: 
   - You **must** follow the lead suit if you have a card of that suit.
   - If you do not have the lead suit, you **must** play a Spade (the permanent trump/wildcard) if you have one to try and win the trick.
   - If you have neither the lead suit nor any Spades, you may discard any card.
3. **Winning Tricks**: A trick is won by the highest Spade played. If no Spades are played, the trick is won by the highest card of the lead suit.
4. **Scoring**: 
   - If a player wins fewer tricks than they bid, they lose points equal to their bid (e.g., bidding 3 and winning 2 results in -3 points).
   - If a player meets their bid, they get their bid value in points. Overtricks award 0.1 points each (e.g., bidding 3 and winning 4 results in 3.1 points).

