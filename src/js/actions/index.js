import { ADD_NOTE, DATA_LOADED, LOGIN_REQUEST, LOGOUT } from "../constants/action-types";
import axios from 'axios'
import api from "../../api";

export function addNote(payload) {
    return { type: ADD_NOTE, payload };
}

export function getData() {
    return function(dispatch) {
        return fetch("https://jsonplaceholder.typicode.com/posts")
            .then(response => response.json())
            .then(json => {
                dispatch({ type: DATA_LOADED, payload: json });
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