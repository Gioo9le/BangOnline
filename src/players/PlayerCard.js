import React from 'react';
import '../App.scss';

function importAll(r) {
    return r.keys().map(r);
}

class PlayerCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            playerId: -1,
        }
    }
    componentDidMount() {
        fetch('http://192.168.43.137:1234/extractPlayer')
            .then(res => res.json())
            .then(res => this.setState({playerId: res.playerId}))
            .catch(err => console.log(err))
    }

    render() {
        const images = importAll(require.context('./img/cowboys/', false, /\.(png|jpe?g|svg)$/));

        return (
            <div className={"PlayerCard"} id={this.props.id} onClick={this.props.clickFun}>
                <img src={images[this.props.cowboyId]} width="100%" height="100%" alt={''}/>
            </div>
        );
    }
}

export default PlayerCard;