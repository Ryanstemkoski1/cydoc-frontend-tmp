import { ADD_NOTE, DATA_LOADED, LOGIN_REQUEST, LOGOUT } from "../constants/action-types";
import axios from 'axios'
import api from "../../api";

export function addNote(payload) {
    return { type: ADD_NOTE, payload };
}

export function getAllRecords() {
    return function(dispatch) {
        return axios.get(api.records.dev)
            .then(response => response.data)
            .then(data => {
                dispatch({ type: DATA_LOADED, payload: data });
            });
    };
}

export function loginRequest(payload){
    return function(dispatch) {
        return axios.post(api.login.dev, payload)
            .then(res => {
                const user = res.data;
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            })
            .then((user)=> {
                dispatch({type: LOGIN_REQUEST, payload: user})
            })
    }
}

export function logout(){
        localStorage.removeItem('user');
        return { type: LOGOUT };
}