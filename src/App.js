import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';


let numberOfPlayers = 8;

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

//generate a random card 

function randomCard() {
  let number = Math.floor(Math.random() * 13) + 1;
  let suit = Math.floor(Math.random() * 4) + 1;
  let color = "blackCard";
  if (suit === 1 || suit === 2) {
    color = "redCard";
  }
  switch (number) {
    case 1:
      number = "A";
      break;
    case 11:
      number = "J";
      break;
    case 12:
      number = "Q";
      break;
    case 13:
      number = "K";
      break;
    default:
      break;
  }
  switch (suit) {
    case 1:
      suit = "hearts";
      break;
    case 2:
      suit = "diamonds";
      break;
    case 3:
      suit = "clubs";
      break;
    case 4:
      suit = "spades";
      break;
    default:
      break;
  }
  return [number, suit, color];
}


function singleCard(number,suit,color,extra = ""){
  return (
    <div className={"card card-" + number + " " + color + " " + suit + " " + extra}>
      <div className="cardText">
        <div className="cardTextTop">{number}</div>
        <div className={"cardDesign " + suit}></div>
        <div className="cardTextBottom">{number}</div>
      </div>
    </div>
  );
}


function Table({ cards }) {
  return (
    <div className="Table">
      <div className="card-place">
        {cards}
      </div>
    </div>
  );
}

//render two cards for each player
function playerCards() {
  return (
    <div className="player-cards">

      <div className="card noflip"></div>

      <div className="card noflip"></div>

    </div>
  );
}


function userFolded(user) {
  /* add folded class to user */
  let player = document.querySelector(".player-" + user);
  player.classList.add("folded");
}

function unFoldPlayers() {
  /* remove folded class from all players */
  let players = document.querySelectorAll(".player");
  players.forEach(player => {
    player.classList.remove("folded");
  });
}
function showPlayerChat(user, message) {
  /* show chat message for user */
  let player = document.querySelector(".player-" + user);
  let chat = player.querySelector(".chat-message");
  chat.innerHTML = message;
  let chatBox = player.querySelector(".player-chat");
  chatBox.classList.add("show");
  delay(2000).then(() => {
    chatBox.classList.remove("show");
  }
  );
}


function Players () {
  // players are html objects
  let players = [];
  for (let i = 1; i <= numberOfPlayers; i++) {
    players.push(
    <div className="players" key={i}>
      <div className={"player player-" + i}>


        {playerCards()}
          <div className="player-chat">
            <div className="chat-message">Hello</div>
          </div>
          <div className="avatar"></div>
          <div className="name">Player {i}</div>
          <div className="bank">
          <div className="bank-value">$100</div>
        </div>
      </div>
    </div>
    );
  }
  return (
    <div className="Players">
      {players}
    </div>
  );
}

function Buttons({ addCardToRiver }) {
  return (
    <div className="buttons">
      {/* Pass addCardToRiver from App component */}
      <button onClick={addCardToRiver}>Add Card</button>
      {/* on check button show message saying check */}
      <button onClick={() => showPlayerChat(1, "Check")}>Check</button>
      <button>Call</button>
      <button>Raise</button>
      <button onClick={() => sendWSSMessage("Hi")}>Hi</button>
      <button onClick={() => userFolded(1)}>Fold</button>
      
    </div>
  );
}




//generate server list item


function ServerListItem({ server }) {
  return (
    <div className={`server-list-item server-${server.id}`}>
      <div className="server-name">{server.roomName}</div>
      <div className="server-players">{server.players.length}/8</div>
      <div className={`lock locked-${server.password}`}></div>
    </div>
  );
}


function fetchServerList() {
  //xhr request to get server list /fetchServerList
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/fetchServerList");
  xhr.send();
  xhr.onload = () => {
    console.log(xhr.response);

    //parse response
    let serverList = JSON.parse(xhr.response);
    //for each server in server list generate server list item
    let server;
    for(let i = 0; i < serverList.length; i++){
      server = serverList[i];
      console.log(server.name);
      let element = ServerListItem(server);
      document.querySelector(".server-list").appendChild(element);

    }
  }
  
}


function HideServerList() {
  document.querySelector(".server-list").classList.add("hide");
  document.querySelector(".create-new-game-menu").classList.remove("hide");
  document.querySelector(".create-new-game-menu").classList.add("show");
  document.querySelector("#find-game-title").innerHTML = "Create a Game";
}

function ShowServerList() {
  document.querySelector(".server-list").classList.remove("hide");
  document.querySelector(".create-new-game-menu").classList.remove("show");
  document.querySelector(".create-new-game-menu").classList.add("hide");
  document.querySelector("#find-game-title").innerHTML = "Find a Game";
}


function FindGamePopup() {
  const [serverList, setServerList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/fetchServerList")
      .then(response => response.json())
      .then(data => setServerList(data))
      .catch(error => console.error('Error:', error));
  }, []);
  

  //add blurred class to game-area
  document.querySelector(".game-area").classList.add("blurred");

//put createNewGameMenu in into find-game-popup


  return (
    <div className="find-game-popup">
      <h3 id='find-game-title'>Find a Game</h3>
      <div className="server-list">
        {serverList.map(server => 
          <ServerListItem key={server.id} server={server} />
        )}
      </div>

      {/* create game */}

    <div className="create-new-game-menu hide">
    <div className="server-name-new">
      <label className="create-game-label" htmlFor="server-name">Server Name</label>
      <input type="text" name="server-name-new" id="server-name-new" />
    </div>
    <div className="server-password">
      <label className="create-game-label" htmlFor="server-password">Password (Optional)</label>
      <input type="password" name="server-password" id="server-password" />
    </div>
    <div className="server-starting-buy-in">
      <label className="create-game-label" htmlFor="server-starting-buy-in">Starting Bank ($)</label>
      <input type="number" name="server-starting-buy-in" id="server-starting-buy-in" />
    </div>
    <div className="server-big-blind">
      <label className="create-game-label" htmlFor="server-big-blind">Blind Cost ($)</label>
      <input type="number" name="server-big-blind" id="server-big-blind" />
    </div>
    <div className="server-create-buttons">
      <div className="go-back-create-game">
        <button id="go-back-create-game-button" onClick={ShowServerList}>Back</button>
      </div>   
      <div className="server-create-submit">
        <button id="server-create-button" onClick={()=>sendWSSMessage("balls")}>Create</button>
      </div>
    </div>
    </div>
    
    {/* end create game */}

      <div className = "find-game-popup-lower">
        <input className="find-game-inputs" type="text" placeholder="Server Name" />
        <input className="find-game-inputs" type="password" placeholder="Password" />
        <button className="find-game-buttons">Connect</button>
        <button className="find-game-buttons" onClick={HideServerList}>New Game</button>
      </div>
    </div>

  );
}

function App() {
  const [cards, setCards] = useState([]);

  const addCardToRiver = () => {
    let card = singleCard(...randomCard(),"inCardPlace");
    setCards(prevCards => [...prevCards, card]);
  };


  return (
    <div className="App">
        <FindGamePopup/>      
        <h1>React Poker</h1>
        <div className="game-area">
          <Table cards={cards} />
          <Players />
        </div>
        {/* Pass addCardToRiver to Buttons component */}
        <Buttons addCardToRiver={addCardToRiver} />
    </div>
  );
}

//functions to send wss messages to server at port 8080
function sendWSSMessage(message) {
  let ws = new WebSocket("ws://localhost:8080");
  ws.onopen = () => {
    ws.send(message);
  };
  ws.onmessage = (event) => {
    console.log(event.data);
  };
}





export default App;
