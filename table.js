const Deck = require('./deck.js');

class Table {
    #river;
    #password;
    #deck;
    #players;
    #bigBlind;
    #smallBlind;

    constructor(startingBank=100,blindAmount=2,roomName="New Room", password="") {
        this.id = "";
        this.startingBank = startingBank;
        this.startedOn = new Date();
        this.roomName = roomName;
        //private variables
        this.players = [];
        this.password = password;
        this.deck = new Deck();
        this.river = [];

    }

    setId(id) {
        this.id = id;
    }

    setStartingBank(bank) {
        this.startingBank = bank;
    }

    setPassword(password) {
        this.password = password;
    }

    getPassword() {
        return this.password;
    }

    getId() {
        return this.id;
    }

    getPlayers() {
        return this.players;
    }

    addPlayer(player) {
        this.players.push(player);
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

    dealTableCards(amount) {
        for (let i = 0; i < amount; i++) {
            this.river.push(this.deck.cards.pop());
        }
    }
    
}

module.exports = Table;
