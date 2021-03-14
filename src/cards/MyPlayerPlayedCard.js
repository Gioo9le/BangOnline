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
            isGiving:false,
            cardBeingGiven:-1,
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
            <div className={this.props.cardType} onMouseOver={() => {this.setState({isClicked:true})}} onMouseOut={() => {this.setState({isClicked:false, isGiving:false})}}>
                <button className={"b1"} onClick={()=>{this.props.discardFun(this.props.idx, this.props.isHand)}} hidden={!this.state.isClicked} > Discard </button>
                <button className={"b2"} onMouseOver={()=>{this.setState({isGiving:true})}} hidden={!this.state.isClicked} > Give to </button>
                <div className={'b4'} hidden={!this.state.isGiving} onMouseOver={()=>{this.setState({isGiving:true})}}>
                {
                    this.props.playerNames.map((item, idx) => {
                        return <button className={"givingButton"} hidden={!this.state.isGiving}  onClick={()=>{this.props.giveFun(this.props.idx, idx, this.props.isHand)}}>{item}</button>
                    })
                }
                </div>

                <img src={images[this.props.cardId]} width="100%" height="100%" alt={''} onClick={() => {this.props.playCardFun(this.props.relativePos)}}/>
            </div>
        );
    }
}

export default MyPlayerPlayedCard;