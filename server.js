//use websockets
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const Card = require('./card.js'); 
const Deck = require('./deck.js');
const Player = require('./player.js');
const Table = require('./table.js');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

/* ------------------ */

let gameLobbies = [];
let cleanedLobbies = [];

/* ------------------ */

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//serve react app

function fetchServers(limit) {
    // Return list of servers
    cleanedLobbies = _.cloneDeep(gameLobbies);
    cleanedLobbies= cleanedLobbies.slice(0, limit);

    //get rid of cleanedLobbies[i].players, cleanedLobbies[i].deck, cleanedLobbies[i].river, cleanedLobbies[i].password
    for (let i = 0; i < cleanedLobbies.length; i++) {
        delete cleanedLobbies[i].deck;
        delete cleanedLobbies[i].river;
        
        for(let j = 0; j < cleanedLobbies[i].players.length; j++){
            delete cleanedLobbies[i].players[j].hand;
            delete cleanedLobbies[i].players[j].bank; 
            delete cleanedLobbies[i].players[j].ip;
            delete cleanedLobbies[i].players[j].id;
            delete cleanedLobbies[i].players[j].privateID;
            delete cleanedLobbies[i].players[j].wsConnection;
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
    cleanedLobbies = _.cloneDeep(gameLobbies);
});

app.get('/requiresPassword/:id', (req, res) => {
    const id = req.params.id;
    res.send(gameLobbies[id].getPassword().length > 0);
});

wss.addListener('connection', function (ws,req) {
    ws.on('message', function (message) {

        
        let msg = JSON.parse(message);

        console.log('received: %s', message);

        // Parse message

        try{
            JSON.parse(message);
        } catch (e) {
            console.log(message);
            console.log('bad')
            return;
        }


        // Check if message is a request to join a game
        if (msg.type === "join") {
            // Check if game exists
            if (gameLobbies[msg.serverID] === undefined) { // Check if game exists
                // respond
                console.log(gameLobbies[msg.serverID])
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Game does not exist"
                }));
                return;
            } else if (gameLobbies[msg.serverID].players.length >= 8) { // Check if game is full
                // respond
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Game is full"
                }));
                return;

            } else if (!gameLobbies[msg.serverID].comparePassword(msg.password)) { // Check if password is correct

                if(gameLobbies[msg.serverID].password.length <= 0){
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Game does not have a password"
                    }));
                    return;
                }

                ws.send(JSON.stringify({
                    type: "error",
                    message: "Incorrect password"
                }));
                return;

            } else if (gameLobbies[msg.serverID].players.find(player => player.privateID === msg.privateID)) {   // Check if player is already in game
                // respond
                ws.send(JSON.stringify({
                    type: "error",
                    message: "You are already in this game"
                }));
                return;

            } else {
                // Create player
                let newPlayer = new Player(gameLobbies[msg.serverID].startingBank);
                let userID = uuidv4();
                let publicUserID = gameLobbies[msg.serverID].players.length;
                newPlayer.setId(userID);
                newPlayer.setName(msg.name);
                newPlayer.setPrivateID(msg.privateID);
                newPlayer.wsConnection = ws;
                
                console.log('user joined game ' + msg.serverID);
                
                ws.send(JSON.stringify({
                    type: "join-self",
                    player: {id: userID, name: msg.name, bank: gameLobbies[msg.serverID].startingBank}
                }));
                // Add player to game

        
                gameLobbies[msg.serverID].players.push(newPlayer);
                // Send player info to all players
                for (let i = 0; i < gameLobbies[msg.serverID].players.length; i++) {
                    gameLobbies[msg.serverID].players[i].wsConnection.send(JSON.stringify({
                        type: "join",
                        id: publicUserID,
                        name: gameLobbies[msg.serverID].players[i].name,
                        bank: gameLobbies[msg.serverID].players[i].bank
                    }));
                    console.log("sent to " + gameLobbies[msg.serverID].players[i].id);
                }
            }

        }

        // Check if message is a request to create a game
        else if (msg.type === "create") {
            // Create game

            if(msg.roomName.length <= 0){
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Room name cannot be empty"
                }));
                return;
            } else if(msg.roomName.length > 20){
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Room name cannot be longer than 20 characters"
                }));
                return;
            } else if(msg.password.length > 20){
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Password cannot be longer than 20 characters"
                }));
                return;
            }

            //see if duplicate name
            for(let i = 0; i < gameLobbies.length; i++){
                if(gameLobbies[i].roomName == msg.roomName){
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Room name already exists"
                    }));
                    return;
                }
            }

            let table = new Table({"roomName":msg.roomName, options:{"password":msg.password, "startingBank":msg.startingBank, "blindAmount":msg.blindCost}});
            table.setId(gameLobbies.length);
            gameLobbies.push(table);
            console.log(table);
    
            ws.send(JSON.stringify({
                type: "create",
                id: gameLobbies.length - 1
            }));
        
           /*
            ws.send(JSON.stringify({
                type: "player-join",
                id: 0,
                state: "waiting",
                name: "fugly",
                bank: 100
            }))
            */

        }

    });
});




// Main function
(async () => {

})();


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}
);