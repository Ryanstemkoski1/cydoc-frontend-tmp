import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import ReviewOfSystemsContent from '../ReviewOfSystemsContent';
import ReviewOfSystemsCategory from '../ReviewOfSystemsCategory';
import configureStore from 'redux-mock-store';
// import { ROS_LARGE_BP, ROS_MED_BP, ROS_SMALL_BP } from '../../../../../constants/breakpoints';
import { initialStore } from '../utils';
import { Provider } from 'react-redux';
// import Masonry from 'react-masonry-css';

Enzyme.configure({ adapter: new Adapter() });

const initialState = {
    patientView: true,
    doctorView: false,
    userSurvey: {},
};

const mockStore = configureStore([]);

const mountWithStore = (reviewOfSystems = initialStore) => {
    const store = mockStore({ reviewOfSystems, userView: initialState });
    return mount(
        <Provider store={store}>
            <ReviewOfSystemsContent />
        </Provider>
    );
};

describe('ReviewOfSystemsContent', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithStore();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const wrapper = mountWithStore();
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders the correct number of categories', () => {
        const wrapper = mountWithStore();
        expect(wrapper.find(ReviewOfSystemsCategory)).toHaveLength(
            Object.keys(initialStore).length
        );
    });

    it('renders the correct titles for the categories', () => {
        const wrapper = mountWithStore();
        for (let category of Object.keys(initialStore)) {
            const categoryWrapper = wrapper.find(
                `ReviewOfSystemsCategory[category='${category}']`
            );
            expect(categoryWrapper).toHaveLength(1);
        }
    });

    // // TODO: Fix below tests
    // it('adapts to screen resizing', () => {
    //     const wrapper = mountWithStore();
    //     expect(wrapper.find(Masonry)).toHaveLength(1);

    //     window.innerWidth = ROS_LARGE_BP + 1;
    //     window.dispatchEvent(new Event('resize'));
    //     wrapper.update();
    //     expect(wrapper.find(Masonry).prop('breakpointCols')).toBe(4);

    //     window.innerWidth = ROS_MED_BP + 1;
    //     window.dispatchEvent(new Event('resize'));
    //     wrapper.update();
    //     expect(wrapper.find(Masonry).prop('breakpointCols')).toBe(3);

    //     window.innerWidth = ROS_SMALL_BP + 1;
    //     window.dispatchEvent(new Event('resize'));
    //     wrapper.update();
    //     expect(wrapper.find(Masonry).prop('breakpointCols')).toBe(2);

    //     window.innerWidth = ROS_SMALL_BP;
    //     window.dispatchEvent(new Event('resize'));
    //     wrapper.update();
    //     expect(wrapper.find(Masonry).prop('breakpointCols')).toBe(1);
    // });
});
