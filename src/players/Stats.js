import React from 'react';
import '../App.scss';
import BulletIcon from './img/icons/bullet.svg'
import SightIcon from './img/icons/icons8-centro-di-gravità-64.png'
import CardsIcon from './img/icons/playing-cards.svg'


function importAll(r) {
    return r.keys().map(r);
}

class Stats extends React.Component{
    render() {
        return (
            <div className={"PlayerStats"}>
                {/*<div>Numero Carte in mano</div>*/}
                {/*<div>Pallottole residue</div>*/}
                {/*<div>Distanza</div>*/}
                <div className={"Stat"}>

                    <img className={"StatIcon"} src={BulletIcon}/> {this.props.bullets}

                </div>
                <div className={"Stat"}>

                    <img className={"StatIcon"} src={SightIcon}/> {this.props.distanceFP}

                </div>
                <div className={"Stat"}>

                    <img className={"StatIcon"} src={CardsIcon}/> {this.props.nCards}

                </div>
            </div>
        );
    }
}

export default Stats;