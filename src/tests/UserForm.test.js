import React from 'react';
import Enzyme, {
    // shallow,
    mount,
} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import UserForm from '../pages/Account/UserForm';
// import { Form } from 'semantic-ui-react';

Enzyme.configure({ adapter: new EnzymeAdapter() });

// PLAN:
// 1. test handleSubmit for both Register onSubmit prop and EditProfile onSubmit prop
// 2. test handleChange to check that state is updating accordingly -- DONE
// 3. test handleArrayChange to check that state is updating accordingly for array-based inputs -- DONE
// 4. test that errors appear when a user doesn't input a required field

const registerProps = {
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    workplace: '',
    inPatient: null,
    institutionType: '',
    address: '',
    backupEmail: '',
    role: '',
    studentStatus: '',
    degreesCompleted: ['', '', ''],
    degreesInProgress: ['', '', ''],
    specialties: ['', '', ''],
    workplaceFeatures: [],
    title: 'sign up',
    buttonText: 'Sign Up',
    handleSubmit: null,
    show: true,
    pushTo: '/login',
};

const editProps = {
    username: 'yasab',
    password: 'basay',
    passwordConfirm: '',
    email: 'yasa@b.aig',
    phoneNumber: '1234567890',
    firstName: 'Yasab',
    lastName: 'Aig',
    workplace: 'Duck',
    inPatient: null,
    institutionType: 'Yasa',
    address: 'Yasa',
    backupEmail: 'yasab27@gmail.com',
    role: 'doctor',
    studentStatus: '',
    degreesCompleted: ['', '', ''],
    degreesInProgress: ['', '', ''],
    specialties: ['', '', ''],
    workplaceFeatures: [],
    title: 'edit proflie',
    buttonText: 'Submit',
    handleSubmit: null,
    show: true,
    pushTo: '/dashboard',
};

const setup = (props) => {
    return mount(<UserForm {...props} />);
};

describe('testing UserForm using default props for Register component', () => {
    const wrapper = setup(registerProps);

    test('renders without crashing', () => {
        expect(wrapper).toBeTruthy();
    });

    // // TODO: Fix below tests
    // // only 9 Form.Input divs before role === 'heathcare professional', i.e. check for 10 after update
    // test('additional fields appear when role is healthcare professional', () => {
    //     const input = wrapper.find(Form.Radio).at(0);
    //     input.props().onChange('test', {
    //         name: 'role',
    //         value: 'doctor',
    //     });
    //     wrapper.update();
    //     expect(wrapper.find(Form.Input)).toHaveLength(10);
    // });

    // test('handleChange updates state when form value changes for text-based elements', () => {
    //     const wrapper = shallow(<UserForm {...registerProps} />);
    //     const input = wrapper.find(Form.Input).at(0);
    //     input.props().onChange('test', { name: 'username', value: 'usertest' });
    //     wrapper.update();
    //     expect(wrapper.find(Form.Input).at(0).props().value).toEqual(
    //         'usertest'
    //     );
    // });
});

describe('testing UserForm using custom props for EditProfile component', () => {
    const wrapper = setup(editProps);
    // const formInputs = wrapper.find(Form.Input);

    test('renders without crashing', () => {
        expect(wrapper).toBeTruthy();
    });

    // // TODO: Fix below tests
    // test('values of input fields match props', () => {
    //     expect(formInputs.at(0).prop('value')).toEqual(editProps.username);
    //     expect(formInputs.at(1).prop('value')).toEqual(editProps.password);
    //     expect(formInputs.at(2).prop('value')).toEqual(
    //         editProps.passwordConfirm
    //     );
    //     expect(formInputs.at(3).prop('value')).toEqual(editProps.firstName);
    //     expect(formInputs.at(4).prop('value')).toEqual(editProps.lastName);
    //     expect(formInputs.at(5).prop('value')).toEqual(editProps.email);
    //     expect(formInputs.at(6).prop('value')).toEqual(editProps.backupEmail);
    //     expect(formInputs.at(7).prop('value')).toEqual(editProps.address);
    //     expect(formInputs.at(8).prop('value')).toEqual(editProps.phoneNumber);
    // });

    // // placing this test here because handleArrayChange only used for additional fields
    // // additionalFields only called when role === healthcare professional (like it is for editProps)
    // test('handleArrayChange updates state when form value changes for array-based elements', () => {
    //     const wrapper = shallow(<UserForm {...editProps} />);
    //     const input = wrapper.find(Form.Dropdown).at(0);
    //     input.props().onChange('test', {
    //         name: 'degreesCompleted',
    //         index: 0,
    //         value: 'usertest',
    //     });
    //     wrapper.update();
    //     expect(wrapper.find(Form.Dropdown).at(0).props().value).toEqual(
    //         'usertest'
    //     );
    // });
});
