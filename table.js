require('./deck.js');

class Table {
    constructor() {
        this.river = [];
        this.players = [];
        this.deck = new Deck();
    }

    dealCards() {
        const numPlayers = this.players.length;
        const cardsPerPlayer = 2;  

        for (let i = 0; i < cardsPerPlayer; i++) {
            for (let j = 0; j < numPlayers; j++) {
                const card = this.deck.cards.pop();
                this.players[j].hand.push(card);
            }
        }
    }

    dealTableCards() {
        const numRiverCards = 5;
        for (let i = 0; i < numRiverCards; i++) {
            this.river.push(this.deck.cards.pop());
        }
    }
    
}

module.exports = Table;
