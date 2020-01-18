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

    storeLoginInfo = (user, token) => {
        this.setState({user: user, token: token})
    }

    render = () => {
        return(
            <Context.Provider value = {{...this.state, storeLoginInfo: this.storeLoginInfo}}>
                {this.props.children}
            </Context.Provider>
        )
    }
    
}

export default Context;