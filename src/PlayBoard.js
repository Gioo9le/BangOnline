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
        socket = socketIOClient('http://localhost:1234/');
        socket.emit("checkIsPlaying", this.props.room);

    }

    componentDidMount() {
        //document.documentElement.webkitRequestFullScreen();

        socket.on('dataChanged', (newRoomCondition, message)=>{
            newRoomCondition.playersData = this.shiftRelativePosition(newRoomCondition.playersData, this.state.myAbsolutePosition);
            this.setState({
                roomCondition:newRoomCondition,
                lastMessage:message
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
            console.log("Choosing")
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
        socket.emit('cardPlayed', this.state.myAbsolutePosition, this.state.roomCondition.playersData[0].handCard[cardIdx], cardIdx, this.props.room)
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
        socket.emit('cardDiscarded', this.state.myAbsolutePosition, positionCard, this.props.room);
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

    giveCard(cardIdx, receiverId){
        socket.emit("cardGiven", this.state.myAbsolutePosition, cardIdx, receiverId, this.props.room)
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
                    <PlayerBoard
                        nPlayers={this.state.roomCondition.numPlayer}
                        playerNames={this.state.roomCondition.playersData.map((value)=>{return value.Name}).slice(1,7)}
                        allPlayedCards={this.state.roomCondition.playersData.map((value)=>{return value.playedCard}).slice(1, 7)}
                        allStats={this.state.roomCondition.playersData.map((value)=>{return [value.bullets, value.nHandCard]}).slice(1,7)}
                        cowboysId={this.state.roomCondition.playersData.map((value)=>{return value.Cowboy}).slice(1,7)}
                    />
                    <MyPlayerPlayedCards
                        myPlayedCards={this.state.roomCondition.playersData.map((value)=>{return value.playedCard})[0]}
                        discardFun={this.discardCard}
                        giveFun={this.giveCard}
                        playerNames={this.state.roomCondition.playersData.map((value)=>{return value.Name})}
                    />
                    <PlayerHand
                        myHandCards={this.state.roomCondition.playersData.map((value)=>{return value.handCard})[0]}
                        playCardFun={this.playACard}
                        //playCardFun={this.state.isMyTurn ? this.playACard : ()=>{}}
                    />
                    <Discarded
                        discardedList={this.state.roomCondition.discarded}
                        selectedCard={this.state.selectedDiscarded}
                        nextDiscardedFun={this.nextDiscarded}
                        previousDiscardedFun={this.previousDiscarded}
                        drawFun={this.drawDiscarded}
                        ultimoSeme={this.state.roomCondition.semeEstratto}
                        ultimoNumero={this.state.roomCondition.numeroEstratto}
                    />
                    <MyStats
                        myName={this.state.roomCondition.playersData.map((value)=>{return value.Name})[0]}
                        bullets={this.state.roomCondition.playersData.map((value)=>{return value.bullets})[0]}
                        incrementBullets={this.incrementBullets}
                        decrementBullets={this.decrementBullets}
                    />
                    <div className={"Log"}>{this.state.lastMessage}</div>
                    <Deck
                        drawFun={this.drawCard}
                        extractFun={this.extractCard}
                    />
                    {/*<Deck drawFun={this.state.isMyTurn ? this.drawCard : ()=>{}} extractFun={this.extractCard}/>*/}
                    {/*<button className={"drawDoorCard"} onClick={this.state.isMyTurn ? this.drawCard : ()=>{}}> Pesca una carta Porta</button>*/}
                    <button
                        className={"nextTurn"}
                        onClick={this.state.isMyTurn ? this.nextTurn : ()=>{}}
                        disabled={!this.state.isMyTurn}
                    > Finisci turno </button>
                    <div className={'MyCowboy'}>
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
