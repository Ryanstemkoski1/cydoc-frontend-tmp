import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AllergiesContent from '../AllergiesContent.tsx';
import AllergiesTableBodyRow from '../AllergiesTableBodyRow';
import AddRowButton from 'components/tools/AddRowButton';
import { Button, Accordion } from 'semantic-ui-react';
import { ALLERGIES_ACTION } from 'redux/actions/actionTypes';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockStore = configureStore([]);

const initialState = {
    ['foo']: { incitingAgent: '', reaction: '', comments: '' },
    ['bar']: { incitingAgent: '', reaction: '', comments: '' },
    ['foobar']: { incitingAgent: '', reaction: '', comments: '' },
};

const connectStore = (state = initialState, props) => {
    const store = mockStore({ allergies: state });
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <AllergiesContent {...props} />
            </Provider>
        ),
    };
};

describe('AllergiesContent', () => {
    beforeEach(() => {
        const { store } = connectStore();
        store.clearActions();
    });

    test('render', () => {
        const { wrapper } = connectStore();
        expect(wrapper).toBeTruthy();
        const rows = wrapper.find(AllergiesTableBodyRow);
        expect(rows).toHaveLength(3);
        expect(wrapper.find(AddRowButton)).toHaveLength(1);
    });

    test('addRow works', () => {
        const { wrapper, store } = connectStore();
        const button = wrapper.find(AddRowButton).find(Button);
        expect(button).toBeTruthy();
        button.simulate('click');
        const expectedActions = [{ type: ALLERGIES_ACTION.ADD_ALLERGY }];
        expect(store.getActions()).toEqual(expectedActions);
    });

    test('editing inciting agent dispatches correct action', () => {
        const { store, wrapper } = connectStore();
        const input = wrapper
            .find('.table-row-text[type="incitingAgent"]')
            .first();
        input.simulate('change', {
            target: { value: 'pollen' },
        });
        const expectedAction = [
            {
                type: ALLERGIES_ACTION.UPDATE_INCITING_AGENT,
                payload: {
                    newIncitingAgent: 'pollen',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('editing inciting agent dispatches correct action - mobile', () => {
        const { store, wrapper } = connectStore(initialState, {
            mobile: true,
            isPreview: false,
        });
        const input = wrapper
            .find(Accordion)
            .find('input[type="incitingAgent"]')
            .first();
        input.simulate('change', {
            target: { value: 'pollen' },
        });
        const expectedAction = [
            {
                type: ALLERGIES_ACTION.UPDATE_INCITING_AGENT,
                payload: {
                    newIncitingAgent: 'pollen',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('editing reaction dispatches correct action', () => {
        const { store, wrapper } = connectStore();
        const input = wrapper.find('.table-row-text[type="reaction"]').first();
        input.simulate('change', {
            target: { value: 'hives' },
        });
        const expectedAction = [
            {
                type: ALLERGIES_ACTION.UPDATE_REACTION,
                payload: {
                    newReaction: 'hives',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('editing reaction dispatches correct action - mobile', () => {
        const { store, wrapper } = connectStore(initialState, {
            mobile: true,
            isPreview: false,
        });
        const input = wrapper
            .find(Accordion)
            .find('input[type="reaction"]')
            .first();
        input.simulate('change', {
            target: { value: 'hives' },
        });
        const expectedAction = [
            {
                type: ALLERGIES_ACTION.UPDATE_REACTION,
                payload: {
                    newReaction: 'hives',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('editing comments dispatches correct action', () => {
        const { store, wrapper } = connectStore();
        const input = wrapper.find('.table-row-text[type="comments"]').first();
        input.simulate('change', {
            target: { value: 'hives' },
        });
        const expectedAction = [
            {
                type: ALLERGIES_ACTION.UPDATE_COMMENTS,
                payload: {
                    newComments: 'hives',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('editing comments dispatches correct action - mobile', () => {
        const { store, wrapper } = connectStore(initialState, {
            mobile: true,
            isPreview: false,
        });
        const input = wrapper
            .find(Accordion)
            .find('input[type="comments"]')
            .first();
        input.simulate('change', {
            target: { value: 'Normal' },
        });
        const expectedAction = [
            {
                type: ALLERGIES_ACTION.UPDATE_COMMENTS,
                payload: {
                    newComments: 'Normal',
                    index: 'foo',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    test('handle cell click', () => {
        const { wrapper } = connectStore();
        const input = wrapper.find('td').first();
        input.simulate('click');
        expect(input.find('textarea').first().getElement().rowindex).toEqual(
            document.activeElement.rowIndex
        );
    });

    test('onTitleClick', () => {
        const { wrapper } = connectStore(initialState, {
            mobile: true,
            isPreview: false,
        });
        const input = wrapper.find('.title').first();
        input.simulate('click');
        expect(input.getElement().rowindex).toEqual(
            document.activeElement.rowIndex
        );
    });
});
