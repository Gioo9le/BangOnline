import React from 'react';
import MyPlayerPlayedCard from './MyPlayerPlayedCard'
import '../App.scss';

class MyPlayerPlayedCards extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className={"MyPlayerPlayedCards"}>
                {this.props.myPlayedCards.map((item, idx) => {
                    return <MyPlayerPlayedCard cardId={item} idx={idx} discardFun={this.props.discardFun}/>
                })}
            </div>
        );
    }
}

export default MyPlayerPlayedCards;