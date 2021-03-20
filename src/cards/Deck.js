import React from 'react';
import '../App.scss';
import backImage from "./img/cards_1_back.png";

function importAll(r) {
    return r.keys().map(r);
}

class Deck extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cardId: 50,
            isClicked:false,
        }
    }

    // componentDidMount() {
    //     fetch('http://192.168.43.137:1234/extractCard')
    //         .then(res => res.json())
    //         .then(res => this.setState({cardId: res.cardId}))
    //         .catch(err => console.log(err))
    // }

    render() {
        const images = importAll(require.context('./img/items/', false, /\.(png|jpe?g|svg)$/));
        //console.log(images);
        return (
            <div className={"drawTreasureCard"} onMouseOver={() => {this.setState({isClicked:true})}} onMouseOut={() => {this.setState({isClicked:false})}} hidden={this.props.imDead}>
                <button className={"b1"} onClick={this.props.drawFun} hidden={!this.state.isClicked} > Pesca </button>
                <button className={"b2"} onClick={this.props.extractFun} hidden={!this.state.isClicked} > Estrai </button>
                <img src={backImage} width="100%" height="100%" alt={''}/>

            </div>
        );
    }
}

export default Deck;