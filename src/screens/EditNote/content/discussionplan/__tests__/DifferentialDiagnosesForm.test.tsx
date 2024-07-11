import React from 'react';
import DifferentialDiagnosesForm from '../forms/DifferentialDiagnosesForm';
import configureStore from 'redux-mock-store';
import { conditionId, categoryId, initialPlan } from '../util';
import { Provider } from 'react-redux';
import { PLAN_ACTION as TYPES } from '../../../../../redux/actions/actionTypes';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mockStore = configureStore([]);

const mountWithStore = (initStore = { discussionPlan: initialPlan }) => {
    const store = mockStore(initStore);
    const props = {
        conditionId,
        // Need to mock actual implementation as this function is responsible
        // for action dispatching
        formatAction: vi.fn(
            (action) =>
                (_, { uuid, value }) =>
                    action(conditionId, uuid, value)
        ),
    };
    return {
        store,
        wrapper: render(
            <Provider store={store}>
                <DifferentialDiagnosesForm {...props} />
            </Provider>
        ),
    };
};

describe('DifferentialDiagnosesForm', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore();

        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', async () => {
        const { wrapper } = mountWithStore();

        expect(wrapper).toMatchSnapshot();
    });

    it('dispatches correct action when updating comments', async () => {
        const { store, wrapper } = mountWithStore();

        const value = 'foo';

        const element = wrapper.container.querySelector(
            'textarea[aria-label="Diagnosis-Comment"]'
        ) as HTMLTextAreaElement;

        fireEvent.change(element, {
            target: { value },
        });

        const expectedActions = [
            {
                type: TYPES.UPDATE_DIFFERENTIAL_DIAGNOSIS_COMMENTS,
                payload: {
                    conditionIndex: conditionId,
                    diagnosisIndex: categoryId,
                    newComments: value,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches correct action when adding row', async () => {
        const { store, wrapper } = mountWithStore();

        (
            wrapper.container.querySelector(
                'button[aria-label="add-row"]'
            ) as HTMLButtonElement
        ).click();

        const expectedActions = [
            {
                type: TYPES.ADD_DIFFERENTIAL_DIAGNOSIS,
                payload: {
                    conditionIndex: conditionId,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});
