import { createStore } from 'redux';
import { rootReducer } from './reducers';

export const currentNoteStore = createStore(rootReducer);
export const createCurrentNoteStore = () => createStore(rootReducer);
