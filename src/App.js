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
      console.log(element);
      document.querySelector(".server-list").appendChild(element);

    }
  }
  
}

function FindGamePopup() {
  const [serverList, setServerList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/fetchServerList")
      .then(response => response.json())
      .then(data => setServerList(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="find-game-popup">
      <h3>Find a Game</h3>
      <div className="server-list">
        {serverList.map(server => 
          <ServerListItem key={server.id} server={server} />
        )}
      </div>
      <div className = "find-game-popup-lower">
        <input className="find-game-inputs" type="text" placeholder="Server Name" />
        <input className="find-game-inputs" type="password" placeholder="Password" />
        <button className="find-game-buttons">Connect</button>
        <button className="find-game-buttons">New Game</button>
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
      <h1>React Poker</h1>
      <FindGamePopup />
      <Table cards={cards} />
      <Players />
    
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
