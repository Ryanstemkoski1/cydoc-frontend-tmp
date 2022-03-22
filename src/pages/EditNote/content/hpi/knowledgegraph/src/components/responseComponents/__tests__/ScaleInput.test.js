import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import ScaleInput from '../ScaleInput';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';
import { ExpectedResponseDict, testEdges, testNode } from 'constants/hpiEnums';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    const node = {
        ...testNode,
        responseType: 'SCALE1TO10',
        response: ExpectedResponseDict.SCALE1TO10,
    };
    store.dispatch(addNode('node', node, testEdges));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <ScaleInput node={'node'} />
            </Provider>
        ),
    };
};

describe('ScaleInput', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    test('changing scale updates scales value', () => {
        expect(wrapper.find('input[id="scale-slider"]').prop('value')).toBe('');
        wrapper.find('input[id="scale-slider"]').simulate('change', {
            target: { value: 5 },
        });
        wrapper.update();
        expect(wrapper.find('input[id="scale-slider"]').prop('value')).toEqual(
            5
        );
    });

    test('clearing scale updates scales value', () => {
        wrapper.find('.scale-clear').simulate('click');
        wrapper.update();
        expect(wrapper.find('input[id="scale-slider"]').prop('value')).toBe('');
    });

    test('inputting scale value updates scales value', () => {
        expect(wrapper.find('input[id="scale-value"]').prop('value')).toBe('');
        wrapper.find('input[id="scale-value"]').simulate('change', {
            target: { value: 9 },
        });
        wrapper.update();
        expect(wrapper.find('input[id="scale-value"]').prop('value')).toEqual(
            9
        );
    });
});
