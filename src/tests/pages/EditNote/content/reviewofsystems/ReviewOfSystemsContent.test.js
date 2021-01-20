import React from 'react';
import Enzyme, { mount, render } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Masonry from 'react-masonry-css';

import HPIContext from 'contexts/HPIContext';
import ReviewOfSystemsContent from '../../../../../pages/EditNote/content/reviewofsystems/ReviewOfSystemsContent';
import ReviewOfSystemsCategory from 'pages/EditNote/content/reviewofsystems/ReviewOfSystemsCategory';
import { sections } from 'constants/review-of-systems-constants';
import { noteBody } from 'constants/noteBody.js';
import { ROS_LARGE_BP, ROS_MED_BP, ROS_SMALL_BP } from 'constants/breakpoints';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const mountWithContext = () => {
    return mount(
        <HPIContext.Provider value={{ ...noteBody }}>
            <ReviewOfSystemsContent />
        </HPIContext.Provider>
    );
};

const renderWithContext = () => {
    return render(
        <HPIContext.Provider value={{ ...noteBody }}>
            <ReviewOfSystemsContent />
        </HPIContext.Provider>
    );
};

describe('ReviewOfSystemsContent', () => {
    it('renders without crashing', () => {
        const wrapper = mountWithContext();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const tree = renderWithContext();
        expect(tree.html()).toMatchSnapshot();
    });

    it('renders correct number of categories with correct titles', () => {
        const wrapper = mountWithContext();
        expect(wrapper.find(ReviewOfSystemsCategory)).toHaveLength(
            Object.keys(sections).length
        );
        for (let category of Object.keys(sections)) {
            const categoryWrapper = wrapper.find(
                `ReviewOfSystemsCategory[category='${category}']`
            );
            expect(categoryWrapper).toHaveLength(1);
        }
    });

    it('correctly adapts to screen resizing', () => {
        const wrapper = mountWithContext();
        expect(wrapper.find(Masonry)).toHaveLength(1);

        window.innerWidth = ROS_LARGE_BP + 1;
        window.dispatchEvent(new Event('resize'));
        wrapper.update();
        expect(wrapper.find(Masonry).prop('breakpointCols')).toBe(4);

        window.innerWidth = ROS_MED_BP + 1;
        window.dispatchEvent(new Event('resize'));
        wrapper.update();
        expect(wrapper.find(Masonry).prop('breakpointCols')).toBe(3);

        window.innerWidth = ROS_SMALL_BP + 1;
        window.dispatchEvent(new Event('resize'));
        wrapper.update();
        expect(wrapper.find(Masonry).prop('breakpointCols')).toBe(2);

        window.innerWidth = ROS_SMALL_BP;
        window.dispatchEvent(new Event('resize'));
        wrapper.update();
        expect(wrapper.find(Masonry).prop('breakpointCols')).toBe(1);
    });
});
