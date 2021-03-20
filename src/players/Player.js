import React from 'react';
import '../App.scss';
import PlayerCard from './PlayerCard'
import Stats from './Stats'
import PlayerPlayedCards from "./PlayerPlayedCards";


function importAll(r) {
    return r.keys().map(r);
}


class Player extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            target:false,
        }
    }


    render() {
        const images = importAll(require.context('./img/items/', false, /\.(png|jpe?g|svg)$/));
        return (
            <div className={"Player"} style={this.props.target?{backgroundColor:"rgba(232, 73, 73, 0.51)"}:{}}>
                <PlayerCard cowboyId={this.props.cowboyId} clickFun={()=>{this.props.selectTargetFun(this.props.idx); console.log("Change target")}}/>
                <div className={"PlayerName"}>{this.props.name}</div>
                <Stats bullets={this.props.allStats[0]} distanceFP={this.props.distanceFP} nCards={this.props.allStats[1]}/>
                <PlayerPlayedCards playedCards={this.props.cardsPlayed==undefined?[]:this.props.cardsPlayed}/>
                <div className={"lastCardPlayed"} hidden={this.props.nonPermanent==-1}>
                    {this.props.nonPermanent==-1? "lastCardPlayed": <img src={images[this.props.nonPermanent]}/>}

                </div>
                {/*<div>Carte in gioco sul tavolo</div>*/}
            </div>
        );
    }
}

export default Player;