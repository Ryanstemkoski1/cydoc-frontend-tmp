import {ADD_NOTE, ADD_TEMPLATE, DATA_LOADED, LOGIN_REQUEST, LOGOUT, SAVE_NOTE} from "../constants/action-types";
import axios from 'axios'
import api from "../constants/api";

export function addNote(payload) {
    return { type: ADD_NOTE, payload };
}

export function addTemplate(payload) {
    return { type: ADD_TEMPLATE, payload: payload}
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
                const user = res;
                console.log(user)
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            })
            .then((user)=> {
                dispatch({type: LOGIN_REQUEST, payload: user.data})
                return user;
            })
            .catch(err => {
                return err.response;
            })
    }
}

export function logout(){
        localStorage.removeItem('user');
        return { type: LOGOUT };
}

export  function saveNote(payload){
    return function (dispatch) {
        const headers = {
            'Content-Type': 'application/json',

        };
        return axios.post(api.newRecord.dev,
            { headers: {
                'Content-Type': 'application/json'}},
            payload)
            .then(res => res.data)
            .then(data => {
                dispatch({type: SAVE_NOTE, payload: data})
            })
    }
}