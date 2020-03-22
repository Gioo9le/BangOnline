import React from 'react';
import Card from './Card.js'
import '../App.scss';

class PlayerHand extends React.Component{
    render() {
        return (
            <div className={"PlayerHand"}>
                <Card cardId={0}/>
                <Card cardId={10}/>
                <Card cardId={20}/>
                <Card cardId={30}/>
                <Card cardId={15}/>
            </div>
        );
    }
}

export default PlayerHand;