import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { Provider } from 'react-redux';
// import TimeInput from '../TimeInput';
import { makeStore } from '@redux/store';
// import { ExpectedResponseDict, testEdges, testNode } from 'constants/hpiEnums';

Enzyme.configure({ adapter: new Adapter() });

const connectRealStore = () => {
    const store = makeStore();
    // const node = {
    //     ...testNode,
    //     responseType: 'TIME3DAYS',
    //     response: ExpectedResponseDict.TIME3DAYS,
    // };
    // TODO: Use processKnowledgeGraph as addNode was replaced
    // store.dispatch(addNode('node', node, testEdges));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                {/* <TimeInput node={'node'} /> */}
            </Provider>
        ),
    };
};

describe('TimeInput', () => {
    const { wrapper } = connectRealStore();
    test('renders', () => expect(wrapper).toBeTruthy());

    // // TODO: Fix below tests
    // test('numeric time input updates value', () => {
    //     expect(
    //         wrapper.find('input[id="numeric-input"]').prop('value')
    //     ).toBeNull();
    //     wrapper.find('input[id="numeric-input"]').simulate('change', {
    //         target: { value: 8 },
    //     });
    //     wrapper.update();
    //     expect(wrapper.find('input[id="numeric-input"]').prop('value')).toEqual(
    //         8
    //     );
    // });

    // test('time option buttons work', () => {
    //     const numButtons = wrapper.find('button').length;
    //     const timeOptions = [
    //         'minutes',
    //         'hours',
    //         'days',
    //         'weeks',
    //         'months',
    //         'years',
    //     ];
    //     expect(numButtons).toEqual(timeOptions.length);
    //     for (let i = 0; i < numButtons; i++) {
    //         expect(wrapper.find('button').at(i).prop('className')).toEqual(
    //             expect.not.stringContaining('active')
    //         );
    //         expect(wrapper.find('button').at(i).prop('title')).toEqual(
    //             timeOptions[i]
    //         );
    //         wrapper.find('button').at(i).simulate('click');
    //         wrapper.update();
    //         expect(wrapper.find('button').at(i).prop('className')).toEqual(
    //             expect.stringContaining('active')
    //         );
    //     }
    // });
});
