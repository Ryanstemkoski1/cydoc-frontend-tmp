import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import MultipleChoice from '../MultipleChoice';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';
import { ExpectedResponseDict, testEdges, testNode } from 'constants/hpiEnums';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    const node = {
        ...testNode,
        responseType: 'CLICK-BOXES',
        response: ExpectedResponseDict.CLICK_BOXES,
    };
    store.dispatch(addNode('node', node, testEdges));
    const listNames = ['foo1', 'foo2', 'foo3'];
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                {listNames.map((name) => (
                    <MultipleChoice key={name} name={name} node={'node'} />
                ))}
            </Provider>
        ),
    };
};

describe('MultipleChoice', () => {
    const { wrapper } = connectRealStore();
    const numChoices = wrapper.find('button').length;

    test('renders', () => expect(wrapper).toBeTruthy());

    test('buttons are initialized correctly', () => {
        expect(numChoices).toEqual(3);
        for (let i = 0; i < numChoices; i++) {
            expect(wrapper.find('button').at(i).prop('className')).toEqual(
                expect.not.stringContaining('active')
            );
        }
    });

    test('clicked button to be made active', () => {
        for (let i = 0; i < numChoices; i++) {
            wrapper.find('button').at(i).simulate('click');
            wrapper.update();
            expect(wrapper.find('button').at(i).prop('className')).toEqual(
                expect.stringContaining('active')
            );
        }
    });

    test('unclicked button to be made inactive', () => {
        for (let i = 0; i < numChoices; i++) {
            wrapper.find('button').at(i).simulate('click');
            wrapper.update();
            expect(wrapper.find('button').at(i).prop('className')).toEqual(
                expect.not.stringContaining('active')
            );
        }
    });
});
