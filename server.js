//use websockets
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const Card = require('./card.js'); 
const Deck = require('./deck.js');
const Player = require('./player.js');
const Table = require('./table.js');



let gameLobbies = [];



wss.addListener('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: %s', message);

        // Parse message
        let msg = JSON.parse(message);

        // Check if message is a request to join a game
        if (msg.type === "join") {
            // Check if game exists
            if (gameLobbies[msg.gameId] === undefined) {
                // respond
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Game does not exist"
                }));
                return;
            } else if (gameLobbies[msg.gameId].players.length >= 8) {
                // respond
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Game is full"
                }));
                return;
            } else {
                // respond
                ws.send(JSON.stringify({
                    type: "join",
                    id: gameLobbies[msg.gameId].players.length
                }));
                // Add player to game
                gameLobbies[msg.gameId].players.push(new Player(100));

                // Send player their id
                ws.send(JSON.stringify({
                    type: "join",
                    id: gameLobbies[msg.gameId].players.length - 1
                }));

            }

        }

        // Check if message is a request to create a game
        if (msg.type === "create") {
            // Create game
            let table = new Table();
            table.players.push(new Player(100));
            gameLobbies.push(table);

            // Respond
            ws.send(JSON.stringify({
                type: "create",
                id: gameLobbies.length - 1
            }));
        }

    });
});




// Main function
(async () => {
    const table = new Table();
    table.players.push(new Player(100));
    table.players.push(new Player(100));
    table.players.push(new Player(100));

    table.dealCards();
    table.dealTableCards();
})();
