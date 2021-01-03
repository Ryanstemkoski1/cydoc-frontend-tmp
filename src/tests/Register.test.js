import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Register from '../pages/Account/Register';
import UserForm from '../pages/Account/UserForm';

Enzyme.configure({ adapter: new EnzymeAdapter() });

test('renders without crashing', () => {
    const wrapper = shallow(<Register />);
    expect(wrapper).toBeTruthy();
});

test('Register renders one UserForm component', () => {
    const wrapper = shallow(<Register />).find(UserForm);
    expect(wrapper).toHaveLength(1);
});

describe('testing props to UserForm are empty', () => {

    const emptyString = "";
    const stringArray = ["", "", ""];
    const emptyArray = [];
    const wrapper = shallow(<Register />).find(UserForm);

    test('empty strings to string-based props', () => {
        expect(wrapper.props().username).toEqual(emptyString);
        expect(wrapper.props().password).toEqual(emptyString);
        expect(wrapper.props().passwordConfirm).toEqual(emptyString);
        expect(wrapper.props().email).toEqual(emptyString);
        expect(wrapper.props().phoneNumber).toEqual(emptyString);
        expect(wrapper.props().firstName).toEqual(emptyString);
        expect(wrapper.props().lastName).toEqual(emptyString);
        expect(wrapper.props().workplace).toEqual(emptyString);
        expect(wrapper.props().institutionType).toEqual(emptyString);
        expect(wrapper.props().address).toEqual(emptyString);
        expect(wrapper.props().backupEmail).toEqual(emptyString);
        expect(wrapper.props().role).toEqual(emptyString);
        expect(wrapper.props().studentStatus).toEqual(emptyString);
    });

    test('default string array of length three to array-based props', () => {
        expect(wrapper.props().degreesCompleted).toEqual(stringArray);
        expect(wrapper.props().degreesInProgress).toEqual(stringArray);
        expect(wrapper.props().specialties).toEqual(stringArray);
    });

    test('empty array to workplaceFeatures prop', () => {
        expect(wrapper.props().workplaceFeatures).toEqual(emptyArray);
    });

    test('default null to inPatient prop', () => {
        expect(wrapper.props().inPatient).toEqual(null);
    });
});

describe('testing text-based props to UserForm', () => {

    const wrapper = shallow(<Register />).find(UserForm);

    test('title text', () => {
        expect(wrapper.props().title).toEqual("sign up");
    });

    test('button text', () => {
        expect(wrapper.props().buttonText).toEqual("Sign Up");
    });
});