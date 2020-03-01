import React from 'react'
import constants from '../constants/constants';
import {allergies, medications, surgicalHistory} from '../constants/States'
import axios from 'axios'
import api from "../constants/api"

const Context = React.createContext('yasa')

export class AuthStore extends React.Component {
    state = {

    }

    /*
    const user = {
            username: "yasab",
            password: "basay",
            email: "yasa@b.aig",
            phoneNumber: "123456789",
            firstName: "Yasab",
            lastName: "Aig",
            workplace: "Duck",
            inPatient: false,
            institutionType: "Yasa",
            address: "Yasa",
            backupEmail: "yasab27@gmail.com",
            role: "The Boss"
        };
    */

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