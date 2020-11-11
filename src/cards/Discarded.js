import React from 'react';
import '../App.scss';
import clover from "./img/clover.svg"
import spade from "./img/symbol-of-spades.svg"
import diamond from "./img/diamond.svg"
import heart from "./img/heart.svg"

function importAll(r) {
    return r.keys().map(r);
}

class Discarded extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cardId: 50,
            isClicked:false,
        }
    }

    componentDidMount() {
        fetch('http://192.168.43.137:1234/extractCard')
            .then(res => res.json())
            .then(res => this.setState({cardId: res.cardId}))
            .catch(err => console.log(err))
    }

    render() {
        const images = importAll(require.context('./img/items/', false, /\.(png|jpe?g|svg)$/));
        const symbols = [clover, spade, diamond, heart];
        //console.log(images);
        return (
            <div className={"Discarded"} onMouseOver={() => {this.setState({isClicked:true})}} onMouseOut={() => {this.setState({isClicked:false})}} hidden={this.props.discardedList.length==0}>
                <img className={"DiscardedImage"} src={images[this.props.discardedList[this.props.selectedCard]]} width="100%" height="100%" alt={''} />
                <div>
                    <button className={"b3"} onClick={this.props.drawFun} hidden={!this.state.isClicked} > Draw </button>
                    <button onClick={this.props.previousDiscardedFun} disabled={this.props.selectedCard==0}>-</button>
                    <span>      </span>
                    {this.props.discardedList.length==0?0:this.props.selectedCard+1}/{this.props.discardedList.length}
                    <span>   </span>
                    <button onClick={this.props.nextDiscardedFun} disabled={this.props.selectedCard==this.props.discardedList.length-1||this.props.discardedList.length==0}>+</button>
                </div>
                <div>
                    <img src={symbols[this.props.ultimoSeme]} className={'symbol'}/> {this.props.ultimoNumero}
                </div>
            </div>
        );
    }
}

export default Discarded;