import React from 'react';
import '../App.scss';
import Player from "./Player"
import PlayedCard from "./PlayedCard";

class PlayerBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    calcDistance(i){
        return Math.min(i+1, this.props.playerNames.length-i)
    }

    render() {
        return (
            <div className="PlayerBoard">
                {console.log("Player to be displayed")}
                {console.log(this.props.allPlayedCards)}
                {console.log(this.props.playerNames)}
                {this.props.playerNames.map((item, idx) => {
                    return <Player
                        name={item}
                        distanceFP={this.calcDistance(idx)}
                        cardsPlayed={this.props.allPlayedCards[idx]}
                        allStats={this.props.allStats[idx]==undefined?[0,0]:this.props.allStats[idx]}
                        cowboyId={this.props.cowboysId[idx]==undefined?[0]:this.props.cowboysId[idx]}
                    />
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