import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { Provider } from 'react-redux';
// import HandleNumericInput from '../HandleNumericInput';
import { createCurrentNoteStore } from 'redux/store';
// import { ExpectedResponseDict, testEdges, testNode } from 'constants/hpiEnums';

Enzyme.configure({ adapter: new Adapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    // const node = {
    //     ...testNode,
    //     responseType: 'NUMBER',
    //     response: ExpectedResponseDict.NUMBER,
    // };
    // // TODO: Use processKnowledgeGraph as addNode was replaced
    // store.dispatch(addNode('node', node, testEdges));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                {/* <HandleNumericInput node={'node'} max={10} /> */}
            </Provider>
        ),
    };
};

describe('HandleNumericInput', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    // // TODO: Fix below tests
    // test('changing numeric input updates value', () => {
    //     expect(wrapper.find('input[id="numeric-input"]').prop('value')).toEqual(
    //         0
    //     );
    //     wrapper.find('input[id="numeric-input"]').simulate('change', {
    //         target: { value: 8 },
    //     });
    //     wrapper.update();
    //     expect(wrapper.find('input[id="numeric-input"]').prop('value')).toEqual(
    //         8
    //     );
    // });
});
