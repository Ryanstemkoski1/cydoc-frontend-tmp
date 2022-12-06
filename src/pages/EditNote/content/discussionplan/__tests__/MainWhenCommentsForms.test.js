import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {
    ReferralsForm,
    ProceduresAndServicesForm,
} from '../forms/MainWhenCommentsForms';
import configureStore from 'redux-mock-store';
import { conditionId, categoryId, initialPlan } from '../util';
import { Provider } from 'react-redux';
import { PLAN_ACTION as TYPES } from 'redux/actions/actionTypes';
import { WhenResponse } from 'constants/enums';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockStore = configureStore([]);

const mountWithStore = (
    Component,
    initStore = { discussionPlan: initialPlan },
    { ...props } = {}
) => {
    const store = mockStore(initStore);
    props = {
        conditionId,
        // Need to mock actual implementation as this function is responsible
        // for action dispatching
        formatAction: jest.fn((action) => (_, { uuid, value }) =>
            action(conditionId, uuid, value)
        ),
        ...props,
    };
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <Component {...props} />
            </Provider>
        ),
    };
};

describe('ReferralsForm', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore(ReferralsForm);
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const { wrapper } = mountWithStore(ReferralsForm);
        expect(wrapper.html()).toMatchSnapshot();
    });

    // // TODO: Fix below tests
    // it('dispatches correct action when selecting department from dropdown', () => {
    //     const { store, wrapper } = mountWithStore(ReferralsForm);

    //     // Open dropdown and select first option
    //     wrapper
    //         .find('input[aria-label="department-Dropdown"]')
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
    //             type: TYPES.UPDATE_REFERRAL_DEPARTMENT,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 referralIndex: categoryId,
    //                 newDepartment: option.prop('value'),
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // it('dispatches correct action when adding department not found in dropdown', () => {
    //     const { store, wrapper } = mountWithStore(ReferralsForm);

    //     const value = 'MOST CERTAINLY NOT A DERPARTMENT';
    //     const input = wrapper.find('input[aria-label="department-Dropdown"]');
    //     input.instance().value = value;
    //     input.simulate('change', { target: { value } });
    //     input.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validates change

    //     const expectedActions = [
    //         {
    //             type: TYPES.UPDATE_REFERRAL_DEPARTMENT,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 referralIndex: categoryId,
    //                 newDepartment: value,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // it('dispatches correct action when selecting whenValue from dropdown', () => {
    //     const { store, wrapper } = mountWithStore(ReferralsForm);

    //     wrapper
    //         .find('input[aria-label="department-When"]')
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
    //             type: TYPES.UPDATE_REFERRAL_WHEN,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 referralIndex: categoryId,
    //                 newWhen: WhenResponse.Today,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // it('dispatches correct action when adding whenValue not found in dropdown', () => {
    //     const { store, wrapper } = mountWithStore(ReferralsForm);

    //     const value = 'NEVERR';
    //     const input = wrapper.find('input[aria-label="department-When"]');
    //     input.instance().value = value;
    //     input.simulate('change', { target: { value } });
    //     input.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validates change

    //     const expectedActions = [
    //         {
    //             type: TYPES.UPDATE_REFERRAL_WHEN,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 referralIndex: categoryId,
    //                 newWhen: value,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    it('dispatches correct action when updating comments', () => {
        const { store, wrapper } = mountWithStore(ReferralsForm);

        const value = 'foo';
        wrapper
            .find('[aria-label="department-Comment"]')
            .first()
            .simulate('change', {
                target: { value },
            });
        const expectedActions = [
            {
                type: TYPES.UPDATE_REFERRAL_COMMENTS,
                payload: {
                    conditionIndex: conditionId,
                    referralIndex: categoryId,
                    newComments: value,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches correct action when adding row', () => {
        const { store, wrapper } = mountWithStore(ReferralsForm);

        wrapper.find('button[aria-label="add-row"]').simulate('click');
        const expectedActions = [
            {
                type: TYPES.ADD_REFERRAL,
                payload: {
                    conditionIndex: conditionId,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});

describe('ProceduresAndServicesForm', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore(ProceduresAndServicesForm);
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const { wrapper } = mountWithStore(ProceduresAndServicesForm);
        expect(wrapper.html()).toMatchSnapshot();
    });

    // // TODO: Fix tests below
    // it('dispatches correct action when selecting procedure from dropdown', () => {
    //     const { store, wrapper } = mountWithStore(ProceduresAndServicesForm);
    //     // Open dropdown and select last dropdown option
    //     wrapper
    //         .find('input[aria-label="procedure-Dropdown"]')
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
    //             type: TYPES.UPDATE_PROCEDURE_OR_SERVICE,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 procedureIndex: categoryId,
    //                 newProcedure: option.prop('value'),
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // it('dispatches correct action when adding procedure not found in dropdown', () => {
    //     const { store, wrapper } = mountWithStore(ProceduresAndServicesForm);

    //     const value = 'MOST CERTAINLY NOT A PROCEDURE';
    //     const input = wrapper.find('input[aria-label="procedure-Dropdown"]');
    //     input.instance().value = value;
    //     input.simulate('change', { target: { value } });
    //     input.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validates change

    //     const expectedActions = [
    //         {
    //             type: TYPES.UPDATE_PROCEDURE_OR_SERVICE,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 procedureIndex: categoryId,
    //                 newProcedure: value,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // it('dispatches correct action when selecting whenValue from dropdown', () => {
    //     const { store, wrapper } = mountWithStore(ProceduresAndServicesForm);

    //     wrapper
    //         .find('input[aria-label="procedure-When"]')
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
    //             type: TYPES.UPDATE_PROCEDURE_OR_SERVICE_WHEN,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 procedureIndex: categoryId,
    //                 newWhen: option.prop('value'),
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    // it('dispatches correct action when adding whenValue not found in dropdown', () => {
    //     const { store, wrapper } = mountWithStore(ProceduresAndServicesForm);

    //     const value = 'NEVERR';
    //     const input = wrapper.find('input[aria-label="procedure-When"]');
    //     input.instance().value = value;
    //     input.simulate('change', { target: { value } });
    //     input.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validates change

    //     const expectedActions = [
    //         {
    //             type: TYPES.UPDATE_PROCEDURE_OR_SERVICE_WHEN,
    //             payload: {
    //                 conditionIndex: conditionId,
    //                 procedureIndex: categoryId,
    //                 newWhen: value,
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedActions);
    // });

    it('dispatches correct action when updating comments', () => {
        const { store, wrapper } = mountWithStore(ProceduresAndServicesForm);

        const value = 'foo';
        wrapper
            .find('[aria-label="procedure-Comment"]')
            .first()
            .simulate('change', {
                target: { value },
            });
        const expectedActions = [
            {
                type: TYPES.UPDATE_PROCEDURE_OR_SERVICE_COMMENTS,
                payload: {
                    conditionIndex: conditionId,
                    procedureIndex: categoryId,
                    newComments: value,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches correct action when adding row', () => {
        const { store, wrapper } = mountWithStore(ProceduresAndServicesForm);

        wrapper.find('button[aria-label="add-row"]').simulate('click');
        const expectedActions = [
            {
                type: TYPES.ADD_PROCEDURE_OR_SERVICE,
                payload: {
                    conditionIndex: conditionId,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});
