function playerCards() {
    return (
      <div className="player-cards">
  
        <div className="card noflip"></div>
  
        <div className="card noflip"></div>
  
      </div>
    );
  }

function Player(player){
        <div className={"player player-" + player.id}>
          {playerCards()}
            <div className="player-chat">
              <div className="chat-message">Hello</div>
            </div>
            <div className="avatar"></div>
            <div className="name">Player {player.name}</div>
            <div className="bank">
            <div className="bank-value">{player.bank}</div>
          </div>
        </div>
  }

export default Player;