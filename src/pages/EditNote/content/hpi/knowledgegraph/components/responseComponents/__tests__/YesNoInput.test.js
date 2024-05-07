import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { Provider } from 'react-redux';
// import YesNo from '../YesNo';
import { makeStore } from '@redux/store';
// import { ExpectedResponseDict, testEdges, testNode } from 'constants/hpiEnums';

Enzyme.configure({ adapter: new Adapter() });

const connectRealStore = () => {
    const store = makeStore();
    // const node = {
    //     ...testNode,
    //     responseType: 'YES-NO',
    //     response: ExpectedResponseDict.YES_NO,
    // };
    // TODO: Use processKnowledgeGraph as addNode was replaced
    // store.dispatch(addNode('node', node, testEdges));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>{/* <YesNo node={'node'} /> */}</Provider>
        ),
    };
};

describe('YesNo', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    // // TODO: Fix tests below
    // test('click yes button', () => {
    //     expect(wrapper.find('button').first().prop('className')).toEqual(
    //         expect.not.stringContaining('active')
    //     );
    //     wrapper.find('button').first().simulate('click');
    //     expect(wrapper.find('button').first()).toBeTruthy();
    //     expect(wrapper.find('button').first().prop('className')).toEqual(
    //         expect.stringContaining('active')
    //     );
    // });

    // test('unclick yes button', () => {
    //     wrapper.find('button[title="Yes"]').simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find('button[title="Yes"]').prop('className')).toEqual(
    //         expect.not.stringContaining('active')
    //     );
    // });

    // test('click no button', () => {
    //     expect(wrapper.find('button[title="No"]').prop('className')).toEqual(
    //         expect.not.stringContaining('active')
    //     );
    //     wrapper.find('button[title="No"]').simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find('button[title="No"]').prop('className')).toEqual(
    //         expect.stringContaining('active')
    //     );
    // });

    // test('unclick no button', () => {
    //     wrapper.find('button[title="No"]').simulate('click');
    //     wrapper.update();
    //     expect(wrapper.find('button[title="No"]').prop('className')).toEqual(
    //         expect.not.stringContaining('active')
    //     );
    // });
});
