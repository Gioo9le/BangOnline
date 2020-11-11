import React from 'react';
import './App.scss';
import PlayerHand from "./cards/PlayerHand";
import PlayerBoard from "./players/PlayerBoard";
import socketIOClient from 'socket.io-client'
import MyPlayerPlayedCards from "./cards/MyPlayerPlayedCards";
import Discarded from "./cards/Discarded";
import MyStats from "./players/MyStats";
import Stats from "./players/Stats";
import backImage from "./cards/img/cards_1_back.png"
import Card from "./cards/Card";
import PlayerCard from "./players/PlayerCard";
import Deck from "./cards/Deck";
import PlayerPlayedCards from "./players/PlayerPlayedCards";
import fuorilegge from "./cards/img/roles/01_fuorilegge.png";
import rinnegato from "./cards/img/roles/01_rinnegato.png";
import sceriffo from "./cards/img/roles/01_sceriffo.png";
import vice from "./cards/img/roles/01_vice.png";

var socket;

class PlayBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            playerNames: [""],
            cowboysID:[],
            myHandCards: [],
            allPlayedCards: [[]],
            allStats: [[1,1]],
            lastCardPlayed: [null],
            discarded:[],
            selectedDiscarded:0,
            nPlayers: 0,
            myAbsolutePosition: 0,
            isMyTurn:false,
            lastMessage:"",
            isWaitingRoom:true,
            chooseCowboy:false,
            cowboyOptions:[],
            ultimoSemeEstratto:-1,
            ultimoNumeroEstratto:-1,
            myRole: -1,
        };
        this.playACard = this.playACard.bind(this);
        this.drawCard = this.drawCard.bind(this);
        this.discardCard = this.discardCard.bind(this);
        this.previousDiscarded = this.previousDiscarded.bind(this);
        this.nextDiscarded = this.nextDiscarded.bind(this);
        this.drawDiscarded = this.drawDiscarded.bind(this);
        this.nextTurn = this.nextTurn.bind(this);
        this.incrementBullets = this.incrementBullets.bind(this);
        this.decrementBullets = this.decrementBullets.bind(this);
        this.extractCard = this.extractCard.bind(this);
        this.giveCard = this.giveCard.bind(this);
        socket = socketIOClient('http://192.168.43.137:1234/');
        socket.emit("checkIsPlaying", this.props.room);

    }

    componentDidMount() {
        //document.documentElement.webkitRequestFullScreen();

        socket.emit('playerEntered', this.props.playerName, this.props.room);
        socket.on('playerIsEntered', (numPlayers, allPlayedCards, discarded, stats, cowboyChoosen)=>{
            console.log("CowboyChosen"+cowboyChoosen);
            console.log("Ciao"+allPlayedCards);
            this.setState({
                allPlayedCards: this.shiftRelativePosition(allPlayedCards, this.state.myAbsolutePosition),
                allStats:this.shiftRelativePosition(stats, this.state.myAbsolutePosition),
                nPlayers: numPlayers,
                lastMessage:'Players in game: '+numPlayers,
                discarded: discarded,
                cowboysID: this.shiftRelativePosition(cowboyChoosen, this.state.myAbsolutePosition),
            });
            console.log('Players in game: '+numPlayers);
        });
        socket.on('exceptForLauncher', (msg, allNames)=>{
            console.log(msg + 'Entered now there are '+allNames);
            let playerNamesNew = this.shiftRelativePosition(allNames, this.state.myAbsolutePosition);
            this.setState({
                playerNames:playerNamesNew,
            });
        });
        socket.on('forLauncher',(assignedId, playerNames)=>{
            console.log('I\'ve entered');
            let playerNamesNew = this.shiftRelativePosition(playerNames, assignedId);
            this.setState({
                myAbsolutePosition: assignedId,
                playerNames:playerNamesNew,
                lastMessage:'I\'ve entered'
            });
            console.log(assignedId);
            //setTimeout(()=>{console.log('After 10 second')}, 10000);
        });

        socket.on('cardPlayed', (userId, cardId, playedCards, handCards) => {
            playedCards = this.shiftRelativePosition(playedCards, this.state.myAbsolutePosition);
            console.log(playedCards);
            this.setState({
                allPlayedCards: playedCards,
                lastMessage:"User "+userId+" played the card "+cardId+"."
            })
            console.log("Tutte le carte giocate sono");
            console.log(this.state.allPlayedCards);
            console.log("User "+userId+" played the card "+cardId+".");

        });
        socket.on('nextTurn', (userTurn)=>{
            console.log("Adesso e' il turno di: "+userTurn);
            this.setState({
                isMyTurn:(userTurn==this.state.myAbsolutePosition),
                lastMessage:"Adesso e' il turno di: "+userTurn
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
        socket.on('cardDiscarded', (userId, cardId, playedCards, newDiscarded) => {
            playedCards = this.shiftRelativePosition(playedCards, this.state.myAbsolutePosition);
            console.log(playedCards);
            this.setState({
                allPlayedCards: playedCards,
                discarded: newDiscarded,
                selectedDiscarded:newDiscarded.length-1,
            })
            console.log(playedCards);
            console.log("User "+userId+" discarded the card "+cardId+".");
        });
        socket.on("drawDiscarded", (playerId, newDiscarded, discardedCardDrawed, newStats)=>{
            let newDiscardedSelected = this.state.selectedDiscarded==0?0:this.state.selectedDiscarded-1;
            this.setState({
                discarded:newDiscarded,
                lastMessage:"User "+playerId+" drawed the card "+discardedCardDrawed+" from the discarded",
                selectedDiscarded:newDiscardedSelected,
                allStats:this.shiftRelativePosition(newStats, this.state.myAbsolutePosition),
            })
        })
        socket.on("playerLeft", (playerExitedId, playerNames, playedCards, nPlayer, discardedNew)=>{
            if(this.state.myAbsolutePosition>=playerExitedId){
                let newPos = this.state.myAbsolutePosition-1;
                this.setState({myAbsolutePosition: newPos})
            }
            let newPlayerNames = this.shiftRelativePosition(playerNames, this.state.myAbsolutePosition);
            let newPlayedCards = this.shiftRelativePosition(playedCards, this.state.myAbsolutePosition);
            this.setState({
                playerNames: newPlayerNames,
                allPlayedCards: newPlayedCards,
                nPlayers: nPlayer,
                discarded:discardedNew,
            })
        });
        socket.on("beginGame",(roles)=>{

            this.setState({
                isWaitingRoom:false,
                myRole: roles[this.state.myAbsolutePosition],
            })
        })
        socket.on("statsChanged", (newStats)=>{
            this.setState({
                allStats:this.shiftRelativePosition(newStats, this.state.myAbsolutePosition),
            })
        });
        socket.on("isPlaying", (isPlaying)=>{
            this.setState({
                isWaitingRoom: !isPlaying,
            })
        })
        socket.on('pickCowboyCard', (firstCard, secondCard)=>{
            console.log("Choosing")
            this.setState({
                cowboyOptions:[firstCard, secondCard],
            })
        });
        socket.on('cowboyChanged', (newCowboys)=>{
            this.setState({
                cowboysID:this.shiftRelativePosition(newCowboys, this.state.myAbsolutePosition),
            })
        });
        socket.on('cardExtracted', (newDiscarded, seme, numero)=>{
            this.setState({
                discarded:newDiscarded,
                ultimoSemeEstratto:seme,
                ultimoNumeroEstratto:numero,
                selectedDiscarded:newDiscarded.length-1
            })
        })
        socket.on('playedChanged', (newPlayed)=>{
            this.setState({
                allPlayedCards:this.shiftRelativePosition(newPlayed, this.state.myAbsolutePosition),
            })
        })


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
        let nHandCards = this.state.allStats;
        nHandCards[0][1]--;
        lastCardPlayed[0] = handCards.splice(cardIdx, 1)[0];
        playedCards[0].push(lastCardPlayed[0]);
        this.setState({
            allPlayedCards: playedCards,
            myHandCards: handCards,
            lastCardPlayed: lastCardPlayed,
            allStats: nHandCards,
            lastMessage:"I played the card "+playedCards[0][playedCards[0].length-1]
        });
        console.log("I played the card "+playedCards[0][playedCards[0].length-1]);

        socket.emit('cardPlayed', this.state.myAbsolutePosition, playedCards[0][playedCards[0].length-1], cardIdx, this.props.room)
    }

    nextTurn(){
        //TODO:Check if number of cards in hand is less than current life
        socket.emit('nextTurn', this.props.room);
    }

    drawCard(){
        socket.emit('cardDrawn', this.state.myAbsolutePosition, this.props.room)
    }

    extractCard(){
        socket.emit('cardExtracted', this.props.room)
    }

    discardCard(positionCard){
        console.log(positionCard);
        let newPlayedCards = this.state.allPlayedCards;
        console.log(newPlayedCards[0]);
        let newDiscarded = this.state.discarded;
        newDiscarded.push(newPlayedCards[0].splice(positionCard, 1));
        console.log(newPlayedCards[0]);
        this.setState({
            allPlayedCards:newPlayedCards,
            discarded:newDiscarded,
            selectedDiscarded:newDiscarded.length-1,
        });
        console.log(this.state.allPlayedCards[0]);
        socket.emit('cardDiscarded', this.state.myAbsolutePosition, positionCard, this.props.room);
    }

    previousDiscarded(){
        let newSelectedDiscarded = this.state.selectedDiscarded-1;
        this.setState({
            selectedDiscarded:newSelectedDiscarded
        })
    }
    nextDiscarded(){
        let newSelectedDiscarded = this.state.selectedDiscarded+1;
        this.setState({
            selectedDiscarded:newSelectedDiscarded
        })
    }
    drawDiscarded(){
        let myNewHandCards = this.state.myHandCards;
        let newDiscarded = this.state.discarded;
        myNewHandCards.push(newDiscarded.splice(this.state.selectedDiscarded,1));
        socket.emit("drawDiscarded", this.state.myAbsolutePosition, this.state.selectedDiscarded, this.props.room);
        let newSelectedDiscarded = this.state.selectedDiscarded==0?0:this.state.selectedDiscarded-1;
        this.setState({
            myHandCards:myNewHandCards,
            discarded:newDiscarded,
            selectedDiscarded:newSelectedDiscarded,
        })

    }

    incrementBullets(){
        socket.emit('lifeChanged', this.state.myAbsolutePosition, this.state.allStats[0][0]+1, this.props.room);
    }

    decrementBullets(){
        socket.emit('lifeChanged', this.state.myAbsolutePosition, this.state.allStats[0][0]-1, this.props.room);
    }

    choosingCowboy(){
        socket.emit('drawCowboys', this.state.myAbsolutePosition, this.props.room)
    }
    cowboyChoosen(cowboyId){
        this.setState({
            chooseCowboy:true,
            cowboyOptions:[],
        })
        socket.emit('cowBoyChoosen', this.state.myAbsolutePosition, cowboyId, this.props.room);
    }

    giveCard(cardIdx, receiverId){
        socket.emit("cardGiven", this.state.myAbsolutePosition, cardIdx, receiverId, this.props.room)
    }



    render() {
        const rolesImg = [sceriffo, rinnegato, fuorilegge, vice];
        if(this.state.isWaitingRoom){
            console.log("Scelte");
            console.log(this.state.cowboysID);
            return(
                <div>
                    {this.state.playerNames.map((item, idx) => {
                        return <div> {idx}.{item} - {this.state.cowboysID[idx]==-1?"Not choosen":this.state.cowboysID[idx]}</div>
                    })}
                    <button hidden={this.state.chooseCowboy} onClick={()=>{this.choosingCowboy()}}>Draw Cowboys</button>
                    {this.state.cowboyOptions.map((item, idx) => {
                        return (<div className={'Cowboy'+idx}>
                            <PlayerCard cowboyId={item} clickFun={()=>{this.cowboyChoosen(item)}}/>
                        </div>);
                    })}
                    <button hidden={this.state.myAbsolutePosition!=0||!this.state.chooseCowboy} onClick={()=>{socket.emit("beginGame", this.props.room)}}>Begin</button>

                </div>

            );
        }else{
            return (
                <div className="PlayBoard">
                    <PlayerBoard
                        nPlayers={this.state.nPlayers}
                        playerNames={this.state.playerNames.slice(1,7)}
                        allPlayedCards={this.state.allPlayedCards.slice(1, 7)}
                        allStats={this.state.allStats.slice(1,7)}
                        lastCardPlayed={this.state.lastCardPlayed.slice(1, 7)}
                        cowboysId={this.state.cowboysID.slice(1,7)}
                    />
                    <MyPlayerPlayedCards
                        myPlayedCards={this.state.allPlayedCards[0]}
                        lastCardPlayed={this.state.lastCardPlayed[0]}
                        discardFun={this.discardCard}
                        giveFun={this.giveCard}
                        playerNames={this.state.playerNames}
                    />
                    <PlayerHand
                        myHandCards={this.state.myHandCards}
                        playCardFun={this.playACard}
                        //playCardFun={this.state.isMyTurn ? this.playACard : ()=>{}}
                    />
                    <Discarded
                        discardedList={this.state.discarded}
                        selectedCard={this.state.selectedDiscarded}
                        nextDiscardedFun={this.nextDiscarded}
                        previousDiscardedFun={this.previousDiscarded}
                        drawFun={this.drawDiscarded}
                        ultimoSeme={this.state.ultimoSemeEstratto}
                        ultimoNumero={this.state.ultimoNumeroEstratto}
                    />
                    <MyStats myName={this.state.playerNames[0]} bullets={this.state.allStats[0][0]} incrementBullets={this.incrementBullets} decrementBullets={this.decrementBullets}/>
                    <div className={"Log"}>{this.state.lastMessage}</div>
                    <Deck drawFun={this.drawCard} extractFun={this.extractCard}/>
                    {/*<Deck drawFun={this.state.isMyTurn ? this.drawCard : ()=>{}} extractFun={this.extractCard}/>*/}
                    {/*<button className={"drawDoorCard"} onClick={this.state.isMyTurn ? this.drawCard : ()=>{}}> Pesca una carta Porta</button>*/}
                    <button className={"nextTurn"} onClick={this.state.isMyTurn ? this.nextTurn : ()=>{}} disabled={!this.state.isMyTurn}> Finisci turno </button>
                    <div className={'MyCowboy'}>
                        <PlayerCard cowboyId={this.state.cowboysID[0]} clickFun={()=>{}}/>
                        <img className={"Role"} src={rolesImg[this.state.myRole]}/>

                    </div>

                </div>
            );
        }

    }
}

export default PlayBoard;
