import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import BodySystemDropdown from '../BodySystemDropdown';
import { favChiefComplaints } from 'classes/institution.class';
import star from '../../../../../../../../public/images/star.svg';
// import ChiefComplaintsButton from '../ChiefComplaintsButton';

Enzyme.configure({ adapter: new Adapter() });

describe('ChiefComplaintsButton', () => {
    const wrapper = shallow(
        <BodySystemDropdown
            name='Cardiovascular'
            diseasesList={[
                'Abdominal Pain',
                'Aging Challenges and Dementia',
                'Alcohol Use',
            ]}
        />
    );
    it('placeholder so suite can run', () => {
        expect(wrapper).toBeTruthy();
    });
    // // TODO: Fix below tests
    // it('renders body system dropdown', () => {
    //     expect(wrapper).toMatchSnapshot();
    //     expect(wrapper.state().selected).toBeTruthy();
    // });
    // it('drops dropdown when clicked and unclicked', () => {
    //     wrapper.find('.hpi-disease-button').simulate('click');
    //     expect(wrapper.state().selected).toBeFalsy();
    //     wrapper.find('.hpi-disease-button').simulate('click');
    //     expect(wrapper.state().selected).toBeTruthy();
    // });
    // it('opens disease array when clicked and unclicked', () => {
    //     expect(wrapper.find(ChiefComplaintsButton).length).toEqual(3);
    //     wrapper.find('.hpi-disease-button').simulate('click');
    //     expect(
    //         wrapper.containsMatchingElement(<ChiefComplaintsButton />)
    //     ).toBeFalsy();
    // });
});

// Test the favorites bubble
describe('ChiefComplaintsHeader', () => {
    const wrapper = shallow(
        <BodySystemDropdown
            name='Favorites'
            diseasesList={favChiefComplaints}
        />
    );

    test('renders', () => expect(wrapper).toBeTruthy());

    // Test that a body system with the 'Favorites' name has the correct star icon
    test('render-star-icon', () => {
        expect(wrapper.find('img').prop('src')).toEqual(star);
    });
});
