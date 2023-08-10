import Adapter from '@cfaester/enzyme-adapter-react-18';
import AddRowButton from 'components/tools/AddRowButton/AddRowButton.js';
import { PATIENT_HISTORY_ALLERGIES_MOBILE_BP } from 'constants/breakpoints';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ALLERGIES_ACTION } from 'redux/actions/actionTypes';
import AllergiesContent from '../AllergiesContent.tsx';
import AllergiesTableBodyRow from '../AllergiesTableBodyRow';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const initialAllergies = {
    ['foo']: { incitingAgent: '', reaction: '', comments: '' },
    ['bar']: { incitingAgent: '', reaction: '', comments: '' },
    ['foobar']: { incitingAgent: '', reaction: '', comments: '' },
};

const initialState = {
    hasAllergies: true,
    elements: initialAllergies,
};

const initialUserState = {
    patientView: true,
};

const connectStore = (state = initialState, props) => {
    const store = mockStore({ allergies: state, userView: initialUserState });
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
    const { innerWidth } = window;
    beforeEach(() => {
        const { store } = connectStore();
        store.clearActions();
    });
    afterEach(() => {
        window.innerWidth = innerWidth;
        window.dispatchEvent(new Event('resize'));
    });

    test('render', () => {
        const { wrapper } = connectStore();
        expect(wrapper).toBeTruthy();
        const rows = wrapper.find(AllergiesTableBodyRow);
        expect(rows).toHaveLength(3);
        expect(wrapper.find(AddRowButton)).toHaveLength(1);
    });

    test('addRow works', async () => {
        const { wrapper, store } = connectStore();
        const button = wrapper.find(AddRowButton).find('button');
        expect(button).toBeTruthy();
        await act(() => {
            button.simulate('click');
        });

        const expectedActions = [{ type: ALLERGIES_ACTION.ADD_ALLERGY }];
        expect(store.getActions()).toEqual(expectedActions);
    });

    test('deleteRow works', async () => {
        const { wrapper, store } = connectStore();
        const button = wrapper
            .find('button[aria-label="delete-allergy"]')
            .first();
        expect(button).toBeTruthy();
        await act(() => {
            button.simulate('click');
        });
        const expectedActions = [
            {
                type: ALLERGIES_ACTION.DELETE_ALLERGY,
                payload: { index: 'foo' },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    // // TODO: Fix below tests
    // test('editing inciting agent dispatches correct action', () => {
    //     const { store, wrapper } = connectStore();
    //     wrapper
    //         .find('input[aria-label="incitingAgent"]')
    //         .first()
    //         .simulate('focus');
    //     wrapper
    //         .find('.dropdown__control--is-focused')
    //         .first()
    //         .simulate('mousedown');
    //     const option = wrapper.find('.option').first();
    //     option.simulate('click');
    //     const expectedAction = [
    //         {
    //             type: ALLERGIES_ACTION.UPDATE_INCITING_AGENT,
    //             payload: {
    //                 newIncitingAgent: option.prop('value'),
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing inciting agent dispatches correct action - mobile', () => {
    //     const { store, wrapper } = connectStore(initialState);

    //     window.innerWidth = PATIENT_HISTORY_ALLERGIES_MOBILE_BP - 10;
    //     window.dispatchEvent(new Event('resize'));
    //     wrapper.update();

    //     wrapper
    //         .find('input[aria-label="incitingAgent"]')
    //         .first()
    //         .simulate('focus');
    //     wrapper
    //         .find('.dropdown__control--is-focused')
    //         .first()
    //         .simulate('mousedown');
    //     const option = wrapper.find('.option').first();
    //     option.simulate('click');
    //     const expectedAction = [
    //         {
    //             type: ALLERGIES_ACTION.UPDATE_INCITING_AGENT,
    //             payload: {
    //                 newIncitingAgent: option.prop('value'),
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // test('editing reaction dispatches correct action', () => {
    //     const { store, wrapper } = connectStore();
    //     const input = wrapper.find('.table-row-text[type="reaction"]').first();
    //     input.simulate('change', {
    //         target: { value: 'hives' },
    //     });
    //     const expectedAction = [
    //         {
    //             type: ALLERGIES_ACTION.UPDATE_REACTION,
    //             payload: {
    //                 newReaction: 'hives',
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // it('editing reaction dispatches correct action - mobile', () => {
    //     const { store, wrapper } = connectStore(initialState);

    //     window.innerWidth = PATIENT_HISTORY_ALLERGIES_MOBILE_BP - 10;
    //     window.dispatchEvent(new Event('resize'));
    //     wrapper.update();
    //     wrapper
    //         .find('input[type="reaction"]')
    //         .first()
    //         .simulate('change', {
    //             target: { value: 'hives' },
    //         });

    //     const expectedAction = [
    //         {
    //             type: ALLERGIES_ACTION.UPDATE_REACTION,
    //             payload: {
    //                 newReaction: 'hives',
    //                 index: 'foo',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    test('editing comments dispatches correct action', async () => {
        const { store, wrapper } = connectStore();
        const input = wrapper.find('.table-row-text[type="comments"]').first();
        await act(() => {
            input.simulate('change', {
                target: { value: 'hives' },
            });
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

    it('editing comments dispatches correct action - mobile', async () => {
        const { store, wrapper } = connectStore(initialState);

        window.innerWidth = PATIENT_HISTORY_ALLERGIES_MOBILE_BP - 10;
        await act(() => {
            window.dispatchEvent(new Event('resize'));
        });
        wrapper.update();
        wrapper
            .find('.table-row-text[type="comments"]')
            .first()
            .simulate('change', {
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

    test('handle cell click', async () => {
        const { wrapper } = connectStore();
        const input = wrapper.find('td').last();
        await act(() => {
            input.simulate('click');
        });
        expect(wrapper.find('textarea').last().rowindex).toEqual(
            document.activeElement.rowIndex
        );
    });
});
