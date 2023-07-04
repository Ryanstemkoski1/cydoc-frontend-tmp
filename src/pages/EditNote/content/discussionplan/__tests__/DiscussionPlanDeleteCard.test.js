import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import DiscussionPlanDeleteCard, {
    FILLER_NAME,
} from '../DiscussionPlanDeleteCard';
import configureStore from 'redux-mock-store';
import { conditionId, initialPlan } from '../util';
import { Provider } from 'react-redux';
import { PLAN_ACTION as TYPES } from 'redux/actions/actionTypes';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (discussionPlan = initialPlan, { ...props } = {}) => {
    const store = mockStore({ discussionPlan });

    props = {
        uuid: conditionId,
        name: '',
        index: 0,
        deleteCurrent: jest.fn(),
        ...props,
    };
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <DiscussionPlanDeleteCard {...props} />
            </Provider>
        ),
    };
};

describe('DiscussionPlanDeleteCard', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders the modal only on click', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.find('.ui.modals')).toHaveLength(0);

        wrapper.find('.icon.delete-btn').last().simulate('click');

        expect(wrapper.find('.ui.modals')).toHaveLength(1);
    });

    it('uses FILLER_NAME if name prop is empty', () => {
        const { wrapper } = mountWithStore();
        wrapper.find('.icon.delete-btn').last().simulate('click');

        expect(
            wrapper.find('.content').first().text().includes(FILLER_NAME)
        ).toBeTruthy();
    });

    it('uses the name prop if it is non-empty', () => {
        const name = 'foo';
        const { wrapper } = mountWithStore(undefined, { name });
        wrapper.find('.icon.delete-btn').last().simulate('click');

        expect(
            wrapper.find('.content').first().text().includes(name)
        ).toBeTruthy();
    });

    it('dispatches action with correct values on delete confirmation', () => {
        const mockDeleteCurrent = jest.fn();
        const { store, wrapper } = mountWithStore(undefined, {
            deleteCurrent: mockDeleteCurrent,
        });
        wrapper.find('.icon.delete-btn').last().simulate('click');
        wrapper.find('.right.button').simulate('click');

        const expectedActions = [
            {
                type: TYPES.DELETE_CONDITION,
                payload: {
                    conditionIndex: conditionId,
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
        expect(mockDeleteCurrent).toHaveBeenCalledWith(0);
    });
});
