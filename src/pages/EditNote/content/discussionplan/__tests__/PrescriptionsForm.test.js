import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { PLAN_ACTION as TYPES } from '@redux/actions/actionTypes';
import PrescriptionsForm from '../forms/PrescriptionsForm';
import { categoryId, conditionId, initialPlan } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (
    initStore = { discussionPlan: initialPlan },
    { ...props } = {}
) => {
    const store = mockStore(initStore);
    props = {
        conditionId,
        // Need to mock actual implementation as this function is responsible
        // for action dispatching
        formatAction: jest.fn(
            (action) =>
                (_, { uuid, value }) =>
                    action(conditionId, uuid, value)
        ),
        ...props,
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

    // // TODO: Fix below tests
    // it('dispatches correct action when selecting type from dropdown', () => {
    //     const { store, wrapper } = mountWithStore();
    //     // Open dropdown and select last dropdown option
    //     wrapper
    //         .find('input[aria-label="Prescription-Dropdown"]')
    //         .first()
    //         .simulate('focus');
    //     wrapper
    //         .find('.dropdown__control--is-focused')
    //         .first()
    //         .simulate('mousedown');
    //     const option = wrapper.find('.option').first();
    //     option.simulate('click');

    //     const expectedActions = [
    //         {
    //             type: TYPES.UPDATE_PRESCRIPTION_TYPE,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 prescriptionIndex: categoryId,
    //                 newType: option.prop('value'),
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // it('dispatches correct action when adding type not found in dropdown', () => {
    //     const { store, wrapper } = mountWithStore();

    //     const value = 'MOST CERTAINLY NOT A MEDICATION';
    //     const input = wrapper.find('input[aria-label="Prescription-Dropdown"]');
    //     input.instance().value = value;
    //     input.simulate('change', { target: { value } });
    //     input.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validates change

    //     const expectedActions = [
    //         {
    //             type: TYPES.UPDATE_PRESCRIPTION_TYPE,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 prescriptionIndex: categoryId,
    //                 newType: value,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // it('dispatches correct action when updating dose', () => {
    //     const { store, wrapper } = mountWithStore();

    //     const value = 'foo';
    //     wrapper
    //         .find('input[aria-label="Prescription-Amount"]')
    //         .simulate('change', {
    //             target: { value },
    //         });
    //     const expectedActions = [
    //         {
    //             type: TYPES.UPDATE_PRESCRIPTION_DOSE,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 prescriptionIndex: categoryId,
    //                 newDose: value,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

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

    // it('dispatches correct action when adding row', () => {
    //     const { store, wrapper } = mountWithStore();

    //     wrapper.find('button[aria-label="add-row"]').simulate('click');
    //     const expectedActions = [
    //         {
    //             type: TYPES.ADD_PRESCRIPTION,
    //             payload: {
    //                 conditionIndex: conditionId,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });
});
