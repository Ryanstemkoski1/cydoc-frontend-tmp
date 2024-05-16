// import React from 'react';
// import Enzyme, { mount } from 'enzyme';
// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import SocialHistoryContent from '../SocialHistoryContent';

// import configureStore from 'redux-mock-store';
// import { Provider } from 'react-redux';
// import { SOCIAL_HISTORY_ACTION } from '@redux/actions/actionTypes';
// import { initialSocialHistoryState } from '@redux/reducers/socialHistoryReducer';

// Enzyme.configure({ adapter: new Adapter() });

// const mockStore = configureStore([]);

// const mountWithStore = (
//     initialSocialHistory = initialSocialHistoryState,
//     props = {}
// ) => {
//     const store = mockStore({ socialHistory: initialSocialHistory });
//     return {
//         store,
//         wrapper: mount(
//             <Provider store={store}>
//                 <SocialHistoryContent {...props} />
//             </Provider>
//         ),
//     };
// };

// const mountDesktop = () =>
//     mountWithStore(initialSocialHistoryState, { mobile: false });
// const mountMobile = () =>
//     mountWithStore(initialSocialHistoryState, { mobile: true });

// describe('Social History Integration', () => {
//     let cases = [
//         ['Desktop', mountDesktop],
//         ['Mobile', mountMobile],
//     ];

//     test.each(cases)(
//         '%s view renders without crashing',
//         (_type, mountSocialHistoryWithStore) => {
//             const { wrapper } = mountSocialHistoryWithStore();
//             expect(wrapper).toBeTruthy();
//         }
//     );

//     test.each(cases)(
//         '%s view dispatches correct action when changing Living Situation text',
//         (_type, mountSocialHistoryWithStore) => {
//             const { store, wrapper } = mountSocialHistoryWithStore();
//             const value = 'new living situation';
//             wrapper
//                 .find('textarea[field="Living Situation"]')
//                 .first()
//                 .simulate('change', {
//                     target: { value },
//                 });
//             const expectedActions = [
//                 {
//                     type: SOCIAL_HISTORY_ACTION.UPDATE_LIVING_SITUATION,
//                     payload: {
//                         newLivingSituation: value,
//                     },
//                 },
//             ];
//             expect(store.getActions()).toEqual(expectedActions);
//         }
//     );

//     test.each(cases)(
//         '%s view dispatches correct action when changing Employment text',
//         (_type, mountSocialHistoryWithStore) => {
//             const { store, wrapper } = mountSocialHistoryWithStore();
//             const value = 'new employment';
//             wrapper
//                 .find('textarea[field="Employment"]')
//                 .first()
//                 .simulate('change', {
//                     target: { value },
//                 });
//             const expectedActions = [
//                 {
//                     type: SOCIAL_HISTORY_ACTION.UPDATE_EMPLOYMENT,
//                     payload: {
//                         newEmployment: value,
//                     },
//                 },
//             ];
//             expect(store.getActions()).toEqual(expectedActions);
//         }
//     );

//     test.each(cases)(
//         '%s view dispatches correct action when changing Diet text',
//         (_type, mountSocialHistoryWithStore) => {
//             const { store, wrapper } = mountSocialHistoryWithStore();
//             const value = 'new diet';
//             wrapper.find('textarea[field="Diet"]').first().simulate('change', {
//                 target: { value },
//             });
//             const expectedActions = [
//                 {
//                     type: SOCIAL_HISTORY_ACTION.UPDATE_DIET,
//                     payload: {
//                         newDiet: value,
//                     },
//                 },
//             ];
//             expect(store.getActions()).toEqual(expectedActions);
//         }
//     );

//     test.each(cases)(
//         '%s view dispatches correct action when changing Exercise text',
//         (_type, mountSocialHistoryWithStore) => {
//             const { store, wrapper } = mountSocialHistoryWithStore();
//             const value = 'new exercise';
//             wrapper
//                 .find('textarea[field="Exercise"]')
//                 .first()
//                 .simulate('change', {
//                     target: { value },
//                 });
//             const expectedActions = [
//                 {
//                     type: SOCIAL_HISTORY_ACTION.UPDATE_EXERCISE,
//                     payload: {
//                         newExercise: value,
//                     },
//                 },
//             ];
//             expect(store.getActions()).toEqual(expectedActions);
//         }
//     );
// });
