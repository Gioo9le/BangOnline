import React from 'react';
import './App.scss';
import Logo from './cards/img/logo.png'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName:"",
            room:"",
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeRoom = this.handleChangeRoom.bind(this);
    }

    handleChangeName(event) {
        this.setState({playerName: event.target.value});
    }
    handleChangeRoom(event) {
        this.setState({room: event.target.value});
    }

    render() {
        return (
            <div className={'PlayBoard'}>
                <div className={'Logo'}>
                    <img src={Logo} />
                </div>
                <form className={'LoginForm'} onSubmit={()=>{this.props.loginFun(this.state.playerName, this.state.room)}}>
                    <label>
                        Nome:
                        <input size={'10vh'} type="text" value={this.state.playerName} onChange={this.handleChangeName} />
                    </label>
                    <br/>
                    <label>
                        Stanza:
                        <input type="text" value={this.state.room} onChange={this.handleChangeRoom} />
                    </label>
                    <span> </span>
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default LoginForm;