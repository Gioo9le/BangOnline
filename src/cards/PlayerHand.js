import React from 'react';
import Card from './Card.js'
import '../App.scss';
import Player from "../players/Player";
import MyPlayerPlayedCard from "./MyPlayerPlayedCard";

class PlayerHand extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className={"PlayerHand"}>
                {this.props.myHandCards.map((item, idx) => {
                    return <MyPlayerPlayedCard
                        cardId={item}
                        idx={idx}
                        discardFun={this.props.discardFun}
                        giveFun={this.props.giveFun}
                        playerNames={this.props.playerNames}
                        playCardFun={this.props.playCardFun}
                        cardType={"Card"}
                        relativePos={idx}
                        isHand={true}
                    />

                })}
            </div>
        );
    }
}

export default PlayerHand;