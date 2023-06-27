import React, { useState, useCallback } from 'react';
import useWebSocket from './sendWSSMessage'; // Adjust this path to wherever your useWebSocket hook is

let WSS_URL = "ws://localhost:8080";


function unBlur() {
    let gameArea = document.querySelector(".game-area");
    gameArea.classList.remove("blurred");
  }
  
  function hideGamePopup(){
    let popup = document.querySelector(".find-game-popup");
    popup.classList.add("hide");
  
  }

function PlayerCards() {
    return (
      <div className="player-cards">
        <div className="card noflip"></div>
        <div className="card noflip"></div>
      </div>
    );
}

function Player({ player }) {
  return (
    <div className={"player player-" + player.id}>
      <PlayerCards />
      <div className="player-chat">
        <div className="chat-message">Hello</div>
      </div>
      <div className="avatar"></div>
      <div className="name">Player {player.name}</div>
      <div className="bank">
        <div className="bank-value">{player.bank}</div>
      </div>
    </div>
  );
}


function PokerTable() {
  const [players, setPlayers] = useState([]);

  const handleWebSocketMessage = useCallback((message) => {
    switch (message.type) {
      case 'join':
        addPlayer(message.player);
        break;
      case 'leave':
        removePlayer(message.player.id);
        break;
      case 'error':
        alert(message.message);
        break;

      default:
        break;
    }
  }, []);

  useWebSocket(WSS_URL, handleWebSocketMessage);

  const addPlayer = (player) => {
    setPlayers(prevPlayers => [...prevPlayers, player]);
  }

  const removePlayer = (playerId) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId));
  }

  return (
    <div className="Players">
    {players.map(player => <Player key={player.id} player={player} />)}
    {/* Here you can have a form or a button to add a player using addPlayer function
         Similarly, a button to remove a player using removePlayer function */}
  </div>
  );
}

export default PokerTable;
