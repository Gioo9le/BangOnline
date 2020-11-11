import React from 'react';
import './App.scss';

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
            <form onSubmit={()=>{this.props.loginFun(this.state.playerName, this.state.room)}}>
                <label>
                    Nome:
                    <input type="text" value={this.state.playerName} onChange={this.handleChangeName} />
                </label>
                <label>
                    Stanza:
                    <input type="text" value={this.state.room} onChange={this.handleChangeRoom} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default LoginForm;