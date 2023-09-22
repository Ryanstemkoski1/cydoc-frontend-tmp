import { createStore } from 'redux';
import { rootReducer } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

export const currentNoteStore = createStore(rootReducer, composeWithDevTools());
export const createCurrentNoteStore = () => createStore(rootReducer);
