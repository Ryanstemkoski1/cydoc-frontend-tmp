// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import Enzyme, { mount } from 'enzyme';
// import React from 'react';
// import RecreationalDrugs from '../RecreationalDrugs';

// import {
//     SubstanceUsageResponse,
//     YesNoMaybeResponse,
//     YesNoResponse,
// } from 'constants/enums';
// import { Provider } from 'react-redux';
// import configureStore from 'redux-mock-store';
// import { SOCIAL_HISTORY_ACTION } from '@redux/actions/actionTypes';
// import { initialSocialHistoryState } from '@redux/reducers/socialHistoryReducer';

// Enzyme.configure({ adapter: new Adapter() });

// const mockStore = configureStore([]);

// const mountWithStore = (
//     initialSocialHistory = initialSocialHistoryState,
//     props = {}
// ) => {
//     const store = mockStore({
//         socialHistory: initialSocialHistory,
//     });
//     return {
//         store,
//         wrapper: mount(
//             <Provider store={store}>
//                 <RecreationalDrugs {...props} />
//             </Provider>
//         ),
//     };
// };

// const mountDesktop = (socialHistoryState) =>
//     mountWithStore(socialHistoryState, { mobile: false });
// const mountMobile = (socialHistoryState) =>
//     mountWithStore(socialHistoryState, { mobile: true });

// describe('Recreational Drugs Integration', () => {
//     let cases = [
//         ['Desktop', mountDesktop],
//         ['Mobile', mountMobile],
//     ];

//     test.each(cases)(
//         '%s view renders without crashing',
//         (_type, mountRecreationlDrugsWithStore) => {
//             const { wrapper } = mountRecreationlDrugsWithStore();
//             expect(wrapper).toBeTruthy();
//         }
//     );

//     // test.each(cases)(
//     //     '%s view dispatches correct action when clicking Usage buttons',
//     //     (_type, mountRecreationalDrugsWithStore) => {
//     //         const { store, wrapper } = mountRecreationalDrugsWithStore();
//     //         wrapper
//     //             .find('button[condition="Recreational Drugs"][title="Yes"]')
//     //             .first()
//     //             .simulate('click');
//     //         let expectedActions = [
//     //             {
//     //                 type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USAGE,
//     //                 payload: {
//     //                     newUsage: SubstanceUsageResponse.Yes,
//     //                 },
//     //             },
//     //         ];
//     //         expect(store.getActions()).toEqual(expectedActions);

//     //         wrapper
//     //             .find(
//     //                 'button[condition="Recreational Drugs"][title="In the Past"]'
//     //             )
//     //             .first()
//     //             .simulate('click');
//     //         expectedActions.push({
//     //             type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USAGE,
//     //             payload: {
//     //                 newUsage: SubstanceUsageResponse.InThePast,
//     //             },
//     //         });
//     //         expect(store.getActions()).toEqual(expectedActions);

//     //         wrapper
//     //             .find(
//     //                 'button[condition="Recreational Drugs"][title="Never Used"]'
//     //             )
//     //             .first()
//     //             .simulate('click');
//     //         expectedActions.push({
//     //             type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USAGE,
//     //             payload: {
//     //                 newUsage: SubstanceUsageResponse.NeverUsed,
//     //             },
//     //         });
//     //         expect(store.getActions()).toEqual(expectedActions);
//     //     }
//     // );

//     // test.each(cases)(
//     //     '%s view dispatches correct action when adding recreational drug consumption',
//     //     (_type, mountRecreationalDrugsWithStore) => {
//     //         const recreationalDrugsState = {
//     //             ...initialSocialHistoryState,
//     //             recreationalDrugs: {
//     //                 ...initialSocialHistoryState.recreationalDrugs,
//     //                 usage: SubstanceUsageResponse.Yes,
//     //             },
//     //         };
//     //         const { store, wrapper } = mountRecreationalDrugsWithStore(
//     //             recreationalDrugsState
//     //         );
//     //         wrapper
//     //             .find(
//     //                 'button[aria-label="Add-Recreational-Drug-Consumption-Button"]'
//     //             )
//     //             .simulate('click');

//     //         const expectedActions = [
//     //             {
//     //                 type: SOCIAL_HISTORY_ACTION.ADD_RECREATIONAL_DRUG_USED,
//     //             },
//     //         ];
//     //         expect(store.getActions()).toEqual(expectedActions);
//     //     }
//     // );

//     // // TODO: Fix below tests
//     // test.each(cases)(
//     //     '%s view dispatches correct action when updating drug name',
//     //     (_type, mountRecreationalDrugsWithStore) => {
//     //         const recreationalDrugsState = {
//     //             ...initialSocialHistoryState,
//     //             recreationalDrugs: {
//     //                 ...initialSocialHistoryState.recreationalDrugs,
//     //                 usage: SubstanceUsageResponse.Yes,
//     //                 drugsUsed: [
//     //                     {
//     //                         name: '',
//     //                         modesOfDelivery: [],
//     //                         numberPerWeek: -1,
//     //                     },
//     //                 ],
//     //             },
//     //         };

//     //         const { store, wrapper } = mountRecreationalDrugsWithStore(
//     //             recreationalDrugsState
//     //         );

//     //         wrapper
//     //             .find(
//     //                 'input[aria-label="Recreational-Drug-Consumption-Name-Dropdown"]'
//     //             )
//     //             .first()
//     //             .simulate('focus');
//     //         wrapper
//     //             .find('.dropdown__control--is-focused')
//     //             .first()
//     //             .simulate('mousedown');
//     //         const option = wrapper.find('.option').first();
//     //         option.simulate('click');

//     //         const expectedActions = [
//     //             {
//     //                 type:
//     //                     SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NAME,
//     //                 payload: {
//     //                     index: 0,
//     //                     newName: option.prop('value'),
//     //                 },
//     //             },
//     //         ];
//     //         expect(store.getActions()).toEqual(expectedActions);
//     //     }
//     // );

//     // test.each(cases)(
//     //     '%s view dispatches correct action when updating modes of delivery',
//     //     (_type, mountRecreationalDrugsWithStore) => {
//     //         const recreationalDrugsState = {
//     //             ...initialSocialHistoryState,
//     //             recreationalDrugs: {
//     //                 ...initialSocialHistoryState.recreationalDrugs,
//     //                 usage: SubstanceUsageResponse.Yes,
//     //                 drugsUsed: [
//     //                     {
//     //                         name: '',
//     //                         modesOfDelivery: [],
//     //                         numberPerWeek: -1,
//     //                     },
//     //                 ],
//     //             },
//     //         };

//     //         const { store, wrapper } = mountRecreationalDrugsWithStore(
//     //             recreationalDrugsState
//     //         );
//     //         wrapper
//     //             .find(
//     //                 'input[aria-label="Recreational-Drug-Consumption-Modes-Of-Delivery-Dropdown"]'
//     //             )
//     //             .first()
//     //             .simulate('focus');
//     //         wrapper
//     //             .find('.dropdown__control--is-focused')
//     //             .first()
//     //             .simulate('mousedown');
//     //         const option = wrapper.find('.option').first();
//     //         option.simulate('click');

//     //         const expectedActions = [
//     //             {
//     //                 type:
//     //                     SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_MODES_OF_DELIVERY,
//     //                 payload: {
//     //                     index: 0,
//     //                     newModesOfDelivery: [option.prop('value')],
//     //                 },
//     //             },
//     //         ];
//     //         expect(store.getActions()).toEqual(expectedActions);
//     //     }
//     // );

//     // test.each(cases)(
//     //     '%s view dispatches correct action when updating number of recreational drugs consumed per week',
//     //     (_type, mountRecreationalDrugsWithStore) => {
//     //         const recreationalDrugsState = {
//     //             ...initialSocialHistoryState,
//     //             recreationalDrugs: {
//     //                 ...initialSocialHistoryState.recreationalDrugs,
//     //                 usage: SubstanceUsageResponse.Yes,
//     //                 drugsUsed: [
//     //                     {
//     //                         name: '',
//     //                         modesOfDelivery: [],
//     //                         numberPerWeek: -1,
//     //                     },
//     //                 ],
//     //             },
//     //         };

//     //         const { store, wrapper } = mountRecreationalDrugsWithStore(
//     //             recreationalDrugsState
//     //         );
//     //         const value = 2;

//     //         wrapper
//     //             .find(
//     //                 '[aria-label="Recreational-Drug-Consumption-Number-Per-Week-Input"] input'
//     //             )
//     //             .first()
//     //             .simulate('change', {
//     //                 target: { value },
//     //             });

//     //         const expectedActions = [
//     //             {
//     //                 type:
//     //                     SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_USED_NUMBER_PER_WEEK,
//     //                 payload: {
//     //                     index: 0,
//     //                     newNumberPerWeek: value,
//     //                 },
//     //             },
//     //         ];
//     //         expect(store.getActions()).toEqual(expectedActions);
//     //     }
//     // );

//     test.each(cases)(
//         '%s view dispatches correct action when deleting row from recreational drug consumption table',
//         (_type, mountRecreationalDrugsWithStore) => {
//             const recreationalDrugsState = {
//                 ...initialSocialHistoryState,
//                 recreationalDrugs: {
//                     ...initialSocialHistoryState.recreationalDrugs,
//                     usage: SubstanceUsageResponse.Yes,
//                     drugsUsed: [
//                         {
//                             name: '',
//                             modesOfDelivery: [],
//                             numberPerWeek: -1,
//                         },
//                     ],
//                 },
//             };

//             const { store, wrapper } = mountRecreationalDrugsWithStore(
//                 recreationalDrugsState
//             );

//             wrapper
//                 .find('button[aria-label="remove"]')
//                 .first()
//                 .simulate('click');
//             wrapper.update();

//             const expectedAction = {
//                 type: SOCIAL_HISTORY_ACTION.DELETE_RECREATIONAL_DRUG_USED,
//                 payload: {
//                     index: 0,
//                 },
//             };

//             expect(store.getActions()).toContainEqual(expectedAction);
//         }
//     );

//     test.each(cases)(
//         '%s view dispatches correct action when clicking "Are you interested in quitting?" buttons',
//         (_type, mountRecreationalDrugsWithStore) => {
//             const recreationalDrugsState = {
//                 ...initialSocialHistoryState,
//                 recreationalDrugs: {
//                     ...initialSocialHistoryState.recreationalDrugs,
//                     usage: SubstanceUsageResponse.Yes,
//                 },
//             };

//             const { store, wrapper } = mountRecreationalDrugsWithStore(
//                 recreationalDrugsState
//             );
//             const expectedActions = [];

//             wrapper
//                 .find(
//                     '.interested-in-quitting-buttons button[condition="Recreational Drugs"][title="Yes"]'
//                 )
//                 .simulate('click');
//             expectedActions.push({
//                 type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING,
//                 payload: {
//                     newResponse: YesNoMaybeResponse.Yes,
//                 },
//             });
//             expect(store.getActions()).toEqual(expectedActions);

//             wrapper
//                 .find(
//                     '.interested-in-quitting-buttons button[condition="Recreational Drugs"][title="Maybe"]'
//                 )
//                 .simulate('click');
//             expectedActions.push({
//                 type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING,
//                 payload: {
//                     newResponse: YesNoMaybeResponse.Maybe,
//                 },
//             });
//             expect(store.getActions()).toEqual(expectedActions);

//             wrapper
//                 .find(
//                     '.interested-in-quitting-buttons button[condition="Recreational Drugs"][title="No"]'
//                 )
//                 .simulate('click');
//             expectedActions.push({
//                 type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_INTERESTED_IN_QUITTING,
//                 payload: {
//                     newResponse: YesNoMaybeResponse.No,
//                 },
//             });
//             expect(store.getActions()).toEqual(expectedActions);
//         }
//     );

//     test.each(cases)(
//         '%s view dispatches correct action when clicking "Have you tried to quit before?" buttons',
//         (_type, mountRecreationalDrugsWithStore) => {
//             const recreationalDrugsState = {
//                 ...initialSocialHistoryState,
//                 recreationalDrugs: {
//                     ...initialSocialHistoryState.recreationalDrugs,
//                     usage: SubstanceUsageResponse.Yes,
//                 },
//             };

//             const { store, wrapper } = mountRecreationalDrugsWithStore(
//                 recreationalDrugsState
//             );
//             const expectedActions = [];

//             wrapper
//                 .find(
//                     '.tried-to-quit-buttons button[condition="Recreational Drugs"][title="Yes"]'
//                 )
//                 .simulate('click');
//             expectedActions.push({
//                 type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_TRIED_TO_QUIT,
//                 payload: {
//                     newResponse: YesNoResponse.Yes,
//                 },
//             });
//             expect(store.getActions()).toEqual(expectedActions);

//             wrapper
//                 .find(
//                     '.tried-to-quit-buttons button[condition="Recreational Drugs"][title="No"]'
//                 )
//                 .simulate('click');
//             expectedActions.push({
//                 type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_TRIED_TO_QUIT,
//                 payload: {
//                     newResponse: YesNoResponse.No,
//                 },
//             });
//             expect(store.getActions()).toEqual(expectedActions);
//         }
//     );

//     test.each(cases)(
//         '%s view dispatches correct action when updating recreational drugs comments',
//         (_type, mountRecreationalDrugsWithStore) => {
//             const recreationalDrugsState = {
//                 ...initialSocialHistoryState,
//                 recreationalDrugs: {
//                     ...initialSocialHistoryState.recreationalDrugs,
//                     usage: SubstanceUsageResponse.Yes,
//                 },
//             };

//             const { store, wrapper } = mountRecreationalDrugsWithStore(
//                 recreationalDrugsState
//             );
//             const value = 'new comments';

//             wrapper
//                 .find(
//                     'textarea[field="Comments"][condition="Recreational Drugs"]'
//                 )
//                 .simulate('change', {
//                     target: { value },
//                 });
//             const expectedActions = [
//                 {
//                     type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_COMMENTS,
//                     payload: {
//                         newComments: value,
//                     },
//                 },
//             ];
//             expect(store.getActions()).toEqual(expectedActions);
//         }
//     );

//     test.each(cases)(
//         '%s view dispatches correct action when updating quit year',
//         (_type, mountRecreationalDrugsWithStore) => {
//             const recreationalDrugsState = {
//                 ...initialSocialHistoryState,
//                 recreationalDrugs: {
//                     ...initialSocialHistoryState.recreationalDrugs,
//                     usage: SubstanceUsageResponse.InThePast,
//                 },
//             };

//             const { store, wrapper } = mountRecreationalDrugsWithStore(
//                 recreationalDrugsState
//             );
//             const value = 2020;

//             wrapper
//                 .find(
//                     'div[field="Quit Year"][condition="Recreational Drugs"] input'
//                 )
//                 .simulate('change', {
//                     target: { value },
//                 });
//             const expectedActions = [
//                 {
//                     type: SOCIAL_HISTORY_ACTION.UPDATE_RECREATIONAL_DRUG_QUIT_YEAR,
//                     payload: {
//                         newQuitYear: value,
//                     },
//                 },
//             ];
//             expect(store.getActions()).toEqual(expectedActions);
//         }
//     );

//     test('Desktop view properly handles cell click in consumption table', () => {
//         const recreationalDrugsState = {
//             ...initialSocialHistoryState,
//             recreationalDrugs: {
//                 ...initialSocialHistoryState.recreationalDrugs,
//                 usage: SubstanceUsageResponse.Yes,
//                 drugsUsed: [
//                     {
//                         name: '',
//                         modesOfDelivery: [],
//                         numberPerWeek: -1,
//                     },
//                 ],
//             },
//         };

//         const { wrapper } = mountWithStore(recreationalDrugsState, {
//             mobile: false,
//         });

//         wrapper.find('td').first().simulate('click');

//         expect(
//             wrapper
//                 .find('td')
//                 .first()
//                 .find('div[role="listbox"][class="visible menu transition"]')
//         ).toBeTruthy();
//     });
// });
