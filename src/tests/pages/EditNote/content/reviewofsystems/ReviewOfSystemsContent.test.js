import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import ReviewOfSystemsContent from '../../../../../pages/EditNote/content/reviewofsystems/ReviewOfSystemsContent';
import ReviewOfSystemsCategory from 'pages/EditNote/content/reviewofsystems/ReviewOfSystemsCategory';
import { sections } from 'constants/review-of-systems-constants';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const setup = (context) => {
    return mount(
        <AuthContext.Provider value={context}>
            <EditProfile />
        </AuthContext.Provider>
    );
}

test('renders without crashing', () => {
    const wrapper = shallow(<ReviewOfSystemsContent/>);
    expect(wrapper).toBeTruthy();
});
/*
test('renders correct number of categories', () => {
    const wrapper = shallow(<ReviewOfSystemsContent/>).find(<ReviewOfSystemsCategory/>);
    expect(wrapper).toHaveLength(Object.keys(sections).length);
})
*/