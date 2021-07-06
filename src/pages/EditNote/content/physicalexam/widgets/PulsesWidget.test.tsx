import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialPhysicalExamState } from 'redux/reducers/physicalExamReducer';
import PulsesWidget from './PulsesWidget';
import { createCurrentNoteStore } from 'redux/store';
import { PULSES_WIDGET_ACTION } from 'redux/actions/actionTypes';
import PulsesWidgetItem from './PulsesWidgetItem';

const mockStore = configureStore([]);

const mountWithMockStore = (
    initStore = {
        physicalExam: {
            ...initialPhysicalExamState,
            widgets: {
                ...initialPhysicalExamState.widgets,
                pulses: {
                    yasa: {
                        location: '',
                        side: '',
                        intensity: -1,
                    },
                },
            },
        },
    },
    { ...props } = {}
) => {
    const store = mockStore(initStore);
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <PulsesWidget {...props} />
            </Provider>
        ),
    };
};

const mountWithRealStore = ({ ...props } = {}) => {
    return mount(
        <Provider store={createCurrentNoteStore()}>
            <PulsesWidget {...props} />
        </Provider>
    );
};

describe('PulsesWidget', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithMockStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = mountWithMockStore();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('PulsesWidget with mock store', () => {
    it('dispatches correct action when adding a PulsesWidgetItem', () => {
        const { store, wrapper } = mountWithMockStore();
        wrapper.find('Button[icon="plus"]').simulate('click');

        const expectedActions = [
            {
                type: PULSES_WIDGET_ACTION.ADD_PULSES_WIDGET_ITEM,
                payload: {},
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});

describe('PulsesWidget with real store', () => {
    it('Adds PulsesWidgetItem when plus button is clicked', () => {
        const wrapper = mountWithRealStore();
        expect(wrapper.find(PulsesWidgetItem)).toHaveLength(0);
        wrapper.find('Button[icon="plus"]').simulate('click');
        expect(wrapper.find(PulsesWidgetItem)).toHaveLength(1);
    });

    it('Removes PulsesWidgetItem when delete button is clicked', () => {
        const wrapper = mountWithRealStore();
        expect(wrapper.find(PulsesWidgetItem)).toHaveLength(0);
        wrapper.find('Button[icon="plus"]').simulate('click');
        expect(wrapper.find(PulsesWidgetItem)).toHaveLength(1);
        wrapper
            .find(PulsesWidgetItem)
            .find('Button[icon="x"]')
            .simulate('click');
        expect(wrapper.find(PulsesWidgetItem)).toHaveLength(0);
    });
});
