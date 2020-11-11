import React from 'react';
import './App.scss';
import PlayBoard from "./PlayBoard.js"
import LoginForm from "./loginForm.js"

var socket;

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogin:true,
            room:"",
            playerName:""
        };
        this.login = this.login.bind(this);
    }
    componentDidMount() {

    }

    login(playerName, room){
        this.setState({
            isLogin:false,
            room:room,
            playerName:playerName,
        })
    }

    render() {
        if(this.state.isLogin){
            return(
                <LoginForm loginFun={this.login}/>
            )
        }else{
            return(
                <PlayBoard room={this.state.room} playerName={this.state.playerName}/>
            )
        }
    }
}

export default App;
