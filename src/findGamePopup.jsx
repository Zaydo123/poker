import React, { useState, useEffect } from 'react';
import sendWSSMessage from './sendWSSMessage.jsx';

function sendJoinRequest(serverID){

    //first check if password is required
    //if password is required, prompt user for password

    //fetch request to /requiresPassword/:serverId

    let origin = window.location.origin;
    if(origin.includes("3001")){
        origin = origin.replace("3001", "3000");
    }

    fetch(`${origin}/requiresPassword/${serverID}`)
        .then(response => response.json())
        .then(data => {
            let password = "";
            if(data){
                //prompt user for password
                password = prompt("Enter password");
            }
            let res = sendWSSMessage({"type":"join", "serverID":serverID, "password":password});
            console.log(res);

        })
        .catch(error => console.error('Error:', error));

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

function ServerListItem({ server }) {
    return (
      <div onClick={()=> sendJoinRequest(server.id)} className={`server-list-item server-${server.id}`}>
        <div className="server-name">{server.roomName}</div>
        <div className="server-players">{server.players.length}/8</div>
        <div className={`lock locked-${server.password}`}></div>
      </div>
    );
}

function createNewRoom(){
    //get room name
    let roomName = document.querySelector("#server-name-new").value;
    //get password
    let password = document.querySelector("#server-password").value;
    //get starting bank
    let startingBank = document.querySelector("#server-starting-buy-in").value;
    //get blind cost
    let blindCost = document.querySelector("#server-big-blind").value;
    let res = sendWSSMessage({"type":"create", "roomName":roomName, "password":password, "startingBank":startingBank, "blindCost":blindCost});
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


function FindGamePopup() {
    const [serverList, setServerList] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:3000/fetchServerList")
        .then(response => response.json())
        .then(data => setServerList(data))
        .catch(error => console.error('Error:', error));
    }, []);
    
  
    //add blurred class to game-area
    //if can find game-area
    if(document.querySelector(".game-area")){
      document.querySelector(".game-area").classList.add("blurred");
    }
  
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
          <button id="server-create-button" onClick={()=>createNewRoom()}>Create</button>
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

export default FindGamePopup;



  