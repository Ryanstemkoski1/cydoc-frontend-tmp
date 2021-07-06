import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import HandleInput from '../HandleInput';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    store.dispatch(addNode('node', 'SHORT-TEXT'));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <HandleInput node={'node'} />
            </Provider>
        ),
    };
};

describe('HandleInput', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    test('changing input updates value', () => {
        const { wrapper } = connectRealStore();
        const foo = 'foo';
        expect(wrapper.find('input[id="handle-input"]').prop('value')).toEqual(
            ''
        );
        wrapper.find('input[id="handle-input"]').simulate('change', {
            target: { value: foo },
        });
        wrapper.update();
        expect(wrapper.find('input[id="handle-input"]').prop('value')).toEqual(
            foo
        );
    });
});
