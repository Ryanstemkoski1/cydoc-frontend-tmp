import React from 'react'
import constants from 'constants/constants';
import {allergies, medications, surgicalHistory} from 'constants/States'
import axios from 'axios'
import api from "constants/api"
import { withCookies, Cookies } from 'react-cookie';

const Context = React.createContext('yasa')

class AuthStore extends React.Component {
    state = {
        user: this.props.cookies.get('user') || null,
        token: this.props.cookies.get('token') || null
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
        this.props.cookies.set('user', user, { path: '/' })
        this.props.cookies.set('token', token, { path: '/' })
        this.setState({user: user, token: token})
    }

    logOut = () => {
        this.props.cookies.remove('user')
        this.props.cookies.remove('token')
        this.setState({user: null, token: null})
    }

    render = () => {
        return(
            <Context.Provider value = {{...this.state, storeLoginInfo: this.storeLoginInfo, logOut: this.logOut}}>
                {this.props.children}
            </Context.Provider>
        )
    }
    
}
const AuthStoreCookies = withCookies(AuthStore)
export {AuthStoreCookies as AuthStore}
export default Context;