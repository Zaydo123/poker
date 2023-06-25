//use websockets
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const Card = require('./card.js'); 
const Deck = require('./deck.js');
const Player = require('./player.js');
const Table = require('./table.js');


/* ------------------ */

let gameLobbies = [];
let cleanedLobbies = [];

/* ------------------ */

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.static('public'));

//serve react app

function fetchServers(limit) {
    // Return list of servers
    cleanedLobbies = gameLobbies;
    cleanedLobbies= cleanedLobbies.slice(0, limit);

    //get rid of cleanedLobbies[i].players, cleanedLobbies[i].deck, cleanedLobbies[i].river, cleanedLobbies[i].password
    for (let i = 0; i < cleanedLobbies.length; i++) {
        delete cleanedLobbies[i].deck;
        delete cleanedLobbies[i].river;
        
        for(let j = 0; j < cleanedLobbies[i].players.length; j++){
            delete cleanedLobbies[i].players[j].hand;
            delete cleanedLobbies[i].players[j].bank; 
        }

        if(cleanedLobbies[i].password.length > 0 && typeof cleanedLobbies[i].password == "string"){
            cleanedLobbies[i].password = true;
        } else if(cleanedLobbies[i].password.length<=0 && typeof cleanedLobbies[i].password == "string"){
            cleanedLobbies[i].password = false;
        } else if(cleanedLobbies[i].password == false){
            //do nothing
        }  else if(cleanedLobbies[i].password == true){
            //do nothing
        } 
    }

    return cleanedLobbies;
}

app.get('/fetchServerList', (req, res) => {
    res.send(fetchServers(15));
    cleanedLobbies = gameLobbies;
});




wss.addListener('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: %s', message);

        // Parse message

        try{
            JSON.parse(message);
        } catch (e) {
            return;
        }

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
                gameLobbies[msg.gameId].players.push(new Player(gameLobbies[msg.gameId].startingBank));

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
    player1 = new Player(100);
    player1.setId(0);
    player2 = new Player(100);
    player2.setId(1);
    table.addPlayer(player1);
    table.addPlayer(player2);
    
    table.setId(gameLobbies.length);
    gameLobbies.push(table);

    table.dealCards();

    //make a for loop that makes 20 tables with 8 players each
    for (let i = 0; i < 20; i++) {
        const table = new Table(1000,2,"BallersOnly","password")
        for (let j = 0; j < 8; j++) {
            const player = new Player(100);
            player.setId(j);
            table.addPlayer(player);

        }
        console.log(table.getPassword());
        table.setId(gameLobbies.length);
        gameLobbies.push(table);
    }



})();


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}
);