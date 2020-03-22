import React from 'react';
import './App.scss';
import PlayerHand from "./cards/PlayerHand";
import Player from "./players/Player"

class App extends React.Component{
    render() {
        return (
            <div className="App">
                <Player id={"p1"}> 1 </Player>
                <Player id={"p2"}> 2 </Player>
                <Player id={"p3"}> 3 </Player>
                <Player id={"p4"}> 4 </Player>
                <PlayerHand/>
            </div>
        );
    }
}

export default App;
