import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import MultipleChoice from '../MultipleChoice';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    store.dispatch(addNode('node', 'CLICK-BOXES'));
    const listNames = ['foo1', 'foo2', 'foo3'];
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                {listNames.map((name) => (
                    <MultipleChoice key={name} node={'node'} name={name} />
                ))}
            </Provider>
        ),
    };
};

describe('MultipleChoice', () => {
    const { wrapper } = connectRealStore();
    const numChoices = wrapper.find('.button_question').length;

    test('renders', () => expect(wrapper).toBeTruthy());

    test('buttons are initialized correctly', () => {
        expect(numChoices).toEqual(3);
        for (let i = 0; i < numChoices; i++) {
            expect(
                wrapper.find('.button_question').at(i).prop('style')
            ).toEqual({
                backgroundColor: 'whitesmoke',
                color: 'black',
            });
        }
    });

    test('clicked button', () => {
        for (let i = 0; i < numChoices; i++) {
            wrapper.find('.button_question').at(i).simulate('click');
            wrapper.update();
            expect(
                wrapper.find('.button_question').at(i).prop('style')
            ).toEqual({
                backgroundColor: 'lightslategrey',
                color: 'white',
            });
        }
    });

    test('unclicked button', () => {
        for (let i = 0; i < numChoices; i++) {
            wrapper.find('.button_question').at(i).simulate('click');
            wrapper.update();
            expect(
                wrapper.find('.button_question').at(i).prop('style')
            ).toEqual({
                backgroundColor: 'whitesmoke',
                color: 'black',
            });
        }
    });
});
