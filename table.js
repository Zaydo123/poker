const Deck = require('./deck.js');

class Table {
    #river;
    #password;
    #deck;
    #players;
    #bigBlind;
    #smallBlind;

    constructor({roomName="New Room",options = {password:"",startingBank:100,blindCost:2}}){        
        this.id = "";
        this.startingBank = options.startingBank;
        this.startedOn = new Date();
        this.bigBlind = options.blindCost;
        this.smallBlind = options.blindCost/2;
        this.roomName = roomName;
        //private variables
        this.players = [];
        this.password = options.password;
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

    comparePassword(submittedPassword) {
        return this.password === submittedPassword;
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

    toString() {
        return JSON.stringify(this);
    }
    
}

module.exports = Table;
