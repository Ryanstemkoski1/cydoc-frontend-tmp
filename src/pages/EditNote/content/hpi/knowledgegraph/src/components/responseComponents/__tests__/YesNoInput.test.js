import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import YesNo from '../YesNo';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    store.dispatch(addNode('node', 'YES-NO'));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <YesNo node={'node'} />
            </Provider>
        ),
    };
};

describe('YesNo', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    test('click yes button', () => {
        wrapper.find('.button_yesno').first().simulate('click');
        expect(wrapper.find('.button_yesno').first()).toBeTruthy();
        expect(wrapper.find('.button_yesno').first().prop('style')).toEqual({
            backgroundColor: 'lightslategrey',
            color: 'white',
        });
    });

    test('unclick yes button', () => {
        wrapper.find('.button_yesno').first().simulate('click');
        wrapper.update();
        expect(wrapper.find('.button_yesno').first().prop('style')).toEqual({
            backgroundColor: 'whitesmoke',
            color: 'black',
        });
    });

    test('click no button', () => {
        wrapper.find('.button_yesno').at(1).simulate('click');
        wrapper.update();
        expect(wrapper.find('.button_yesno').at(1).prop('style')).toEqual({
            backgroundColor: 'lightslategrey',
            color: 'white',
        });
    });

    test('unclick no button', () => {
        wrapper.find('.button_yesno').at(1).simulate('click');
        wrapper.update();
        expect(wrapper.find('.button_yesno').at(1).prop('style')).toEqual({
            backgroundColor: 'whitesmoke',
            color: 'black',
        });
    });
});
