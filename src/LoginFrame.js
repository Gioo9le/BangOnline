import React from 'react';
import './App.scss';
import LoginForm from "./loginForm.js"
var socket;

class LoginFrame extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogin:true,
            playerName:"",
            room:"",
        };
    }
    componentDidMount() {

    }
    render() {
        return(
            <LoginForm/>
        )
    }
}

export default LoginFrame;