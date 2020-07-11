import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import UserForm from '../pages/Account/UserForm';
import { Form } from "semantic-ui-react";

Enzyme.configure({ adapter: new EnzymeAdapter() });

// PLAN:
// 1. test handleSubmit for both Register onSubmit prop and EditProfile onSubmit prop
// 2. test handleChange to check that state is updating accordingly 
// 3. test handleArrayChange to check that state is updating accordingly for array-based inputs
// 4. test that errors appear when a user doesn't input a required field

const registerProps = {
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    workplace: "",
    inPatient: null,
    institutionType: "",
    address: "",
    backupEmail: "",
    role: "",
    studentStatus: "",
    degreesCompleted: ["", "", ""],
    degreesInProgress: ["", "", ""],
    specialties: ["", "", ""],
    workplaceFeatures: [],
    title: "sign up",
    buttonText: "Sign Up",
    handleSubmit: null,
    show: true,
    pushTo: "/login"
}

const setup = (props) => {
    return mount(<UserForm {...props} />);
}

test('renders without crashing using props for Register component', () => {
    const wrapper = setup(registerProps);
    expect(wrapper).toBeTruthy();
});