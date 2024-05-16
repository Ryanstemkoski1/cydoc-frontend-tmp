// import React from 'react';
// import Enzyme, { mount } from 'enzyme';
// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import { Provider } from 'react-redux';
// import { makeStore } from '@redux/store';
// import ChiefComplaintsButton from '../ChiefComplaintsButton';

// Enzyme.configure({ adapter: new Adapter() });

// const connectRealStore = () => {
//     const store = makeStore();
//     const chiefComplaint = 'Abdominal Pain';
//     return {
//         store,
//         wrapper: mount(
//             <Provider store={store}>
//                 <ChiefComplaintsButton name={chiefComplaint} />
//             </Provider>
//         ),
//     };
// };

// describe('ChiefComplaintsButton', () => {
//     const { wrapper } = connectRealStore();

//     test('renders', () => expect(wrapper).toBeTruthy());

//     // // TODO: Fix below tests
//     // test('render button', () => {
//     //     expect(wrapper.find('.tag_text').prop('style')).toEqual({
//     //         backgroundColor: 'whitesmoke',
//     //         color: 'black',
//     //     });
//     // });

//     // test('click button', () => {
//     //     wrapper.find('.tag_text').simulate('click');
//     //     expect(wrapper.find('.tag_text').prop('style')).toEqual({
//     //         backgroundColor: 'lightslategrey',
//     //         color: 'white',
//     //     });
//     // });

//     // test('unclick button', () => {
//     //     wrapper.find('.tag_text').simulate('click');
//     //     expect(wrapper.find('.tag_text').prop('style')).toEqual({
//     //         backgroundColor: 'whitesmoke',
//     //         color: 'black',
//     //     });
//     // });
// });
