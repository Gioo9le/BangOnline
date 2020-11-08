import React from 'react';
import '../App.scss';
import PlayedCard from "./PlayedCard";

class PlayerPlayedCards extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cards: [1, 2, 3, 4, 5, 6],
        }


    }

    render() {
        return (
            <div className="PlayerPlayedCards">
                {this.props.playedCards.map((item, idx) => {
                    console.log(item);
                    return <PlayedCard posY={idx} cardId={item}/>
                })}
            </div>
        );
    }
}

export default PlayerPlayedCards;