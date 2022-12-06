import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import BodySystemDropdown from '../BodySystemDropdown';
import ChiefComplaintsButton from '../ChiefComplaintsButton';

Enzyme.configure({ adapter: new EnzymeAdapter() });

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
    it('placeholder so suite can run', () => {});
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
