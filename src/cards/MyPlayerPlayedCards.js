import React from 'react';
import MyPlayerPlayedCard from './MyPlayerPlayedCard'
import '../App.scss';

function importAll(r) {
    return r.keys().map(r);
}

class MyPlayerPlayedCards extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render() {
        const images = importAll(require.context('./img/items/', false, /\.(png|jpe?g|svg)$/));
        return (
            <div className={"MyPlayerPlayedCards"}style={this.props.imTarget?{backgroundColor:"rgba(232, 73, 73, 0.51)"}:{}}>

                {this.props.myPlayedCards.map((item, idx) => {
                    return <MyPlayerPlayedCard cardId={item} idx={idx} discardFun={this.props.discardFun} giveFun={this.props.giveFun} playerNames={this.props.playerNames}/>
                })}

                <div className={"myLastCardPlayed"}>
                    {this.props.myLastPlayed==-1? "lastCardPlayed": <img src={images[this.props.myLastPlayed]}/>}
                </div>
            </div>
        );
    }
}

export default MyPlayerPlayedCards;