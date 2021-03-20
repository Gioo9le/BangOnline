import React from 'react';
import '../App.scss';
import BulletIcon from './img/icons/bullet.svg'
import SightIcon from './img/icons/icons8-centro-di-gravità-64.png'
import CardsIcon from './img/icons/playing-cards.svg'


function importAll(r) {
    return r.keys().map(r);
}

class MyStats extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className={"MyStats"} hidden={this.props.imDead}>
                {this.props.myName}
                {/*<div>Numero Carte in mano</div>*/}
                {/*<div>Pallottole residue</div>*/}
                {/*<div>Distanza</div>*/}
                <div className={"MyStat"}>
                    <button onClick={this.props.decrementBullets}>-</button>
                    <span>    </span>
                    <img className={"StatIcon"} src={BulletIcon}/>      {this.props.bullets}
                    <span>   </span>
                    <button onClick={this.props.incrementBullets}>+</button>
                </div>
            </div>
        );
    }
}

export default MyStats;