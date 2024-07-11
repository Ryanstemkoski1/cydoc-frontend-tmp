import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { initialNoteTitle } from '../../../redux/reducers/currentNoteReducer';
import NoteNameMenuItem from '../NoteNameMenuItem';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { CURRENT_NOTE_ACTION } from '../../../redux/actions/actionTypes';

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureStore([]);

const connectStore = (Component, initStore = {}, props = {}) => {
    const store = mockStore({
        title: initialNoteTitle,
        ...initStore,
    });
    return {
        store,
        wrapper: mount(
            // <Router>
            <Provider store={store}>
                <Component {...props} />
            </Provider>
            // </Router>
        ),
    };
};

describe('Note Name Menu Item', () => {
    it('dispatches correct action when updating title', () => {
        const { store, wrapper } = connectStore(NoteNameMenuItem, {});
        const value = 'foo';
        wrapper.find('input[aria-label="Note-Title"]').simulate('change', {
            target: { value },
        });
        expect(store.getActions()).toEqual([
            {
                type: CURRENT_NOTE_ACTION.UPDATE_NOTE_TITLE,
                payload: {
                    newTitle: value,
                },
            },
        ]);
    });
    it('dispatches correct action focusing with default note title', () => {
        const { store, wrapper } = connectStore(NoteNameMenuItem, {
            title: initialNoteTitle,
        });
        wrapper.find('input[aria-label="Note-Title"]').simulate('focus');
        expect(store.getActions()).toEqual([
            {
                type: CURRENT_NOTE_ACTION.UPDATE_NOTE_TITLE,
                payload: {
                    newTitle: '',
                },
            },
        ]);
    });

    it('dispatches correct action blurring with blank value', () => {
        const { store, wrapper } = connectStore(NoteNameMenuItem, {
            title: '',
        });
        wrapper.find('input[aria-label="Note-Title"]').simulate('blur');
        expect(store.getActions()).toEqual([
            {
                type: CURRENT_NOTE_ACTION.UPDATE_NOTE_TITLE,
                payload: {
                    newTitle: initialNoteTitle,
                },
            },
        ]);
    });
});
