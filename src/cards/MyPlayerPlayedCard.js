import React from 'react';
import '../App.scss';

function importAll(r) {
    return r.keys().map(r);
}

class MyPlayerPlayedCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cardId: 50,
            isClicked: false,
        }
    }

    componentDidMount() {
        fetch('http://192.168.1.218:1234/extractCard')
            .then(res => res.json())
            .then(res => this.setState({cardId: res.cardId}))
            .catch(err => console.log(err))
    }

    render() {
        const images = importAll(require.context('./img/items/', false, /\.(png|jpe?g|svg)$/));
        //console.log(images);
        return (
            <div className={"MyPlayerPlayedCard"}>
                <button className={"b1"} onClick={()=>{this.props.discardFun(this.props.idx)}} hidden={!this.state.isClicked} > Discard </button>
                <button className={"b2"} onClick={()=>{}} hidden={!this.state.isClicked} > Give to </button>
                <img src={images[this.props.cardId]} width="100%" height="100%" alt={''} onClick={() => {let newState = this.state.isClicked; this.setState({isClicked:!newState})}}/>
            </div>
        );
    }
}

export default MyPlayerPlayedCard;