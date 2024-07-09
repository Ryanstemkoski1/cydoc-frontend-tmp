import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { PLAN_ACTION as TYPES } from '../../../../../redux/actions/actionTypes';
import PrescriptionsForm from '../forms/PrescriptionsForm';
import { categoryId, conditionId, initialPlan } from '../util';
import { describe, expect, it, vi } from 'vitest';

Enzyme.configure({ adapter: new Adapter() });

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
        wrapper: mount(
            <Provider store={store}>
                <PrescriptionsForm {...props} />
            </Provider>
        ),
    };
};

describe('PrescriptionsForm', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('dispatches correct action when updating signature', () => {
        const { store, wrapper } = mountWithStore();

        const value = 'foo';
        wrapper
            .find('[aria-label="Prescription-Signature"]')
            .first()
            .simulate('change', {
                target: { value },
            });
        const expectedActions = [
            {
                type: TYPES.UPDATE_PRESCRIPTION_SIGNATURE,
                payload: {
                    conditionIndex: conditionId,
                    prescriptionIndex: categoryId,
                    newSignature: value,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches correct action when updating comment', () => {
        const { store, wrapper } = mountWithStore();

        const value = 'foo';
        wrapper
            .find('[aria-label="Prescription-Comment"]')
            .first()
            .simulate('change', {
                target: { value },
            });
        const expectedActions = [
            {
                type: TYPES.UPDATE_PRESCRIPTION_COMMENTS,
                payload: {
                    conditionIndex: conditionId,
                    prescriptionIndex: categoryId,
                    newComments: value,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});
