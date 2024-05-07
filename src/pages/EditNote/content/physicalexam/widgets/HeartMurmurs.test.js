import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialPhysicalExamState } from '@redux/reducers/physicalExamReducer';
import HeartMurmurs from './HeartMurmurs';
import { makeStore } from '@redux/store';
import { MURMURS_WIDGET_ACTION } from '@redux/actions/actionTypes';
import HeartMurmursItem from './HeartMurmursItem';

const mockStore = configureStore([]);

const mountWithMockStore = (
    initStore = {
        physicalExam: {
            ...initialPhysicalExamState,
            widgets: {
                ...initialPhysicalExamState.widgets,
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
                <HeartMurmurs {...props} />
            </Provider>
        ),
    };
};

const mountWithRealStore = ({ ...props } = {}) => {
    return mount(
        <Provider store={makeStore()}>
            <HeartMurmurs {...props} />
        </Provider>
    );
};

describe('HeartMurmurs', () => {
    test('renders', () => {
        const { wrapper } = mountWithMockStore();
        expect(wrapper).toBeTruthy();
    });

    test('add button redux', () => {
        const { wrapper, store } = mountWithMockStore();
        expect(wrapper.find(HeartMurmursItem)).toHaveLength(0);
        wrapper.find('button').simulate('click');
        const expectedAction = [
            {
                type: MURMURS_WIDGET_ACTION.ADD_MURMURS_WIDGET_ITEM,
                payload: {},
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });
    test('add button', () => {
        const wrapper = mountWithRealStore();
        expect(wrapper.find(HeartMurmursItem)).toHaveLength(0);
        wrapper.find('button').simulate('click');
        expect(wrapper.find(HeartMurmursItem)).toHaveLength(1);
    });
});
