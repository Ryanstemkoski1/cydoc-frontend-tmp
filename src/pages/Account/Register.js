import React, { Component, Fragment } from 'react';
import {Form, Grid, Header, Segment, Message, Container, Image, Label} from "semantic-ui-react";
import * as yup from "yup"
import { Redirect } from "react-router";
import AuthContext from "../../contexts/AuthContext";
import constants from "constants/registration-constants.json"
import { client } from "constants/api.js"
import "./Account.css"
import LogoLight from "../../assets/logo-light.png";
import LogoName from "../../assets/logo-name.png";


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


//Component that manages the layout of the login page
export default class Register extends Component {

    static contextType = AuthContext

    constructor(props) {
        super(props);
        this.state = {
            formInfo: {
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
                workplaceFeatures: []
            },
            errorMessages: [],
            redirect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleArrayChange = this.handleArrayChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e, { name, value }) {
        let newState = this.state;
        newState.formInfo[name] = value;

        this.setState(newState);
    }

    handleArrayChange(e, { name, index, value }) {
        let newState = this.state;
        newState.formInfo[name][index] = value;

        this.setState(newState);
    }

    handleSubmit = () => {

        let user = this.state.formInfo

        yasaSchema.validate(user, { abortEarly: false }).then((v) => {
            this.setState({ errorMessages: [] })
            client.post("/user/new", user)
                .then(res => {
                    const user = res.data;
                    console.log(JSON.stringify(user))
                    this.setState({ redirect: true })
                })
                .catch(err => {
                    console.log(err.response)
                })
        })
            .catch((v) => this.setState({ errorMessages: v.errors }))
    }


    additionalFields = () => {
        if (this.state.formInfo.role === 'healthcare professional') {
            return (
                <Fragment>
                    <label style={{color: '#262626', fontSize: '14px'}} >Are you a student?</label>
                    <Form.Group>
                        <Form.Radio
                            width={2}
                                    label='Yes'
                                    value='y'
                                    name='studentStatus'
                                    checked={this.state.formInfo.studentStatus === 'y'}
                                    onChange={this.handleChange}
                        />
                        <Form.Radio
                            width={2}
                                    label='No'
                                    value='n'
                                    name='studentStatus'
                                    checked={this.state.formInfo.studentStatus === 'n'}
                                    onChange={this.handleChange}
                        />
                    </Form.Group>
                    <label style={{color: '#262626', fontSize: '14px'}} >Degrees completed</label>
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
                    <label style={{color: '#262626', fontSize: '14px'}} >Degrees in progress</label>
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
                    <label style={{color: '#262626', fontSize: '14px'}} >Specialties</label>
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
                        label='Workplace'
                        name='workplace'
                        value={this.state.formInfo.workplace}
                        onChange={this.handleChange}
                        required
                    />
                    <Form.Dropdown
                        label='Industry'
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
        else {
            return (
                null
            )
        }
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect push to="/login" />)
        }

        const { username, password } = this.state;
        return (
            //renders a one-column grid centered in the middle of the screen with login form
            <Container className="sign-up">
                <Container textAlign="center">
                    <Image size="tiny" spaced href='/home' src={LogoLight} />
                    <Image size="small" spaced href='/home' src={LogoName} />
                </Container>
                <Container>

                    <Segment clearing raised style={{ borderColor: "white" }}>
                        <Container className="sign-up-header" color='black' textAlign='center'>
                            Sign Up
                        </Container>
                        <Form size='small' error={this.state.errorMessages.length>0} onSubmit={this.handleSubmit}>
                            <Form.Input

                                fluid
                                label='Username'
                                name='username'
                                value={this.state.formInfo.username}
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                type={"password"}
                                label='Password'
                                name='password'
                                value={this.state.formInfo.password}
                                onChange={this.handleChange}
                            />
                            <Form.Input
                                fluid
                                type={"password"}
                                label='Re-enter password'
                                name='passwordConfirm'
                                value={this.state.formInfo.passwordConfirm}
                                onChange={this.handleChange}
                            />
                            <Form.Group>
                                <Form.Input
                                    fluid
                                    placeholder='John'
                                    label='First name'
                                    name='firstName'
                                    value={this.state.formInfo.firstName}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    placeholder='Doe'
                                    label='Last name'
                                    name='lastName'

                                    value={this.state.formInfo.lastName}
                                    onChange={this.handleChange}
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
                                />
                                <Form.Input
                                    fluid
                                    placeholder='name@example.com'
                                    type='email'
                                    label='Backup email'
                                    name='backupEmail'
                                    value={this.state.formInfo.backupEmail}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Input
                                    fluid
                                    label='address'
                                    name='address'
                                    value={this.state.formInfo.address}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid
                                    width={6}
                                    type='tel'
                                    label='phone number'
                                    name='phoneNumber'
                                    value={this.state.formInfo.phoneNumber}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <label style={{color: '#262626', fontSize: '14px'}} >
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
                                />
                                <Form.Radio
                                    width={4}
                                    label='Patient'
                                    value='patient'
                                    name='role'
                                    checked={this.state.formInfo.role === 'patient'}
                                    onChange={this.handleChange}
                                />

                                <Form.Radio
                                    width={7}
                                    label='Administrator'
                                    value='administrator'
                                    name='role'
                                    checked={this.state.formInfo.role === 'administrator'}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            {this.additionalFields()}
                            <Message
                                error
                                header='Error!'
                                content={this.state.errorMessages.map(m => <Message.Item>{m}</Message.Item>)}
                            />
                            <>
                                <Form.Button color='teal' size='small' floated='right'>
                                    Sign Up
                                </Form.Button>
                            </>

                        </Form>

                    </Segment>
                </Container>
            </Container>
        );
    }
}
