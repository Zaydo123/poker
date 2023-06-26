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
app.use(express.json());
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

app.get('/requiresPassword/:id', (req, res) => {
    const id = req.params.id;
    res.send(gameLobbies[id].getPassword());
});


wss.addListener('connection', function (ws) {
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
            if (gameLobbies[msg.serverID] === undefined) {
                // respond
                console.log(gameLobbies[msg.serverID])
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Game does not exist"
                }));
                return;
            } else if (gameLobbies[msg.serverID].players.length >= 8) {
                // respond
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Game is full"
                }));
                return;

            } else if (!gameLobbies[msg.serverID].comparePassword(msg.password)) {

                if(gameLobbies[msg.serverID].password.length <= 0){
                    //respond wtf!

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
            } else {
                // respond

                console.log('user joined game ' + msg.serverID);
                
                ws.send(JSON.stringify({
                    type: "join",
                    id: gameLobbies[msg.serverID].players.length
                }));
                // Add player to game
                gameLobbies[msg.serverID].players.push(new Player(gameLobbies[msg.serverID].startingBank));
                // Send player info to all players
                for (let i = 0; i < gameLobbies[msg.serverID].players.length; i++) {
                    ws.send(JSON.stringify({
                        type: "player-join",
                        id: i,
                        name: gameLobbies[msg.serverID].players[i].name,
                        bank: gameLobbies[msg.serverID].players[i].bank
                    }));
                }
            }

        }

        // Check if message is a request to create a game
        else if (msg.type === "create") {
            // Create game
            console.log("setting password to " + msg.password);
            /*
        const table = new Table({"roomName":i,options:{"password":"hi"}});            
            */
            let table = new Table({"roomName":msg.roomName, options:{"password":msg.password, "startingBank":msg.startingBank, "blindAmount":msg.blindCost}});
            table.setId(gameLobbies.length);
            gameLobbies.push(table);
            
            console.log(table);

            table.players.push(new Player(100));

    
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

    //make a for loop that makes 20 tables with 8 players each
    for (let i = 0; i < 10; i++) {
        //      constructor({roomName="New Room",options = {startingBank:100,blindCost:2, password:""}} = {}){      
        const table = new Table({"roomName":i,options:{"password":"hi"}});
        for (let j = 0; j < 2; j++) {
            const player = new Player(100);
            player.setId(j);
            table.addPlayer(player);

        }
        table.setId(gameLobbies.length);
        gameLobbies.push(table);


    }



})();


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}
);