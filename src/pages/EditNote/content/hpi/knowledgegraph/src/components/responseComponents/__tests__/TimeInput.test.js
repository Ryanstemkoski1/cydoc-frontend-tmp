import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import TimeInput from '../TimeInput';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    store.dispatch(addNode('node', 'TIME3DAYS'));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <TimeInput node={'node'} />
            </Provider>
        ),
    };
};

describe('TimeInput', () => {
    const { wrapper } = connectRealStore();
    test('renders', () => expect(wrapper).toBeTruthy());

    test('numeric time input updates value', () => {
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

    test('time option buttons work', () => {
        const numButtons = wrapper.find('.time-grid-button').length;
        const timeOptions = [
            'minutes',
            'hours',
            'days',
            'weeks',
            'months',
            'years',
        ];
        expect(numButtons).toEqual(timeOptions.length);
        for (let i = 0; i < numButtons; i++) {
            expect(
                wrapper.find('.time-grid-button').at(i).prop('color')
            ).toBeUndefined();
            expect(
                wrapper.find('.time-grid-button').at(i).prop('title')
            ).toEqual(timeOptions[i]);
            wrapper.find('.time-grid-button').at(i).simulate('click');
            wrapper.update();
            expect(
                wrapper.find('.time-grid-button').at(i).prop('color')
            ).toEqual('grey');
        }
    });
});
