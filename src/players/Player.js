import React from 'react';
import '../App.scss';
import PlayerCard from './PlayerCard'
import Stats from './Stats'
import PlayerPlayedCards from "./PlayerPlayedCards";


class Player extends React.Component{
    render() {
        return (
            <div className={"Player"}>
                <PlayerCard cowboyId={this.props.cowboyId} clickFun={()=>{}}/>
                <div className={"PlayerName"}>{this.props.name}</div>
                <Stats bullets={this.props.allStats[0]} distanceFP={this.props.distanceFP} nCards={this.props.allStats[1]}/>
                <PlayerPlayedCards playedCards={this.props.cardsPlayed==undefined?[]:this.props.cardsPlayed}/>
                {/*<div>Carte in gioco sul tavolo</div>*/}
            </div>
        );
    }
}

export default Player;