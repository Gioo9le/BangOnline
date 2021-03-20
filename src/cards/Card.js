import React from 'react';
import '../App.scss';

function importAll(r) {
    return r.keys().map(r);
}

class Card extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cardId: 50,
        }
    }

    // componentDidMount() {
    //     fetch('http://192.168.1.217:1234/extractCard')
    //         .then(res => res.json())
    //         .then(res => this.setState({cardId: res.cardId}))
    //         .catch(err => console.log(err))
    // }

    render() {
        const images = importAll(require.context('./img/items/', false, /\.(png|jpe?g|svg)$/));
        //console.log(images);
        return (
            <div className={"Card"}>
                <img src={images[this.props.cardId]} width="100%" height="100%" alt={''} onClick={() => {this.props.playCardFun(this.props.relativePos)}}/>
            </div>
        );
    }
}

export default Card;