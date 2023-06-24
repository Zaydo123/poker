class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    get_rank() {
        return this.rank;
    }

    get_suit() {
        return this.suit;
    }
    
}

module.exports = Card;
