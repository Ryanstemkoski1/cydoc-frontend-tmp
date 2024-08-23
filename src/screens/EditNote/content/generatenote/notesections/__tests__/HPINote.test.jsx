import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HPINote from '../HPINote';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (
    hpi = {
        graph: {},
        nodes: {},
        edges: {},
        order: {},
        miscNotes: {},
    }
) => {
    const store = mockStore({
        hpi,
        surgicalHistory: {
            hasSurgicalHistory: null,
            elements: {},
        },
    });
    const text = 'No history of present illness reported';
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <HPINote text={text} />
            </Provider>
        ),
    };
};

describe('HPINote with empty notes', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('handles empty hpi', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.html()).toContain(
            'No history of present illness reported'
        );
    });
});
