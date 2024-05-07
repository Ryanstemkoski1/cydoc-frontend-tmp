import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialPhysicalExamState } from '@redux/reducers/physicalExamReducer';
import ReflexesWidget from './ReflexesWidget';
import { makeStore } from '@redux/store';
import { REFLEXES_WIDGET_ACTION } from '@redux/actions/actionTypes';
import ReflexesWidgetItem from './ReflexesWidgetItem';

const mockStore = configureStore([]);

const mountWithMockStore = (
    initStore = {
        physicalExam: {
            ...initialPhysicalExamState,
            widgets: {
                ...initialPhysicalExamState.widgets,
                reflexes: {
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
                <ReflexesWidget {...props} />
            </Provider>
        ),
    };
};

const mountWithRealStore = ({ ...props } = {}) => {
    return mount(
        <Provider store={makeStore()}>
            <ReflexesWidget {...props} />
        </Provider>
    );
};

describe('ReflexesWidget', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithMockStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = mountWithMockStore();
        expect(wrapper).toMatchSnapshot();
    });
});

describe('ReflexesWidget with mock store', () => {
    it('dispatches correct action when adding a ReflexesWidgetItem', () => {
        const { store, wrapper } = mountWithMockStore();
        wrapper.find('Button[icon="plus"]').simulate('click');

        const expectedActions = [
            {
                type: REFLEXES_WIDGET_ACTION.ADD_REFLEXES_WIDGET_ITEM,
                payload: {},
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});

describe('ReflexesWidget with real store', () => {
    it('Adds ReflexesWidgetItem when plus button is clicked', () => {
        const wrapper = mountWithRealStore();
        expect(wrapper.find(ReflexesWidgetItem)).toHaveLength(0);
        wrapper.find('Button[icon="plus"]').simulate('click');
        expect(wrapper.find(ReflexesWidgetItem)).toHaveLength(1);
    });

    it('Removes ReflexesWidgetItem when delete button is clicked', () => {
        const wrapper = mountWithRealStore();
        expect(wrapper.find(ReflexesWidgetItem)).toHaveLength(0);
        wrapper.find('Button[icon="plus"]').simulate('click');
        expect(wrapper.find(ReflexesWidgetItem)).toHaveLength(1);
        wrapper
            .find(ReflexesWidgetItem)
            .find('Button[icon="x"]')
            .simulate('click');
        expect(wrapper.find(ReflexesWidgetItem)).toHaveLength(0);
    });
});
