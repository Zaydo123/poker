import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import FindGamePopup from './findGamePopup'; 
import sendWSSMessage from './sendWSSMessage'; 
import PokerTable from './player';


let numberOfPlayers = 1;
let players = [];

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








function App() {
  const [cards, setCards] = useState([]);

  const addCardToRiver = () => {
    let card = singleCard(...randomCard(),"inCardPlace");
    setCards(prevCards => [...prevCards, card]);
  };


  return (
    <div className="App">
        <FindGamePopup/>      
        <h1>React</h1>
        <div className="game-area blurred">
          <Table cards={cards} />
          <PokerTable /> {/* USER HANDLER */}
          
        </div>
        {/* Pass addCardToRiver to Buttons component */}
        <Buttons addCardToRiver={addCardToRiver} />
    </div>
  );
}





export default App;
