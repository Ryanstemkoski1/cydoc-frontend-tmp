import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import ReviewOfSystemsCategory from '../ReviewOfSystemsCategory';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { initialStore } from '../utils';
import { ROS_ACTION } from 'redux/actions/actionTypes';
import { Button } from 'semantic-ui-react';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mockStore = configureStore([]);

const mountWithStore = (
    initStore = { reviewOfSystems: initialStore },
    props = { category: 'Eyes' }
) => {
    const store = mockStore(initStore);
    return {
        store,
        wrapper: mount(
            <Provider store={store}>
                <ReviewOfSystemsCategory {...props} />
            </Provider>
        ),
    };
};

describe('ReviewOfSystemsCategory', () => {
    it('renders without crashing', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const { wrapper } = mountWithStore();
        expect(wrapper.html()).toMatchSnapshot();
    });

    // // TODO: Fix below tests
    // it('renders Yes No buttons', () => {
    //     const { wrapper } = mountWithStore();
    //     const button = wrapper.find('button');
    //     expect(button).toHaveLength(6);
    // });

    it('handles change when YES is clicked', () => {
        const { store, wrapper } = mountWithStore();
        const button = wrapper
            .find(Button)
            .find(`[aria-label='yes-button']`)
            .first();

        expect(button).toBeTruthy();
        button.simulate('click', {
            target: { value: 'YES' },
        });
        const expectedAction = [
            {
                type: ROS_ACTION.TOGGLE_OPTION,
                payload: {
                    category: Object.keys(initialStore)[0],
                    option: 'Glasses',
                    yesOrNo: 'YES',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });

    it('handles change when NO is clicked', () => {
        const { store, wrapper } = mountWithStore();
        const button = wrapper
            .find(Button)
            .find(`[aria-label='no-button']`)
            .first();

        expect(button).toBeTruthy();
        button.simulate('click', {
            target: { value: 'NO' },
        });
        const expectedAction = [
            {
                type: ROS_ACTION.TOGGLE_OPTION,
                payload: {
                    category: Object.keys(initialStore)[0],
                    option: 'Glasses',
                    yesOrNo: 'NO',
                },
            },
        ];
        expect(store.getActions()).toEqual(expectedAction);
    });
});
