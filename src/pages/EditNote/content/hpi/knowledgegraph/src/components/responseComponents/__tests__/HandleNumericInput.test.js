import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import HandleNumericInput from '../HandleNumericInput';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    store.dispatch(addNode('node', 'NUMBER'));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <HandleNumericInput node={'node'} max={10} />
            </Provider>
        ),
    };
};

describe('HandleNumericInput', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    test('changing numeric input updates value', () => {
        expect(wrapper.find('input[id="numeric-input"]').prop('value')).toEqual(
            0
        );
        wrapper.find('input[id="numeric-input"]').simulate('change', {
            target: { value: 8 },
        });
        wrapper.update();
        expect(wrapper.find('input[id="numeric-input"]').prop('value')).toEqual(
            8
        );
    });
});
