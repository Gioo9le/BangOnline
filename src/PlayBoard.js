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
var prom;

class PlayBoard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            roomCondition:{
                playersData:[],
                numPlayer : 0,
                currentTurn : 0,
                deck : [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, //25 Bang
            1, 1,
            2, 2, 2, 2, 2, 2,
            3,
            4, 4, 4, 4,
            5, 5,
            6,
            7, 7, 7,
            8, 8,
            9,
            10, 10,
            11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,
            12,
            13, 13,
            14, 14, 14, 14,
            15, 15, 15,
            16,
            17,
            18, 18, 18,
            19, 19,
            20,
            21,
        ],
                cowboysDeck : [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
        ],
                discarded : [],
                isPlaying : false,
                semeEstratto : -1,
                numeroEstratto : -1,
            },
            selectedDiscarded:0,
            myAbsolutePosition: 0,
            isMyTurn:false,
            lastMessage:"",
            isWaitingRoom:true,
            chooseCowboy:false,
            cowboyOptions:[],
            choosingTarget:false,
            playedWaitingTarget:-1,
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
        this.chooseTarget = this.chooseTarget.bind(this);
        // https://bang-game-server.herokuapp.com/
        socket = socketIOClient('localhost:1234');
        socket.emit("checkIsPlaying", this.props.room);

    }

    cardsFunction = [
        function bang(t) {
            return true;
        },
        function barile(t) {
            return false;
        },
        function birra(t) {
            return false;
        },
        function carabine(t) {
            return false;
        },
        function catbalou(t) {
            return true;
        },
        function diligenza(t) {
            return false;
        },
        function dinamite(t) {
            return false;
        },
        function duello(t) {
            return true;
        },
        function emporio(t) {
            return false;
        },
        function gatling(t) {
            return false;
        },
        function indiani(t) {
            return false;
        },
        function mancato(t) {
            return false;
        },
        function mirino(t) {
            return false;
        },
        function mustang(t) {
            return false;
        },
        function panico(t) {
            return true;
        },
        function prigione(t) {
            return true;
        },
        function remington(t) {
            return false;
        },
        function saloon(t) {
            return false;
        },
        function schofield(t) {
            return false;
        },
        function volcanic(t) {
            return false;
        },
        function wellsFargo(t) {
            return false;
        },
        function winchester(t) {
            return false;
        }
    ];

    componentDidMount() {
        //document.documentElement.webkitRequestFullScreen();

        socket.on('dataChanged', (newRoomCondition, message)=>{
            newRoomCondition.playersData = this.shiftRelativePosition(newRoomCondition.playersData, this.state.myAbsolutePosition);
            let myTurn = newRoomCondition.currentTurn == this.state.myAbsolutePosition;
            this.setState({
                roomCondition:newRoomCondition,
                lastMessage:message,
                isMyTurn: myTurn,
            })
        });

        socket.emit('playerEntered', this.props.playerName, this.props.room);
        socket.on('forLauncher',(assignedId)=>{
            console.log('I\'ve entered');
            this.setState({
                myAbsolutePosition: assignedId,
            });
            console.log(assignedId);
            //setTimeout(()=>{console.log('After 10 second')}, 10000);
        });
        socket.on('cardDiscarded', (newDiscarded) => {
            this.setState({
                selectedDiscarded:newDiscarded.length-1,
            })
        });
        socket.on("drawDiscarded", ()=>{
            let newDiscardedSelected = this.state.selectedDiscarded==0?0:this.state.selectedDiscarded-1;
            this.setState({
                selectedDiscarded:newDiscardedSelected,
            })
        });
        socket.on("playerLeft", (playerExitedId)=>{
            if(this.state.myAbsolutePosition>=playerExitedId){
                let newPos = this.state.myAbsolutePosition-1;
                this.setState({myAbsolutePosition: newPos})
            }
        });
        socket.on("beginGame",()=>{
            this.setState({
                isWaitingRoom:false,
            })
        });
        socket.on("isPlaying", (isPlaying)=>{
            this.setState({
                isWaitingRoom: !isPlaying,
            })
        });
        socket.on('pickCowboyCard', (firstCard, secondCard)=>{
            console.log("Choosing");
            this.setState({
                cowboyOptions:[firstCard, secondCard],
            })
        });
        socket.on('cardExtracted', (newDiscarded)=>{
            this.setState({
                selectedDiscarded:newDiscarded.length-1
            })
        });


    }

    shiftRelativePosition(arr, n){
        let tail = arr.splice(0, n);
        arr = arr.concat(tail);
        return arr;
    }

    playACard(cardIdx){
        let cardPlayedId = this.state.roomCondition.playersData[0].handCard[cardIdx];
        let roomWithNonPermanent = this.state.roomCondition;

        let waitForTarget = this.cardsFunction[cardPlayedId](this);
        if (!waitForTarget){
            socket.emit('cardPlayed', this.state.myAbsolutePosition, cardIdx, -1, this.props.room);
        }else{
            let splicedCard = roomWithNonPermanent.playersData[0].handCard.splice(cardIdx,1)[0];
            roomWithNonPermanent.playersData[0].nonPermanentCard = cardPlayedId;
            //TODO functions related to every card
            this.setState({
                roomCondition: roomWithNonPermanent,
                choosingTarget:true,
                playedWaitingTarget: cardIdx,
            });
        }
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

    discardCard(positionCard, isHand){
        socket.emit('cardDiscarded', this.state.myAbsolutePosition, positionCard, isHand, this.props.room);
    }

    drawDiscarded(){
        socket.emit("drawDiscarded", this.state.myAbsolutePosition, this.state.selectedDiscarded, this.props.room);
    }

    incrementBullets(){
        socket.emit('lifeChanged', this.state.myAbsolutePosition, this.state.roomCondition.playersData[0].bullets+1, this.props.room);
    }

    decrementBullets(){
        socket.emit('lifeChanged', this.state.myAbsolutePosition, this.state.roomCondition.playersData[0].bullets-1, this.props.room);
    }

    choosingCowboy(){
        socket.emit('drawCowboys', this.state.myAbsolutePosition, this.props.room)
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
    cowboyChoosen(cowboyId){
        this.setState({
            chooseCowboy:true,
            cowboyOptions:[],
        })
        socket.emit('cowBoyChoosen', this.state.myAbsolutePosition, cowboyId, this.props.room);
    }

    giveCard(cardIdx, receiverId, isHand){
        socket.emit("cardGiven", this.state.myAbsolutePosition, cardIdx, receiverId, isHand, this.props.room)
    }

    chooseTarget(targetIdx){
        let targetIdxabs = (this.state.myAbsolutePosition+targetIdx+1)%(this.state.roomCondition.numPlayer);
        socket.emit('cardPlayed', this.state.myAbsolutePosition, this.state.playedWaitingTarget, targetIdxabs, this.props.room);
        this.setState({
            choosingTarget:false,
        })
    }



    render() {
        const rolesImg = [sceriffo, rinnegato, fuorilegge, vice];
        if(this.state.isWaitingRoom){
            console.log("Scelte");
            console.log(this.state.cowboysID);
            return(
                <div className={'PlayBoard'}>
                    {this.state.roomCondition.playersData.map((value)=>{return value.Name}).map((item, idx) => {
                        return <div> {idx}.{item} - {this.state.roomCondition.playersData.map((value)=>{return value.Cowboy})[idx]==-1?"Not choosen":this.state.roomCondition.playersData.map((value)=>{return value.Cowboy})[idx]}</div>
                    })}
                    <button hidden={this.state.chooseCowboy} onClick={()=>{this.choosingCowboy()}}>Draw Cowboys</button>
                    {this.state.cowboyOptions.map((item, idx) => {
                        return (<div className={'Cowboy'+idx}>
                            <PlayerCard cowboyId={item} clickFun={()=>{this.cowboyChoosen(item)}}/>
                        </div>);
                    })}
                    <button
                        disabled={!this.state.roomCondition.playersData.map((val)=>{return val.Cowboy}).every((value => value!=-1))}
                        hidden={this.state.myAbsolutePosition!=0||!this.state.chooseCowboy}
                        onClick={()=>{socket.emit("beginGame", this.props.room)}}>Begin</button>

                </div>

            );
        }else{
            return (
                <div className="PlayBoard">
                    <div className={"ChooseTargetMsg"} hidden={!this.state.choosingTarget}> Scegli su chi giocare la carta </div>
                    <PlayerBoard
                        nPlayers={this.state.roomCondition.numPlayer}
                        playerNames={this.state.roomCondition.playersData.map((value)=>{return value.Name}).slice(1,7)}
                        allPlayedCards={this.state.roomCondition.playersData.map((value)=>{return value.playedCard}).slice(1, 7)}
                        allStats={this.state.roomCondition.playersData.map((value)=>{return [value.bullets, value.nHandCard]}).slice(1,7)}
                        cowboysId={this.state.roomCondition.playersData.map((value)=>{return value.Cowboy}).slice(1,7)}
                        targets={this.state.roomCondition.playersData.map((value)=>{return value.isTarget}).slice(1,7)}
                        nonPermanent={this.state.roomCondition.playersData.map((value)=>{return value.nonPermanentCard}).slice(1,7)}
                        selectTargetFun={this.state.choosingTarget?this.chooseTarget:()=>{}}
                        deadPlayers={this.state.roomCondition.playersData.map((value)=>{return value.dead}).slice(1,7)}
                    />
                    <MyPlayerPlayedCards
                        myPlayedCards={this.state.roomCondition.playersData.map((value)=>{return value.playedCard})[0]}
                        discardFun={this.discardCard}
                        giveFun={this.giveCard}
                        playerNames={this.state.roomCondition.playersData.map((value)=>{return value.Name})}
                        myLastPlayed={this.state.roomCondition.playersData.map((value)=>{return value.nonPermanentCard})[0]}
                        imTarget={this.state.roomCondition.playersData.map((value)=>{return value.isTarget})[0]}
                        imDead={this.state.roomCondition.playersData[0].dead}
                    />
                    <PlayerHand
                        myHandCards={this.state.roomCondition.playersData.map((value)=>{return value.handCard})[0]}
                        discardFun={this.discardCard}
                        giveFun={this.giveCard}
                        playerNames={this.state.roomCondition.playersData.map((value)=>{return value.Name})}
                        //playCardFun={this.playACard}
                        playCardFun={this.state.isMyTurn || this.state.roomCondition.playersData[0].isTarget ? this.playACard : ()=>{}}
                        imDead={this.state.roomCondition.playersData[0].dead}
                    />
                    <Discarded
                        discardedList={this.state.roomCondition.discarded}
                        selectedCard={this.state.selectedDiscarded}
                        nextDiscardedFun={this.nextDiscarded}
                        previousDiscardedFun={this.previousDiscarded}
                        drawFun={this.drawDiscarded}
                        ultimoSeme={this.state.roomCondition.semeEstratto}
                        ultimoNumero={this.state.roomCondition.numeroEstratto}
                        imDead={this.state.roomCondition.playersData[0].dead}
                    />
                    <MyStats
                        myName={this.state.roomCondition.playersData.map((value)=>{return value.Name})[0]}
                        bullets={this.state.roomCondition.playersData.map((value)=>{return value.bullets})[0]}
                        incrementBullets={this.incrementBullets}
                        decrementBullets={this.decrementBullets}
                        imDead={this.state.roomCondition.playersData[0].dead}
                    />
                    <div className={"Log"}>{this.state.lastMessage}</div>
                    <Deck
                        drawFun={this.drawCard}
                        extractFun={this.extractCard}
                        imDead={this.state.roomCondition.playersData[0].dead}
                    />
                    {/*<Deck drawFun={this.state.isMyTurn ? this.drawCard : ()=>{}} extractFun={this.extractCard}/>*/}
                    {/*<button className={"drawDoorCard"} onClick={this.state.isMyTurn ? this.drawCard : ()=>{}}> Pesca una carta Porta</button>*/}
                    <button
                        className={"nextTurn"}
                        onClick={this.state.isMyTurn ? this.nextTurn : ()=>{}}
                        disabled={!this.state.isMyTurn}
                        hidden={this.state.roomCondition.playersData[0].dead}
                    > Finisci turno </button>
                    <div className={'MyCowboy'} hidden={this.state.roomCondition.playersData[0].dead}>
                        <PlayerCard
                            cowboyId={this.state.roomCondition.playersData.map((value)=>{return value.Cowboy})[0]}
                            clickFun={()=>{}}/>
                        <img
                            className={"Role"}
                            src={rolesImg[this.state.roomCondition.playersData.map((value)=>{return value.role})[0]]}
                        />

                    </div>

                </div>
            );
        }

    }
}

export default PlayBoard;
