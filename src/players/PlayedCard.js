import React from 'react';
import '../App.scss';

function importAll(r) {
    return r.keys().map(r);
}

class PlayedCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            cardId: 50,
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
        console.log(images);
        console.log("La carta giocata e' la "+this.props.cardId);
        //console.log(images);
        return (
            <div className={"PlayedCard"} style={{top: this.props.posY*4.7 + 'vh'}}>
                <img src={images[this.props.cardId]} width="100%" height="100%" alt={''}/>
            </div>
        );
    }
}

export default PlayedCard;