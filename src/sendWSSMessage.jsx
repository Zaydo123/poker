import { useEffect, useRef } from 'react';





/*
      if(received.type === "error"){
        alert(received.message);
      }
  
      if(received.type === "join"){

      }

      if(received.type =="join-self"){
        unBlur();
        hideGamePopup();

        //add player to Player        //save received.player.id to local storage
        localStorage.setItem("playerId", received.player.id);

        
      }
*/

      



const useWebSocket = (url, onMessage) => {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket opened');
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
    };

    ws.current.onmessage = (e) => {
      onMessage(JSON.parse(e.data));
    };

    return () => {
      ws.current.close();
    };
  }, [url, onMessage]);

  const sendWSSMessage = (message) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { sendWSSMessage };
}

export default useWebSocket;

