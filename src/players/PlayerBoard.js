import React from 'react';
import '../App.scss';
import Player from "./Player"
import PlayedCard from "./PlayedCard";

class PlayerBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            players: ['Giorgio',
                    'Matteo',
                    'Federico',
                    'Leonardo',
                    'Eugenio',
                    'Giovanni'
                ],
        }
    }

    calcDistance(i){
        return Math.min(i+1, this.state.players.length-i)
    }

    render() {
        return (
            <div className="PlayerBoard">
                {this.props.playerNames.map((item, idx) => {
                    return <Player name={item} distanceFP={this.calcDistance(idx)} cardsPlayed={this.props.allPlayedCards[idx]}/>
                })}
                {/*<Player name={"Giorgio"}/>*/}
                {/*<Player name={"Luigi"}/>*/}
                {/*<Player name={"Giovanni"}/>*/}
                {/*<Player name={"Marco"}/>*/}
                {/*<Player name={"Federico"}/>*/}
                {/*<Player name={"Eugenio"}/>*/}
            </div>
        );
    }
}

export default PlayerBoard;