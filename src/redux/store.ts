import { legacy_createStore } from 'redux';
import { rootReducer } from './reducers';
import { composeWithDevTools } from '@redux-devtools/extension';

export const makeStore = () =>
    legacy_createStore(rootReducer, composeWithDevTools());

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
