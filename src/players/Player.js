import React from 'react';
import '../App.scss';
import PlayerCard from './PlayerCard'
import Stats from './Stats'
import PlayerPlayedCards from "./PlayerPlayedCards";


class Player extends React.Component{
    render() {
        return (
            <div className={"Player"}>
                <PlayerCard/>
                <div className={"PlayerName"}>{this.props.name}</div>
                <Stats bullets={1} distanceFP={this.props.distanceFP} nCards={3}/>
                <PlayerPlayedCards playedCards={this.props.cardsPlayed}/>
                {/*<div>Carte in gioco sul tavolo</div>*/}
            </div>
        );
    }
}

export default Player;