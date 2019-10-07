// src/js/reducers/index.js
import {ADD_NOTE, DATA_LOADED, LOGIN_REQUEST, LOGOUT, SAVE_NOTE} from "../constants/action-types";

const initialState = {
    notes: [],
    remoteRecords: [],
    user: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).user : {},
    isLoggedIn: !!JSON.parse(localStorage.getItem('user'))
};

let user = JSON.parse(localStorage.getItem('user'));
const initialUserState = user ? { loggedIn: true, user } : {};
initialState[user] = initialUserState;

function rootReducer(state = initialState, action) {
    if (action.type === ADD_NOTE) {
        return Object.assign({}, state, {
            notes: state.notes.concat(action.payload),
            currentNote: action.payload.noteName
        });
    }
    if (action.type === DATA_LOADED) {
        return Object.assign({}, state, {
            remoteRecords: state.remoteRecords.concat(action.payload)
        });
    }

    if(action.type === LOGIN_REQUEST) {
        return Object.assign({}, state, {
            user: action.payload.user,
            isLoggedIn: true
        });
    }

    if(action.type === LOGOUT) {
        return initialState;
    }

    return state;
}
export default rootReducer;