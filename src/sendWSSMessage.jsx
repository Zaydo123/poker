

function sendWSSMessage(message) {
    let ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      ws.send(JSON.stringify(message));
    };
  
    ws.onmessage = (event) => {
  
      //jsonify event.data
      let received = JSON.parse(event.data);
      console.log(received);
  

      if(received.type === "error"){
        alert(received.message);
      }
  
      if(received.type === "player-join"){

      }
    
    
    };
}

export default sendWSSMessage;