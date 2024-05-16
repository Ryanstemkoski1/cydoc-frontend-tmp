// import React from 'react';
// import Enzyme, { mount } from 'enzyme';
// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import { act } from 'react-dom/test-utils';
// import DifferentialDiagnosesForm from '../forms/DifferentialDiagnosesForm';
// import configureStore from 'redux-mock-store';
// import { conditionId, categoryId, initialPlan } from '../util';
// import { Provider } from 'react-redux';
// import { PLAN_ACTION as TYPES } from '@redux/actions/actionTypes';

// Enzyme.configure({ adapter: new Adapter() });

// const mockStore = configureStore([]);

// const mountWithStore = (
//     initStore = { discussionPlan: initialPlan },
//     { ...props } = {}
// ) => {
//     const store = mockStore(initStore);
//     props = {
//         conditionId,
//         // Need to mock actual implementation as this function is responsible
//         // for action dispatching
//         formatAction: jest.fn(
//             (action) =>
//                 (_, { uuid, value }) =>
//                     action(conditionId, uuid, value)
//         ),
//         ...props,
//     };
//     return {
//         store,
//         wrapper: mount(
//             <Provider store={store}>
//                 <DifferentialDiagnosesForm {...props} />
//             </Provider>
//         ),
//     };
// };

// describe('DifferentialDiagnosesForm', () => {
//     it('renders without crashing', () => {
//         let wrapper;

//         act(() => {
//             wrapper = mountWithStore()['wrapper'];
//         });
//         expect(wrapper).toBeTruthy();
//     });

//     it('matches snapshot', async () => {
//         let wrapper;

//         act(() => {
//             wrapper = mountWithStore()['wrapper'];
//         });

//         await act(async () => {
//             await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
//             wrapper.update();
//         });
//         expect(wrapper.html()).toMatchSnapshot();
//     });

//     // // TODO: Fix below tests
//     // it('dispatches correct action when selecting diagnosis from dropdown', () => {
//     //     const { store, wrapper } = mountWithStore();

//     //     // Open dropdown and select first option
//     //     wrapper
//     //         .find('input[aria-label="Diagnosis-Dropdown"]')
//     //         .first()
//     //         .simulate('focus');
//     //     wrapper
//     //         .find('.dropdown__control--is-focused')
//     //         .first()
//     //         .simulate('mousedown');
//     //     const option = wrapper.find('.option').first();
//     //     option.simulate('click');

//     //     const expectedActions = [
//     //         {
//     //             type: TYPES.UPDATE_DIFFERENTIAL_DIAGNOSIS,
//     //             payload: {
//     //                 conditionIndex: conditionId,
//     //                 diagnosisIndex: categoryId,
//     //                 newDiagnosis: option.prop('value'),
//     //             },
//     //         },
//     //     ];
//     //     expect(store.getActions()).toEqual(expectedActions);
//     // });

//     // it('dispatches correct action when adding diagnosis not found in dropdown', () => {
//     //     const { store, wrapper } = mountWithStore();
//     //     const value = 'MOST CERTAINLY NOT A VALUE';
//     //     const input = wrapper.find('input[aria-label="Diagnosis-Dropdown"]');
//     //     input.instance().value = value;
//     //     input.simulate('change', { target: { value } });
//     //     input.simulate('keyDown', { keyCode: 9, key: 'Tab' }); // validates change

//     //     const expectedActions = [
//     //         {
//     //             type: TYPES.UPDATE_DIFFERENTIAL_DIAGNOSIS,
//     //             payload: {
//     //                 conditionIndex: conditionId,
//     //                 diagnosisIndex: categoryId,
//     //                 newDiagnosis: value,
//     //             },
//     //         },
//     //     ];
//     //     expect(store.getActions()).toEqual(expectedActions);
//     // });

//     it('dispatches correct action when updating comments', async () => {
//         let stor, wrap;

//         act(() => {
//             const { store, wrapper } = mountWithStore();
//             stor = store;
//             wrap = wrapper;
//         });

//         await act(async () => {
//             await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
//             wrap.update();
//         });

//         const value = 'foo';
//         wrap.find('textarea[aria-label="Diagnosis-Comment"]').simulate(
//             'change',
//             {
//                 target: { value },
//             }
//         );
//         const expectedActions = [
//             {
//                 type: TYPES.UPDATE_DIFFERENTIAL_DIAGNOSIS_COMMENTS,
//                 payload: {
//                     conditionIndex: conditionId,
//                     diagnosisIndex: categoryId,
//                     newComments: value,
//                 },
//             },
//         ];
//         expect(stor.getActions()).toEqual(expectedActions);
//     });

//     it('dispatches correct action when adding row', async () => {
//         let stor, wrap;

//         act(() => {
//             const { store, wrapper } = mountWithStore();
//             stor = store;
//             wrap = wrapper;
//         });

//         await act(async () => {
//             await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
//             wrap.update();
//         });

//         wrap.find('button[aria-label="add-row"]').simulate('click');
//         const expectedActions = [
//             {
//                 type: TYPES.ADD_DIFFERENTIAL_DIAGNOSIS,
//                 payload: {
//                     conditionIndex: conditionId,
//                 },
//             },
//         ];
//         expect(stor.getActions()).toEqual(expectedActions);
//     });
// });
