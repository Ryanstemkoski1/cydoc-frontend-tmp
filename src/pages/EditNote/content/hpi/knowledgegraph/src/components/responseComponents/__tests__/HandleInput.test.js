import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import HandleInput from '../HandleInput';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';
import { ExpectedResponseDict, testNode, testEdges } from 'constants/hpiEnums';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    const node = {
        ...testNode,
        responseType: 'SHORT-TEXT',
        response: ExpectedResponseDict.SHORT_TEXT,
    };
    // TODO: Use processKnowledgeGraph as addNode was replaced
    // store.dispatch(addNode('node', node, testEdges));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                {/* <HandleInput node={'node'} /> */}
            </Provider>
        ),
    };
};

describe('HandleInput', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    // // TODO: Fix below tests
    // test('changing input updates value', () => {
    //     const { wrapper } = connectRealStore();
    //     const foo = 'foo';
    //     expect(
    //         wrapper.find('textarea[id="handle-input"]').prop('value')
    //     ).toEqual('');
    //     wrapper.find('textarea[id="handle-input"]').simulate('change', {
    //         target: { value: foo },
    //     });
    //     wrapper.update();
    //     expect(
    //         wrapper.find('textarea[id="handle-input"]').prop('value')
    //     ).toEqual(foo);
    // });
});
