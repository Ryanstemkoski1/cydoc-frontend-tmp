import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

import HPIContext, { HPIStore } from 'contexts/HPIContext';
import ReviewOfSystemsCategory from 'pages/EditNote/content/reviewofsystems/ReviewOfSystemsCategory';
import { noteBody } from 'constants/noteBody.js';
import { sections } from 'constants/review-of-systems-constants';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const dummyCategory = Object.keys(sections)[0];
const dummyOptions = sections[dummyCategory];
const mountWithContext = () => {
    return mount(
        <HPIContext.Provider value={{ ...noteBody }}>
            <ReviewOfSystemsCategory category={dummyCategory} options={dummyOptions} />)
        </HPIContext.Provider>
    );
}

const renderWithContext = () => {
    return render(
        <HPIContext.Provider value={{ ...noteBody }}>
            <ReviewOfSystemsCategory category={dummyCategory} options={dummyOptions} />)
        </HPIContext.Provider>
    );
}


//TODO: Refactor to have independent state from context in order to test button color
describe('ReviewOfSystemsCategory', () => {

    it('renders without crashing', () => {
        const wrapper = mountWithContext();
        expect(wrapper).toBeTruthy();
    });

    it('matches snapshot', () => {
        const tree = renderWithContext();
        expect(tree.html()).toMatchSnapshot();
    })

    it('calls handleChange when YES button is clicked', () => {
        const wrapper = mountWithContext();
        const categoryWrapper = wrapper.find(ReviewOfSystemsCategory);
        const mockHandleChange = jest.fn();
        categoryWrapper.instance().handleChange = mockHandleChange;
        const buttonWrapper = wrapper.find('Button[value="y"]').at(0);
        buttonWrapper.simulate('click');
        expect(mockHandleChange).toBeCalledWith(dummyOptions[0],'y');
    });

    it('calls handleChange when NO button is clicked', () => {
        const wrapper = mountWithContext();
        const categoryWrapper = wrapper.find(ReviewOfSystemsCategory);
        const mockHandleChange = jest.fn();
        categoryWrapper.instance().handleChange = mockHandleChange;
        const buttonWrapper = wrapper.find('Button[value="n"]').at(0);
        buttonWrapper.simulate('click');
        expect(mockHandleChange).toBeCalledWith(dummyOptions[0],'n');
    });
    
});




