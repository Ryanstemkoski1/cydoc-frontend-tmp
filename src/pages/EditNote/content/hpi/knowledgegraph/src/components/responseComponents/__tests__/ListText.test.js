import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import ListText from '../ListText';
import { addNode } from 'redux/actions/hpiActions';
import { createCurrentNoteStore } from 'redux/store';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const connectRealStore = () => {
    const store = createCurrentNoteStore();
    store.dispatch(addNode('node', 'LIST-TEXT'));
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <ListText node={'node'} />
            </Provider>
        ),
    };
};

describe('ListText', () => {
    const { wrapper } = connectRealStore();

    test('renders', () => expect(wrapper).toBeTruthy());

    test('changing list text input', () => {
        const foo = 'foo';
        for (let i = 0; i < 3; i++) {
            expect(
                wrapper.find('input[id="list-text-input"]').at(i).prop('value')
            ).toEqual('');
            wrapper
                .find('input[id="list-text-input"]')
                .at(i)
                .simulate('change', {
                    target: { value: foo },
                });
            wrapper.update();
            expect(
                wrapper.find('input[id="list-text-input"]').at(i).prop('value')
            ).toEqual(foo);
        }
    });

    test('adding list input', () => {
        // add initial values
        const numInputs = wrapper.find('input[id="list-text-input"]').length;
        const foo = 'foo';
        wrapper
            .find('input[id="list-text-input"]')
            .at(0)
            .simulate('change', {
                target: { value: foo },
            });
        wrapper.update();
        wrapper
            .find('input[id="list-text-input"]')
            .at(numInputs - 1)
            .simulate('change', {
                target: { value: foo + foo },
            });
        wrapper.update();

        // add list text
        wrapper.find('.button-plus-click').simulate('click');
        wrapper.update();
        expect(wrapper.find('input[id="list-text-input"]').length).toEqual(
            numInputs + 1
        );
        expect(
            wrapper.find('input[id="list-text-input"]').at(0).prop('value')
        ).toEqual(foo);
        expect(
            wrapper
                .find('input[id="list-text-input"]')
                .at(numInputs)
                .prop('value')
        ).toEqual('');
    });

    test('removing list input', () => {
        const numInputs = wrapper.find('.remove-list-text').length;
        const foo = 'foo';
        let currInputs = numInputs;
        for (let i = 0; i < numInputs - 1; i++) {
            // add list text input value
            const newFoo = foo + i.toString();
            wrapper
                .find('input[id="list-text-input"]')
                .at(0)
                .simulate('change', {
                    target: { value: newFoo },
                });
            wrapper.update();
            expect(
                wrapper.find('input[id="list-text-input"]').at(0).prop('value')
            ).toEqual(newFoo);

            // remove list text
            wrapper.find('.remove-list-text').at(0).simulate('click');
            wrapper.update();
            expect(
                wrapper.find('input[id="list-text-input"]').at(0).prop('value')
            ).not.toEqual(newFoo);
            expect(wrapper.find('.remove-list-text').length).toEqual(
                currInputs - 1
            );
            currInputs = wrapper.find('.remove-list-text').length;
        }
        wrapper.find('.remove-list-text').simulate('click');
        wrapper.update();
        expect(wrapper.find('.remove-list-text').length).toEqual(0);
    });
});
