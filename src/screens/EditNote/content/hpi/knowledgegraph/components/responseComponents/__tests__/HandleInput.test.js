// import React from 'react';
// import Enzyme, { mount } from 'enzyme';
// import Adapter from '@cfaester/enzyme-adapter-react-18';
// import { Provider } from 'react-redux';
// // import HandleInput from '../HandleInput';
// import { makeStore } from '@redux/store';
// // import { ExpectedResponseDict, testNode, testEdges } from 'constants/hpiEnums';

// Enzyme.configure({ adapter: new Adapter() });

// const connectRealStore = () => {
//     const store = makeStore();
//     // const node = {
//     //     ...testNode,
//     //     responseType: 'SHORT-TEXT',
//     //     response: ExpectedResponseDict.SHORT_TEXT,
//     // };
//     // TODO: Use processKnowledgeGraph as addNode was replaced
//     // store.dispatch(addNode('node', node, testEdges));
//     return {
//         store,
//         wrapper: mount(
//             <Provider store={store}>
//                 {/* <HandleInput node={'node'} /> */}
//             </Provider>
//         ),
//     };
// };

// describe('HandleInput', () => {
//     const { wrapper } = connectRealStore();

//     test('renders', () => expect(wrapper).toBeTruthy());

//     // // TODO: Fix below tests
//     // test('changing input updates value', () => {
//     //     const { wrapper } = connectRealStore();
//     //     const foo = 'foo';
//     //     expect(
//     //         wrapper.find('textarea[id="handle-input"]').prop('value')
//     //     ).toEqual('');
//     //     wrapper.find('textarea[id="handle-input"]').simulate('change', {
//     //         target: { value: foo },
//     //     });
//     //     wrapper.update();
//     //     expect(
//     //         wrapper.find('textarea[id="handle-input"]').prop('value')
//     //     ).toEqual(foo);
//     // });
// });
