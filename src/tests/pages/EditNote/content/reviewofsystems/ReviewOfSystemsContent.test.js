import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { HPIStore } from 'contexts/HPIContext';
import ReviewOfSystemsContent from '../../../../../pages/EditNote/content/reviewofsystems/ReviewOfSystemsContent';
import ReviewOfSystemsCategory from 'pages/EditNote/content/reviewofsystems/ReviewOfSystemsCategory';
import { sections } from 'constants/review-of-systems-constants';

Enzyme.configure({ adapter: new EnzymeAdapter() });

//TODO: Refactor components to have independent state from context
const mountWithContext = () => {
    return mount(
        <HPIStore>
            <ReviewOfSystemsContent />
        </HPIStore>
    );
}

test('renders without crashing', () => {
    const wrapper = mountWithContext();
    expect(wrapper).toBeTruthy();
});

test('renders correct number of categories', () => {
    const wrapper = mountWithContext().find(ReviewOfSystemsCategory);
    expect(wrapper).toHaveLength(Object.keys(sections).length);
})
