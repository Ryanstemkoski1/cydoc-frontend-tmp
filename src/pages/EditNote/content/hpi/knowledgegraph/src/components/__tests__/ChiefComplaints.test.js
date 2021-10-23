import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createCurrentNoteStore } from 'redux/store';
import ChiefComplaintsButton from '../ChiefComplaintsButton';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    const chiefComplaint = 'Abdominal Pain';
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <ChiefComplaintsButton name={chiefComplaint} />
            </Provider>
        ),
    };
};

describe('ChiefComplaintsButton', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    test('render button', () => {
        expect(wrapper.find('.tag_text').prop('style')).toEqual({
            backgroundColor: 'whitesmoke',
            color: 'black',
        });
    });

    test('click button', () => {
        wrapper.find('.tag_text').simulate('click');
        expect(wrapper.find('.tag_text').prop('style')).toEqual({
            backgroundColor: 'lightslategrey',
            color: 'white',
        });
    });

    test('unclick button', () => {
        wrapper.find('.tag_text').simulate('click');
        expect(wrapper.find('.tag_text').prop('style')).toEqual({
            backgroundColor: 'whitesmoke',
            color: 'black',
        });
    });
});
