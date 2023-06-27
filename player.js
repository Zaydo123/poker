class Player {
    constructor(startingBalance) {
        this.ip = "";
        this.name = "";
        this.id = "";
        this.privateID = "";
        this.state = "waiting";
        this.hand = [];
        this.balance = startingBalance;
        this.wsConnection = null;
    }
    setIp(ip) {
        this.ip = ip;
    }
    setName(name) {
        this.name = name;
    }
    setId(id) {
        this.id = id;
    }

    setPrivateID(id) {
        this.privateID = id;
    }

    setState(state) {
        this.state = state;
    }
    setHand(hand) {
        this.hand = hand;
    }
    setBalance(balance) {
        this.balance = balance;
    }
    getIp() {
        return this.ip;
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.id;
    }
    getState() {
        return this.state;
    }
    getHand() {
        return this.hand;
    }
    getBalance() {
        return this.balance;
    }
    addBalance(amount) {
        this.balance += amount;
    }
    subtractBalance(amount) {
        this.balance -= amount;
    }
    resetHand() {
        this.hand = [];
    }
    resetState() {
        this.state = "waiting";
    }
    resetBalance() {
        this.balance = 0;
    }
    reset() {
        this.resetHand();
        this.resetState();
        this.resetBalance();
    }
    toString() {
        return "Player: " + this.name + " " + this.id + " " + this.state + " " + this.hand + " " + this.balance;
    }
}

module.exports = Player;