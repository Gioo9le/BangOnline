import React from 'react';
import '../App.scss';

class Player extends React.Component{
    render() {
        return (
            <div className={"Player"} id={this.props.id}>
                <div>Nome</div>
                <div>Icona</div>
                <div>Numero Carte in mano</div>
                <div>Pallottole residue</div>
                <div>Carte in gioco sul tavolo</div>
            </div>
        );
    }
}

export default Player;