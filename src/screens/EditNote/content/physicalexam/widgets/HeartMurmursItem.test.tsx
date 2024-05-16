// import React from 'react';
// import { mount } from 'enzyme';
// import configureStore from 'redux-mock-store';
// import { Provider } from 'react-redux';
// import { initialPhysicalExamState } from '@redux/reducers/physicalExamReducer';
// import { makeStore } from '@redux/store';
// import { MURMURS_WIDGET_ACTION } from '@redux/actions/actionTypes';
// import HeartMurmursItem from './HeartMurmursItem';
// import HeartMurmurs from './HeartMurmurs';
// import { deleteNote } from '@redux/actions/currentNoteActions';
// import SpecificMurmurs from './SpecificMurmurs';

// const mockStore = configureStore([]);

// const mountWithMockStore = (
//     initStore = {
//         physicalExam: {
//             ...initialPhysicalExamState,
//             widgets: {
//                 ...initialPhysicalExamState.widgets,
//                 murmurs: {
//                     foo: {
//                         phase: '',
//                         crescendo: false,
//                         decrescendo: false,
//                         bestHeardAt: '',
//                         intensity: -1,
//                         pitch: '',
//                         quality: {
//                             blowing: false,
//                             harsh: false,
//                             rumbling: false,
//                             whooshing: false,
//                             rasping: false,
//                             musical: false,
//                         },
//                     },
//                 },
//             },
//         },
//     },
//     { ...props } = {
//         id: 'foo',
//     }
// ) => {
//     const store = mockStore(initStore);
//     return {
//         store,
//         wrapper: mount(
//             <Provider store={store}>
//                 <HeartMurmursItem {...props} />
//             </Provider>
//         ),
//     };
// };

// const mountWithRealStore = () => {
//     const store = makeStore();
//     return {
//         store,
//         wrapper: mount(
//             <Provider store={store}>
//                 <HeartMurmurs />
//             </Provider>
//         ),
//     };
// };

// describe('HeartMurmurs Redux', () => {
//     test('renders', () => {
//         const { wrapper } = mountWithMockStore();
//         expect(wrapper).toBeTruthy();
//     });

//     test('removing item redux', () => {
//         const { wrapper, store } = mountWithMockStore();
//         expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
//         wrapper.find('button.circular').find('i.x').simulate('click');
//         const expectedAction = [
//             {
//                 type: MURMURS_WIDGET_ACTION.DELETE_MURMURS_WIDGET_ITEM,
//                 payload: {
//                     id: 'foo',
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedAction);
//     });

//     test('update phase redux', () => {
//         const { wrapper, store } = mountWithMockStore();
//         expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == 'systolic')
//             .simulate('click');
//         const expectedAction = [
//             {
//                 type: MURMURS_WIDGET_ACTION.UPDATE_PHASE,
//                 payload: {
//                     id: 'foo',
//                     newPhase: 'systolic',
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedAction);
//     });

//     test('update crescendo redux', () => {
//         const { wrapper, store } = mountWithMockStore();
//         expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == 'crescendo')
//             .simulate('click');
//         const expectedAction = [
//             {
//                 type: MURMURS_WIDGET_ACTION.TOGGLE_CRESCENDO_DECRESCENDO,
//                 payload: {
//                     id: 'foo',
//                     crescendo: true,
//                     decrescendo: false,
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedAction);
//     });

//     test('update best heard redux', () => {
//         const { wrapper, store } = mountWithMockStore();
//         expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == 'RUSB')
//             .simulate('click');
//         const expectedAction = [
//             {
//                 type: MURMURS_WIDGET_ACTION.UPDATE_BEST_HEARD_AT,
//                 payload: {
//                     id: 'foo',
//                     newBestHeardAt: 'RUSB',
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedAction);
//     });

//     test('update intensity redux', () => {
//         const { wrapper, store } = mountWithMockStore();
//         expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == '1')
//             .simulate('click');
//         const expectedAction = [
//             {
//                 type: MURMURS_WIDGET_ACTION.UPDATE_INTENSITY,
//                 payload: {
//                     id: 'foo',
//                     newIntensity: 1,
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedAction);
//     });

//     test('update pitch redux', () => {
//         const { wrapper, store } = mountWithMockStore();
//         expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == 'low')
//             .simulate('click');
//         const expectedAction = [
//             {
//                 type: MURMURS_WIDGET_ACTION.UPDATE_PITCH,
//                 payload: {
//                     id: 'foo',
//                     newPitch: 'low',
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedAction);
//     });

//     test('update quality redux', () => {
//         const { wrapper, store } = mountWithMockStore();
//         expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == 'blowing')
//             .simulate('click');
//         const expectedAction = [
//             {
//                 type: MURMURS_WIDGET_ACTION.TOGGLE_QUALITY,
//                 payload: {
//                     id: 'foo',
//                     field: 'blowing',
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedAction);
//     });

//     test('toggle specific murmur info', () => {
//         const { wrapper, store } = mountWithMockStore();
//         expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
//         wrapper.find('button.circular').find('i.plus').simulate('click');
//         const expectedAction = [
//             {
//                 type: MURMURS_WIDGET_ACTION.TOGGLE_SPECIFIC_MURMUR_INFO,
//                 payload: {
//                     id: 'foo',
//                     showSpecificMurmurs: true,
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedAction);
//     });
// });

// describe('Heart Murmurs component', () => {
//     test.each([
//         ['phase', 'systolic', 'diastolic'],
//         ['crescendo', 'crescendo', 'decrescendo'],
//         ['heard best at', 'RUSB', 'apex'],
//         ['intensity', '1', '2'],
//         ['pitch', 'low', 'medium'],
//     ])('%s is single select', (name, tester, comparer) => {
//         const { wrapper, store } = mountWithRealStore();
//         //set up widget
//         wrapper.find('button').simulate('click');
//         wrapper.update();
//         expect(
//             wrapper
//                 .find('button')
//                 .filterWhere((button) => button.text() == tester)
//                 .hasClass('red')
//         ).toEqual(false);
//         expect(
//             wrapper
//                 .find('button')
//                 .filterWhere((button) => button.text() == comparer)
//                 .hasClass('red')
//         ).toEqual(false);

//         //select tester
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == tester)
//             .simulate('click');
//         wrapper.update();
//         expect(
//             wrapper
//                 .find('button')
//                 .filterWhere((button) => button.text() == tester)
//                 .hasClass('red')
//         ).toEqual(true);

//         //test should not be red when compare is selected
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == comparer)
//             .simulate('click');
//         wrapper.update();
//         expect(
//             wrapper
//                 .find('button')
//                 .filterWhere((button) => button.text() == comparer)
//                 .hasClass('red')
//         ).toEqual(true);

//         expect(
//             wrapper
//                 .find('button')
//                 .filterWhere((button) => button.text() == tester)
//                 .hasClass('red')
//         ).toEqual(false);

//         store.dispatch(deleteNote());
//     });

//     test('quality is multiselect', () => {
//         const others = ['harsh', 'rumbling', 'whooshing', 'rasping', 'musical'];
//         const { wrapper, store } = mountWithRealStore();
//         //set up widget
//         wrapper.find('button').simulate('click');
//         wrapper.update();
//         expect(
//             wrapper
//                 .find('button')
//                 .filterWhere((button) => button.text() == 'blowing')
//                 .hasClass('red')
//         ).toEqual(false);
//         others.map((text) =>
//             expect(
//                 wrapper
//                     .find('button')
//                     .filterWhere((button) => button.text() == text)
//                     .hasClass('red')
//             ).toEqual(false)
//         );

//         //multiselect
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == 'blowing')
//             .simulate('click');
//         expect(
//             wrapper
//                 .find('button')
//                 .filterWhere((button) => button.text() == 'blowing')
//                 .hasClass('red')
//         ).toEqual(true);
//         others.map((text) => {
//             wrapper
//                 .find('button')
//                 .filterWhere((button) => button.text() == text)
//                 .simulate('click');
//             expect(
//                 wrapper
//                     .find('button')
//                     .filterWhere((button) => button.text() == text)
//                     .hasClass('red')
//             ).toEqual(true);
//         });
//         store.dispatch(deleteNote());
//     });

//     test('expands only when systolic or diastolic is clicked', () => {
//         const { wrapper } = mountWithRealStore();
//         //set up widget
//         wrapper.find('button').simulate('click');

//         //try without systolic
//         wrapper
//             .find('button.circular')
//             .find('i.plus')
//             .first()
//             .simulate('click');
//         expect(wrapper.find(SpecificMurmurs)).toEqual({});

//         //try with systolic
//         wrapper
//             .find('button')
//             .filterWhere((button) => button.text() == 'systolic')
//             .simulate('click');
//         wrapper
//             .find('button.circular')
//             .find('i.plus')
//             .first()
//             .simulate('click');
//         expect(wrapper.find(SpecificMurmurs)).toHaveLength(1);
//     });
// });
