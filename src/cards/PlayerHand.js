import React from 'react';
import Card from './Card.js'
import '../App.scss';
import Player from "../players/Player";

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
                    return <Card
                        cardId={item}
                        playCardFun={this.props.playCardFun}
                        relativePos={idx}
                    />
                })}
            </div>
        );
    }
}

export default PlayerHand;