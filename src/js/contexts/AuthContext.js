import React from 'react'
import constants from '../constants/constants';
import {allergies, medications, surgicalHistory} from '../constants/States'
import axios from 'axios'
import api from "../constants/api"

const Context = React.createContext('yasa')

export class AuthStore extends React.Component {
    state = {
        token: "",
        user: ""
     }

    loginRequest = async (request) => {
        axios.post(api.login.dev, request)
            .then(res => {
                const data = res.data;
                console.log(JSON.stringify(data))
                localStorage.setItem('user', JSON.stringify(data));
                let {token, user} = data;
                this.setState({token: token, user: user});
                return true
            })
            .catch(err => {
                console.log(err.response)
                return false
            })
        
    }

    render = () => {
        return(
            <Context.Provider value = {{...this.state, loginRequest: this.loginRequest}}>
                {this.props.children}
            </Context.Provider>
        )
    }
    
}

export default Context;