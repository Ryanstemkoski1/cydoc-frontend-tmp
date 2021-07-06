import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router } from 'react-router-dom';
import NavMenu from '../NavMenu';
import NoteNameMenuItem from '../NoteNameMenuItem';
import { CURRENT_NOTE_ACTION as TYPES } from 'redux/actions/actionTypes';
import { initialNoteTitle } from 'redux/reducers/currentNoteReducer';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockStore = configureStore([]);

const mountMenu = (props = {}) => {
    props = {
        className: '',
        attached: 'top',
        displayNoteName: false,
        ...props,
    };

    return mount(
        <Router>
            <NavMenu {...props} />
        </Router>
    );
};
const mountWithStore = (Component, initStore = {}, props = {}) => {
    const store = mockStore({
        title: initialNoteTitle,
        ...initStore,
    });
    return {
        store,
        wrapper: mount(
            <Router>
                <Provider store={store}>
                    <Component {...props} />
                </Provider>
            </Router>
        ),
    };
};

describe('NavMenu', () => {
    it('renders without crashing', () => {
        const wrapper = mountMenu();
        expect(wrapper).toBeTruthy();
    });
    it('matches snapshot', () => {
        const wrapper = mountMenu();
        expect(wrapper.html()).toMatchSnapshot();
    });
    it('does not render note name outside of editnote', () => {
        const wrapper = mountMenu({ displayNoteName: false });
        expect(wrapper.find(NoteNameMenuItem)).toHaveLength(0);
    });
    it('renders note name when directed', () => {
        const { wrapper } = mountWithStore(
            NavMenu,
            {},
            { displayNoteName: true }
        );
        expect(wrapper.find(NoteNameMenuItem)).toHaveLength(1);
    });
    it('dispatches correct action when updating title', () => {
        const { store, wrapper } = mountWithStore(NoteNameMenuItem, {});
        const value = 'foo';
        wrapper.find('input[aria-label="Note-Title"]').simulate('change', {
            target: { value },
        });
        expect(store.getActions()).toEqual([
            {
                type: TYPES.UPDATE_NOTE_TITLE,
                payload: {
                    newTitle: value,
                },
            },
        ]);
    });
    it('dispatches correct action focusing with default note title', () => {
        const { store, wrapper } = mountWithStore(NoteNameMenuItem, {
            title: initialNoteTitle,
        });
        wrapper.find('input[aria-label="Note-Title"]').simulate('focus');
        expect(store.getActions()).toEqual([
            {
                type: TYPES.UPDATE_NOTE_TITLE,
                payload: {
                    newTitle: '',
                },
            },
        ]);
    });
    it('dispatches correct action blurring with blank value', () => {
        const { store, wrapper } = mountWithStore(NoteNameMenuItem, {
            title: '',
        });
        wrapper.find('input[aria-label="Note-Title"]').simulate('blur');
        expect(store.getActions()).toEqual([
            {
                type: TYPES.UPDATE_NOTE_TITLE,
                payload: {
                    newTitle: initialNoteTitle,
                },
            },
        ]);
    });
});
