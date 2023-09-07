import Adapter from '@cfaester/enzyme-adapter-react-18';
import Enzyme, { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ReviewOfSystemsCategory from '../ReviewOfSystemsCategory';
import { initialStore } from '../utils';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const mountWithStore = (
    initStore = { reviewOfSystems: initialStore },
    props = { category: 'Eyes', selectManyOptions: [], selectManyState: {} }
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

    // it('handles change when YES is clicked', () => {
    //     const { store, wrapper } = mountWithStore();
    //     const button = wrapper
    //         .find(Button)
    //         .find(`[aria-label='yes-button']`)
    //         .first();

    //     expect(button).toBeTruthy();
    //     button.simulate('click', {
    //         target: { value: 'YES' },
    //     });
    //     const expectedAction = [
    //         {
    //             type: ROS_ACTION.TOGGLE_OPTION,
    //             payload: {
    //                 category: Object.keys(initialStore)[0],
    //                 option: 'Glasses',
    //                 yesOrNo: 'YES',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });

    // it('handles change when NO is clicked', () => {
    //     const { store, wrapper } = mountWithStore();
    //     const button = wrapper
    //         .find(Button)
    //         .find(`[aria-label='no-button']`)
    //         .first();

    //     expect(button).toBeTruthy();
    //     button.simulate('click', {
    //         target: { value: 'NO' },
    //     });
    //     const expectedAction = [
    //         {
    //             type: ROS_ACTION.TOGGLE_OPTION,
    //             payload: {
    //                 category: Object.keys(initialStore)[0],
    //                 option: 'Glasses',
    //                 yesOrNo: 'NO',
    //             },
    //         },
    //     ];
    //     expect(store.getActions()).toEqual(expectedAction);
    // });
});
