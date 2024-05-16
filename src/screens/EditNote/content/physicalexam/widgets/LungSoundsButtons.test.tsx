// import React from 'react';
// import { mount, ReactWrapper } from 'enzyme';
// import configureStore from 'redux-mock-store';
// import { Provider } from 'react-redux';
// import LungSoundsButtons from './LungSoundsButtons';
// import { initialPhysicalExamState } from '@redux/reducers/physicalExamReducer';
// import { LungsWidgetState } from '@redux/reducers/widgetReducers/lungsWidgetReducer';
// import { LUNGS_WIDGET_ACTION } from '@redux/actions/actionTypes';
// import { Button, Popup } from 'semantic-ui-react';
// import { makeStore } from '@redux/store';
// import { act } from 'react-dom/test-utils';

// const section = 'leftLowerLobe';
// const field = 'wheezes';
// const popupField = 'bronchialBreathSounds';
// const mockStore = configureStore([]);

// const mountWithMockStore = (
//     initStore = {
//         physicalExam: initialPhysicalExamState,
//     },
//     lungLobe: keyof LungsWidgetState = section,
//     { ...props } = {}
// ) => {
//     const store = mockStore(initStore);
//     return {
//         store,
//         wrapper: mount(
//             <Provider store={store}>
//                 <LungSoundsButtons lungLobe={lungLobe} {...props} />
//             </Provider>
//         ),
//     };
// };

// const mountWithRealStore = (
//     lungLobe: keyof LungsWidgetState = section,
//     { ...props } = {}
// ) => {
//     return mount(
//         <Provider store={makeStore()}>
//             <LungSoundsButtons lungLobe={lungLobe} {...props} />
//         </Provider>
//     );
// };

// describe('LungSoundsButtons', () => {
//     let wrapper: ReactWrapper;

//     beforeEach(() => {
//         ({ wrapper } = mountWithMockStore());
//     });

//     it('renders without crashing', () => {
//         expect(wrapper).toBeTruthy();
//     });

//     it('matches snapshot', () => {
//         expect(wrapper).toMatchSnapshot();
//     });
// });

// describe('LungSoundsButtons with mock store', () => {
//     it('dispatches correct action when clicking an option', () => {
//         const { store, wrapper } = mountWithMockStore();
//         wrapper.findWhere((node) => node.key() === field).simulate('click');

//         const expectedActions = [
//             {
//                 type: LUNGS_WIDGET_ACTION.TOGGLE_LUNGS_WIDGET_SECTION,
//                 payload: {
//                     section,
//                     field,
//                 },
//             },
//         ];
//         expect(store.getActions()).toEqual(expectedActions);
//     });

//     it('hides popup trigger when all additional options are selected', () => {
//         const { wrapper } = mountWithMockStore({
//             physicalExam: {
//                 ...initialPhysicalExamState,
//                 widgets: {
//                     ...initialPhysicalExamState.widgets,
//                     lungs: {
//                         ...initialPhysicalExamState.widgets.lungs,
//                         [section]: {
//                             ...initialPhysicalExamState.widgets.lungs[section],
//                             bronchialBreathSounds: true,
//                             vesicularBreathSounds: true,
//                             egophony: true,
//                             whistling: true,
//                             stridor: true,
//                         },
//                     },
//                 },
//             },
//         });
//         expect(wrapper.find(Button)).toHaveLength(8);
//         expect(wrapper.find('Button[icon="plus"]')).toHaveLength(0);
//     });
// });

// describe('LungSoundsButtons with real store', () => {
//     let wrapper: ReactWrapper;
//     const findButton = (key: string) =>
//         wrapper.findWhere((node) => node.key() === key);

//     beforeEach(() => {
//         jest.useFakeTimers();
//         wrapper = mountWithRealStore();
//     });

//     it('changes button color after being clicked', () => {
//         expect(findButton(field).prop('color')).toBe(undefined);

//         findButton(field).simulate('click');
//         expect(findButton(field).prop('color')).toBe('red');

//         findButton(field).simulate('click');
//         expect(findButton(field).prop('color')).toBe(undefined);
//     });

//     it('shows popup when hovering over More Options button', async () => {
//         expect(findButton(popupField)).toHaveLength(0);
//         expect(wrapper.find(Popup).find(Button)).toHaveLength(1); //This one button is the popup trigger

//         await act(() => {
//             wrapper.find('Button[icon="plus"]').simulate('mouseenter');
//             wrapper.update();
//             jest.runAllTimers(); //Simulates popup delay
//         });
//         wrapper.update();
//         expect(findButton(popupField)).toHaveLength(1);
//         expect(wrapper.find(Popup).find(Button)).toHaveLength(6); //There should be 5 hidden buttons

//         await act(() => {
//             wrapper.find('Button[icon="plus"]').simulate('mouseleave');
//             jest.runAllTimers();
//             wrapper.update();
//         });
//         wrapper.update();
//         expect(
//             wrapper.findWhere((node) => node.key() === popupField)
//         ).toHaveLength(0);
//         expect(wrapper.find(Popup).find(Button)).toHaveLength(1);
//     });

//     it('removes buttons from popup and puts them outside popup when they are clicked', async () => {
//         await act(() => {
//             wrapper.find('Button[icon="plus"]').simulate('mouseenter');
//             wrapper.update();
//             jest.runAllTimers();
//         });
//         wrapper.update();

//         expect(wrapper.find(Popup).find(Button)).toHaveLength(6);

//         findButton(popupField).simulate('click');
//         expect(wrapper.find(Popup).find(Button)).toHaveLength(5);

//         wrapper.find('Button[icon="plus"]').simulate('mouseleave');
//         jest.runAllTimers();
//         wrapper.update();
//         expect(findButton(popupField)).toHaveLength(1);
//     });
// });
