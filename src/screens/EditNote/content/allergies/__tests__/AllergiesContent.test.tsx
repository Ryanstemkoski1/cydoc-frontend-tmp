import React from 'react';
import AddRowButton from '../../../../../components/tools/AddRowButton/AddRowButton.js';
import { PATIENT_HISTORY_ALLERGIES_MOBILE_BP } from '../../../../../constants/breakpoints.js';
import { act } from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { ALLERGIES_ACTION } from '../../../../../redux/actions/actionTypes.ts';
import AllergiesContent from '../AllergiesContent';
import AllergiesTableBodyRow from '../AllergiesTableBodyRow';
import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

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

const connectStore = (state = initialState) => {
    const store = mockStore({ allergies: state, userView: initialUserState });
    return {
        store,
        wrapper: render(
            <Provider store={store}>
                <AllergiesContent />
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

    // test('render', () => {
    //     const { wrapper } = connectStore();
    //     expect(wrapper).toBeTruthy();
    //     const rows = wrapper.find(AllergiesTableBodyRow);
    //     expect(rows).toHaveLength(3);
    //     expect(wrapper.find(AddRowButton)).toHaveLength(1);
    // });

    // test('addRow works', async () => {
    //     const { wrapper, store } = connectStore();
    //     const button = wrapper.find(AddRowButton).find('button');
    //     expect(button).toBeTruthy();
    //     await act(() => {
    //         button.simulate('click');
    //     });

    //     const expectedActions = [{ type: ALLERGIES_ACTION.ADD_ALLERGY }];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // test('deleteRow works', async () => {
    //     const { wrapper, store } = connectStore();

    //     const button = wrapper.container.querySelector(
    //         '.table-row-text[type="comments"]'
    //     ) as HTMLButtonElement;

    //     expect(button).toBeTruthy();

    //     button.click();

    //     const expectedActions = [
    //         {
    //             type: ALLERGIES_ACTION.DELETE_ALLERGY,
    //             payload: { index: 'foo' },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    test('editing comments dispatches correct action', async () => {
        const { store, wrapper } = connectStore();

        fireEvent.change(
            wrapper.container.querySelector(
                '.table-row-text[type="comments"]'
            ) as HTMLInputElement,
            { target: { value: 'hives' } }
        );

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

        fireEvent.change(
            wrapper.container.querySelector(
                '.table-row-text[type="comments"]'
            ) as HTMLInputElement,
            { target: { value: 'Normal' } }
        );

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

    // test('handle cell click', async () => {
    //     const { wrapper } = connectStore();
    //     const input = wrapper.find('td').last();
    //     await act(() => {
    //         input.simulate('click');
    //     });
    //     expect(wrapper.find('textarea').last().rowindex).toEqual(
    //         document.activeElement.rowIndex
    //     );
    // });
});
