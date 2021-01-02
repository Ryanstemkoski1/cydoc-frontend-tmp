import React, { Component, Fragment } from 'react';
import { Form, Grid, Header, Segment, Message, Container, Image } from "semantic-ui-react";
import * as yup from "yup"
import { Redirect } from "react-router";
import AuthContext from "../../contexts/AuthContext";
import constants from "constants/registration-constants.json"
import LogoLight from "../../assets/logo-light.png";
import LogoName from "../../assets/logo-name.png";
import './UserForm.css';
import IdentityQuestions from '../../components/tools/IdentityQuestions';

const degreeOptions = constants.degrees.map((degree) => ({ key: degree, value: degree, text: degree }))
const specialtyOptions = constants.specialties.map((specialty) => ({ key: specialty, value: specialty, text: specialty }))
const workfeatOptions = constants.workplaceFeatures.map((workfeat) => ({ key: workfeat, value: workfeat, text: workfeat }))
const yasaSchema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup.string().required("password is required"),
    passwordConfirm: yup.string().oneOf([yup.ref('password'), null], "passwords must match"),
    email: yup.string().required("email is required").email("email must be valid"),
    backupEmail: yup.string().required("backup email is required").notOneOf([yup.ref('email')], "backup email must not be the same").email("backup email must be valid"),
    phoneNumber: yup.string().required("phone number is required").matches(/^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$/, "phone number must be valid"),
    firstName: yup.string().required("first name must not be blank"),
    lastName: yup.string().required("last name must not be blank"),
    role: yup.string().required("please specify your role"),
    studentStatus: yup.string().when('role', {is: 'healthcare professional', then: yup.string().required("please specify your student status"), otherwise: yup.string()}),
    workplace: yup.string().when('role', {is: 'healthcare professional', then: yup.string().required("workplace is required"), otherwise: yup.string()}),
    degreesCompleted: yup.array().of(yup.string()).test(
        'degreesCompleted-duplicates',
        'Cannot put same degree twice under degrees completed',
        arr => {
            return arr.filter((item, index) => {
                return item !== "" && arr.indexOf(item) != index
            }).length === 0
        }),
    degreesInProgress: yup.array().of(yup.string().notOneOf([yup.ref('$degreesCompleted[0]'), yup.ref('$degreesCompleted[1]'), yup.ref('$degreesCompleted[2]')], 'Same degree cannot be both completed and in progress')).test(
        'degreesInProgress-duplicates',
        'Cannot put same degree twice under degrees in progress',
        arr => {
            return arr.filter((item, index) => {
                return item !== "" && arr.indexOf(item) != index
            }).length === 0
        }),
    specialties: yup.array().test(
        'specialty-duplicates',
        'Cannot put same specialty twice',
        arr => {
            return arr.filter((item, index) => {
                return item !== "" && arr.indexOf(item) != index
            }).length === 0
        })
})


// component that manages the layout of the Register and EditProfile pages
class UserForm extends Component {

    static contextType = AuthContext

    // state gets initial values as props
    constructor(props) {
        super(props);
        this.state = {
            formInfo: {
                username: this.props.username,
                password: this.props.password,
                passwordConfirm: this.props.passwordConfirm,
                email: this.props.email,
                phoneNumber: this.props.phoneNumber,
                secondaryNumber: this.props.secondaryNumber,
                firstName: this.props.firstName,
                middleName: this.props.middleName,
                lastName: this.props.lastName,
                dob: this.props.dob,
                workplace: this.props.workplace,
                inPatient: this.props.inPatient,
                institutionType: this.props.institutionType,
                address: this.props.address,
                backupEmail: this.props.backupEmail,
                role: this.props.role,
                studentStatus: this.props.studentStatus,
                degreesCompleted: this.props.degreesCompleted,
                degreesInProgress: this.props.degreesInProgress,
                specialties: this.props.specialties,
                workplaceFeatures: this.props.workplaceFeatures
            },
            errorMessages: [],
            redirect: false,
            title: this.props.title,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleArrayChange = this.handleArrayChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // when user hits submit/save button, fields are validated
    // if error -- display error
    // if no error -- put/save user in database
    handleSubmit = () => {

        let user = this.state.formInfo

        yasaSchema.validate(user, { abortEarly: false }).then((v) => {
            this.props.handleSubmit(user)
                .then(res => {
                    const user = res.data;
                    console.log(JSON.stringify(user))
                    this.setState({ redirect: true })
                })
                .catch(err => {
                    console.log(err.response)
                })
        }).catch((v) => this.setState({ errorMessages: v.errors }))
    }

    // handles change in a single field (updates states based on changed info)
    handleChange(e, {name, value}) {
        let newState = this.state;
        newState.formInfo[name] = value;
        this.setState(newState);
    }

    // handles change for array-based fieldss (also updates state)
    handleArrayChange(e, {name, index, value}) {
        let newState = this.state;
        newState.formInfo[name][index] = value;
        this.setState(newState);
    }

    // helper function based on prop to determine if role field should be shown
    // basically if Register page -- show, if EditProfile page -- don't show
    showRole = () => {
        if (this.props.show) {
            return (
                <Fragment>
                    <label className='sign-up-font'>
                        I am a:
                    </label>
                    <Form.Group>
                        <Form.Radio 
                            className='sign-up-font'
                            label='patient'
                            value='patient'
                            name='role'
                            checked={this.state.formInfo.role === 'patient'}
                            onChange={this.handleChange}
                        />
                        <Form.Radio
                            className='sign-up-font'
                            label='healthcare professional'
                            value='healthcare professional'
                            name='role'
                            checked={this.state.formInfo.role === 'healthcare professional'}
                            onChange={this.handleChange}
                        />
                        <Form.Radio
                            className='sign-up-font'
                            label='administrator'
                            value='administrator'
                            name='role'
                            checked={this.state.formInfo.role === 'administrator'}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                </Fragment>
            )
        }
    }

    // show additional fields if user clicks on/is a healthcare professional
    // prompts user for more information 
    additionalFields = () => {
        if (this.state.formInfo.role === 'healthcare professional') {
            return (
                <Fragment>
                    <label className='sign-up-font'>student status</label>
                    <Form.Group>
                        <Form.Radio
                            className='sign-up-font'
                            label='student'
                            value='y'
                            name='studentStatus'
                            checked={this.state.formInfo.studentStatus === 'y'}
                            onChange={this.handleChange}
                        />
                        <Form.Radio
                            className='sign-up-font'
                            label='non-student'
                            value='n'
                            name='studentStatus'
                            checked={this.state.formInfo.studentStatus === 'n'}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <label className='sign-up-font'>degrees completed</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesCompleted[0]}
                            name='degreesCompleted'
                            index={0}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesCompleted[1]}
                            name='degreesCompleted'
                            index={1}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesCompleted[2]}
                            name='degreesCompleted'
                            index={2}
                            onChange={this.handleArrayChange}
                        />
                    </Form.Group>
                    <label className='sign-up-font'>degrees in progress</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesInProgress[0]}
                            name='degreesInProgress'
                            index={0}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesInProgress[1]}
                            name='degreesInProgress'
                            index={1}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={degreeOptions}
                            value={this.state.formInfo.degreesInProgress[2]}
                            name='degreesInProgress'
                            index={2}
                            onChange={this.handleArrayChange}
                        />
                    </Form.Group>
                    <label className='sign-up-font'>specialties</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={specialtyOptions}
                            value={this.state.formInfo.specialties[0]}
                            name='specialties'
                            index={0}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={specialtyOptions}
                            value={this.state.formInfo.specialties[1]}
                            name='specialties'
                            index={1}
                            onChange={this.handleArrayChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            options={specialtyOptions}
                            value={this.state.formInfo.specialties[2]}
                            name='specialties'
                            index={2}
                            onChange={this.handleArrayChange}
                        />
                    </Form.Group>
                    <Form.Input
                        fluid
                        label='workplace'
                        placeholder='workplace'
                        name='workplace'
                        value={this.state.formInfo.workplace}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Dropdown
                        label='workplace features'
                        selection
                        multiple
                        options={workfeatOptions}
                        value={this.state.formInfo.workplaceFeatures}
                        name='workplaceFeatures'
                        onChange={this.handleChange}
                    />
                </Fragment>
            )
        }
    }

    render() {
        // after submit redirect is set to true (if no errors) and user is redirected
        if (this.state.redirect) {
            return (<Redirect push to={this.props.pushTo}/>)
        }

        //renders a one-column grid centered in the middle of the screen with profile form
        return (
            <Container className="sign-up">
                <Container textAlign="center">
                    <Image size="tiny" spaced href='/home' src={LogoLight} />
                    <Image size="small" spaced href='/home' src={LogoName} />
                </Container>
                <Container>
                    <Segment clearing raised className='sign-up-segment'>
                        {this.props.disableRegister && 
                            <Container className='coming-soon' color='black' textAlign='center'>
                                coming soon
                            </Container>
                        }
                        <Container className={`sign-up-header ${this.props.disableRegister ? 'disabled' : ''}`} color='black' textAlign='center'>
                            {this.state.title}
                        </Container>
                        <Form size='small' error={this.state.errorMessages.length>0} onSubmit={this.handleSubmit}>
                            <Form.Input
                                fluid
                                label='Username'
                                placeholder='username'
                                name='username'
                                value={this.state.formInfo.username}
                                onChange={this.handleChange}
                                // disabled
                            />
                            <Form.Input
                                fluid
                                type={"password"}
                                label='Password'
                                placeholder='password'
                                name='password'
                                value={this.state.formInfo.password}
                                onChange={this.handleChange}
                                // disabled
                            />
                            <Form.Input
                                fluid
                                type={"password"}
                                label='Re-enter password'
                                placeholder='re-enter password'
                                name='passwordConfirm'
                                value={this.state.formInfo.passwordConfirm}
                                onChange={this.handleChange}
                                // disabled
                            />
                            <Form.Group>
                                <Form.Input
                                    fluid
                                    label='First name'
                                    placeholder='first name'
                                    name='firstName'
                                    value={this.state.formInfo.firstName}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                                <Form.Input
                                    fluid
                                    label='middle name'
                                    placeholder='middle name'
                                    name='middleName'
                                    value={this.state.formInfo.middleName}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Input
                                    fluid
                                    label='Last name'
                                    placeholder='last name'
                                    name='lastName'
                                    value={this.state.formInfo.lastName}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                                <Form.Input
                                    fluid
                                    label='Date of Birth'
                                    placeholder='Date of Birth'
                                    name='dob'
                                    value={this.state.formInfo.dob}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Input
                                    fluid
                                    placeholder='name@example.com'
                                    type='email'
                                    label='Email'
                                    name='email'
                                    value={this.state.formInfo.email}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                                <Form.Input
                                    fluid
                                    placeholder='name@example.com'
                                    type='email'
                                    label='Backup email'
                                    name='backupEmail'
                                    value={this.state.formInfo.backupEmail}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                            </Form.Group>
                            <Form.Group>
                                {/* <Form.Input
                                    fluid
                                    label='address'
                                    placeholder='address'
                                    name='address'
                                    value={this.state.formInfo.address}
                                    onChange={this.handleChange}
                                    disabled
                                /> */}
                                <Form.Input
                                    fluid
                                    width={6}
                                    type='tel'
                                    label='phone number'
                                    placeholder='phone number'
                                    name='phoneNumber'
                                    value={this.state.formInfo.phoneNumber}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                                <Form.Field 
                                    width={2} 
                                    className='mobile-checkbox' 
                                    label='Mobile' 
                                    control='input' 
                                    type='checkbox' 
                                    // disabled 
                                />

                                <Form.Input
                                    fluid
                                    width={6}
                                    type='tel'
                                    label='secondary phone number'
                                    placeholder='secondary phone number'
                                    name='phoneNumber'
                                    value={this.state.formInfo.secondaryNumber}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                                <Form.Field 
                                    width={2} 
                                    className='mobile-checkbox' 
                                    label='Mobile' 
                                    control='input' 
                                    type='checkbox' 
                                    // disabled 
                                />

                            </Form.Group>
                            <label className={`label-font ${this.props.disableRegister ? 'disabled' : ''}`}>
                                I am a:
                            </label>
                            <Form.Group>
                                <Form.Radio
                                    width={6}
                                    label='Healthcare Professional'
                                    value='healthcare professional'
                                    name='role'
                                    checked={this.state.formInfo.role === 'healthcare professional'}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                                <Form.Radio
                                    width={4}
                                    label='Patient'
                                    value='patient'
                                    name='role'
                                    checked={this.state.formInfo.role === 'patient'}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                                <Form.Radio
                                    width={7}
                                    label='Administrator'
                                    value='administrator'
                                    name='role'
                                    checked={this.state.formInfo.role === 'administrator'}
                                    onChange={this.handleChange}
                                    // disabled
                                />
                            </Form.Group>
                            {this.additionalFields()}
                            <Message
                                error
                                header='Error!'
                                content={this.state.errorMessages.map(m => <Message.Item>{m}</Message.Item>)}
                            />
                            <IdentityQuestions
                                race=''
                                asian={[]}
                                otherRace={[]}
                                ethnicity=''
                                otherEthnicity={[]}
                                gender=''
                            />
                            <>
                                <Form.Button color='teal' size='small' floated='right' disabled={this.props.disableRegister}>
                                    {this.props.buttonText}
                                </Form.Button>
                            </>
                        </Form>
                    </Segment>
                </Container>
            </Container>
        );
    }
}

export default UserForm;