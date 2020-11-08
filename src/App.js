import React from 'react';
import './App.scss';
import PlayerHand from "./cards/PlayerHand";
import PlayerBoard from "./players/PlayerBoard";
import socketIOClient from 'socket.io-client'
import MyPlayerPlayedCards from "./cards/MyPlayerPlayedCards";

var socket;

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            playerNames: ['Giorgio',
                'Matteo',
                'Federico',
                'Leonardo',
                'Eugenio',
                'Giovanni',
                'Marco',
            ],
            myHandCards: [],
            allPlayedCards: [[], [], [], [], [], [], []],
            allHandCards:[0, 0, 0, 0, 0, 0],
            allStats: [[5, 3], [4, 5], [3, 6], [2, 3], [4, 5], [3, 3]],
            lastCardPlayed: [null, null, null, null, null, null, null],
            allPlayers: [],
            nPlayers: 0,
            myAbsolutePosition: 0,
            isMyTurn:false
        };
        this.playACard = this.playACard.bind(this);
        this.drawCard = this.drawCard.bind(this);
        this.discardCard = this.discardCard.bind(this);
        socket = socketIOClient('http://192.168.1.217:1234')

    }

    componentDidMount() {
        document.documentElement.webkitRequestFullScreen();
        socket.emit('playerEntered', "Giorgio");
        socket.on('playerEntered', (numPlayers)=>{
            this.setState({
                nPlayers: numPlayers,
            })
            console.log('Players in game: '+numPlayers);
        })
        socket.on('exceptForLauncher', (msg)=>{console.log(msg + 'Entered')})
        socket.on('forLauncher',(assignedId)=>{
            console.log('I\'ve entered');
            this.setState({
                myAbsolutePosition: assignedId,
            })
            console.log(assignedId)
            let playerNames = this.state.playerNames;
            playerNames = this.shiftRelativePosition(playerNames, this.state.myAbsolutePosition);
            this.setState({
                playerNames:playerNames,
            });
            //setTimeout(()=>{console.log('After 10 second')}, 10000);
        });
        socket.on('cardPlayed', (userId, cardId, playedCards, handCards) => {
            playedCards = this.shiftRelativePosition(playedCards, this.state.myAbsolutePosition);
            console.log(playedCards);
            this.setState({
                allPlayedCards: playedCards,
            })
            console.log("Tutte le carte giocate sono");
            console.log(this.state.allPlayedCards);
            console.log("User "+userId+" played the card "+cardId+".");
        });
        socket.on('nextTurn', (userTurn)=>{
            console.log("Adesso e' il turno di: "+userTurn);
            this.setState({
                isMyTurn:(userTurn==this.state.myAbsolutePosition),
            })
        });
        socket.on('cardDrawn', (playerId, drawnCard)=>{

            console.log("Il giocatore: "+playerId+" ha pescato");
            if(playerId == this.state.myAbsolutePosition) {
                console.log("Hai pescato una carta");
                console.log(drawnCard);
                let myNewCards = this.state.myHandCards;
                myNewCards.push(drawnCard);
                this.setState({
                    myHandCards: myNewCards,
                })
                console.log(this.state.myHandCards);
            }
        });
        socket.on('cardDiscarded', (userId, cardId, playedCards) => {
            playedCards = this.shiftRelativePosition(playedCards, this.state.myAbsolutePosition);
            console.log(playedCards);
            this.setState({
                allPlayedCards: playedCards,
            })
            console.log(playedCards);
            console.log("User "+userId+" discarded the card "+cardId+".");
        });
    }

    shiftRelativePosition(arr, n){
        let tail = arr.splice(0, n);
        arr = arr.concat(tail);
        return arr;
    }

    playACard(cardIdx){
        let playedCards = this.state.allPlayedCards;
        let handCards = this.state.myHandCards;
        let lastCardPlayed = this.state.lastCardPlayed;
        lastCardPlayed[0] = handCards.splice(cardIdx, 1)[0];
        playedCards[0].push(lastCardPlayed[0]);
        this.setState({
            allPlayedCards: playedCards,
            myHandCards: handCards,
            lastCardPlayed: lastCardPlayed,
        });
        console.log("I played the card "+playedCards[0][playedCards[0].length-1]);

        socket.emit('cardPlayed', this.state.myAbsolutePosition, playedCards[0][playedCards[0].length-1], cardIdx)
    }

    nextTurn(){
        //TODO:Check if number of cards in hand is less than current life
        socket.emit('nextTurn');
    }

    drawCard(){
        socket.emit('cardDrawn', this.state.myAbsolutePosition)
    }

    discardCard(positionCard){
        console.log(positionCard);
        let newPlayedCards = this.state.allPlayedCards;
        console.log(newPlayedCards[0]);
        newPlayedCards[0].splice(positionCard, 1);
        console.log(newPlayedCards[0]);
        this.setState({
            allPlayedCards:newPlayedCards,
        })
        console.log(this.state.allPlayedCards[0]);
        socket.emit('cardDiscarded', this.state.myAbsolutePosition, positionCard);
    }


    render() {
        return (
            <div className="App">
                <PlayerBoard
                    nPlayers={this.state.nPlayers}
                    playerNames={this.state.playerNames.slice(1,7)}
                    allPlayedCards={this.state.allPlayedCards.slice(1, 7)}
                    allStats={this.state.allStats.slice(1,7)}
                    lastCardPlayed={this.state.lastCardPlayed.slice(1, 7)}
                />
                <MyPlayerPlayedCards
                    myPlayedCards={this.state.allPlayedCards[0]}
                    lastCardPlayed={this.state.lastCardPlayed[0]}
                    discardFun={this.discardCard}
                />
                <PlayerHand
                    myHandCards={this.state.myHandCards}
                    playCardFun={this.state.isMyTurn ? this.playACard : ()=>{}}
                />
                <button className={"drawTreasureCard"} onClick={this.state.isMyTurn ? this.drawCard : ()=>{}}> Pesca una carta Tesoro</button>
                <button className={"drawDoorCard"} onClick={this.state.isMyTurn ? this.drawCard : ()=>{}}> Pesca una carta Porta</button>
                <button className={"nextTurn"} onClick={this.state.isMyTurn ? this.nextTurn : ()=>{}} disabled={!this.state.isMyTurn}> Finisci turno </button>
            </div>
        );
    }
}

export default App;
