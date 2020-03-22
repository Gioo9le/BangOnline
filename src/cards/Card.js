import React from 'react';
import '../App.scss';

function importAll(r) {
    return r.keys().map(r);
}




class Card extends React.Component{
    render() {
        const images = importAll(require.context('./img/', false, /\.(png|jpe?g|svg)$/));
        //console.log(images);
        return (
            <div className={"Card"}>
                <img src={images[this.props.cardId]} width="100%" height="100%"/>
            </div>
        );
    }
}

export default Card;