import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import DiscussionPlanMenu from '../DiscussionPlanMenu';
import DiscussionPlanDeleteCard from '../DiscussionPlanDeleteCard';
import configureStore from 'redux-mock-store';
import { initialPlan, conditionId } from '../util';
import { Provider } from 'react-redux';
import { PLAN_ACTION as TYPES } from 'redux/actions/actionTypes';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (discussionPlan = initialPlan, { ...props } = {}) => {
    const store = mockStore({ discussionPlan });

    props = {
        index: 0,
        setCurrentId: jest.fn(),
        setCurrentIndex: jest.fn(),
        ...props,
    };
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <DiscussionPlanMenu {...props} />
            </Provider>
        ),
    };
};

describe('DiscussionPlanMenu', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render delete button if condition length is greater than 0', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.find(DiscussionPlanDeleteCard)).toHaveLength(1);
    });

    it('should not render delete button if condition length is 0', () => {
        const { wrapper } = mountWithStore({
            conditions: {},
            survey: initialPlan.survey,
        });
        expect(wrapper.find(DiscussionPlanDeleteCard)).toHaveLength(0);
    });

    it('dispatches correct action and functions when new condition is added', () => {
        const mockSetCurrentId = jest.fn();
        const mockSetCurrentIndex = jest.fn();
        const { store, wrapper } = mountWithStore(undefined, {
            setCurrentId: mockSetCurrentId,
            setCurrentIndex: mockSetCurrentIndex,
        });
        wrapper.find('#add-condition').last().simulate('click');
        expect(mockSetCurrentId).toHaveBeenCalled();
        expect(mockSetCurrentIndex).toHaveBeenCalled();

        const expectedActions = [{ type: TYPES.ADD_CONDITION }];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('calls setCurrentIndex and setCurrentId when different tab selected', () => {
        const mockSetCurrentId = jest.fn();
        const mockSetCurrentIndex = jest.fn();
        const { wrapper } = mountWithStore(
            {
                ...initialPlan,
                conditions: {
                    ...initialPlan.conditions,
                    1: { ...initialPlan.conditions[conditionId] },
                },
            },
            {
                setCurrentId: mockSetCurrentId,
                setCurrentIndex: mockSetCurrentIndex,
            }
        );
        wrapper.find('a[uuid="1"]').simulate('click');
        expect(mockSetCurrentId).toHaveBeenCalled();
        expect(mockSetCurrentIndex).toHaveBeenCalled();
    });

    it('dispatches action with correct values on input change', () => {
        const { store, wrapper } = mountWithStore();
        const value = 'foo';
        wrapper.find('input[type="text"]').simulate('change', {
            target: { value },
        });

        const expectedActions = [
            {
                type: TYPES.UPDATE_CONDITION_NAME,
                payload: { newName: value, conditionIndex: conditionId },
            },
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });
});
