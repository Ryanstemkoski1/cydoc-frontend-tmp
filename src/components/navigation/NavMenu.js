import React, { Component } from 'react';
import {
    Dropdown,
    Menu,
    Image,
    Icon,
    Button,
    Input,
    Modal,
    Form,
    Header,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    DEFAULT_NAV_MENU_MOBILE_BP,
    LOGGEDIN_NAV_MENU_MOBILE_BP,
} from 'constants/breakpoints.js';
import HPIContext from 'contexts/HPIContext.js';
import AuthContext from '../../contexts/AuthContext';
import Logo from '../../assets/cydoc-logo.svg';
import './NavMenu.css';

// Navigation Bar component that will go at the top of most pages
class ConnectedNavMenu extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        let windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    render() {
        const { windowWidth } = this.state;
        const collapseDefaultNav = windowWidth < DEFAULT_NAV_MENU_MOBILE_BP;
        const collapseLoggedInNav = windowWidth < LOGGEDIN_NAV_MENU_MOBILE_BP;

        // Menu items when not logged in
        const defaultMenuItems = collapseDefaultNav ? (
            <Menu.Item>
                <Dropdown icon='big bars' className='collapsed-dropdown'>
                    <Dropdown.Menu>
                        <Dropdown.Item
                            as={Link}
                            name='about'
                            to='/about'
                            text='About'
                        />
                        <Dropdown.Item
                            as={Link}
                            name='login'
                            to='/login'
                            text='Login'
                        />
                        <Dropdown.Item
                            as={Link}
                            name='register'
                            to='/register'
                            text='Sign Up'
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        ) : (
            <>
                <Menu.Item as={Link} name='about' to='/about' text='About' />
                <Menu.Item>
                    <Button.Group>
                        <Button
                            as={Link}
                            basic
                            color='teal'
                            name='login'
                            to='/login'
                            content='Login'
                        />
                        <Button
                            as={Link}
                            color='teal'
                            name='register'
                            to='/register'
                            content='Sign Up'
                        />
                    </Button.Group>
                </Menu.Item>
            </>
        );

        // Menu items when logged in
        const loggedInMenuItems = collapseLoggedInNav ? (
            <Menu.Item>
                <Button.Group>
                    <Button
                        as={Link}
                        name='myNotes'
                        to='/dashboard'
                        text='My Notes'
                    >
                        <Icon
                            name='sticky note outline'
                            className='collapsed-icon'
                        />
                    </Button>
                    <Button
                        name='logout'
                        href='/home'
                        text='Logout'
                        onClick={this.context.logOut}
                        className='logout-button'
                    >
                        <Icon
                            name='sign out alternate'
                            className='collapsed-icon'
                        />
                    </Button>
                </Button.Group>
            </Menu.Item>
        ) : (
            <>
                <Menu.Item>
                    <Button.Group>
                        <Button
                            as={Link}
                            name='myNotes'
                            to='/dashboard'
                            text='My Notes'
                            content='My Notes'
                        />
                        <Button
                            name='logout'
                            href='/home'
                            text='Logout'
                            onClick={this.context.logOut}
                            className='logout-button'
                            content='Log Out'
                        />
                    </Button.Group>
                </Menu.Item>
                <Menu.Item
                    name='welcome'
                    style={{ color: '#6DA3B1', fontWeight: 'normal' }}
                >
                    <Icon name='user outline' />
                    {this.context.user && this.context.user.firstName}
                </Menu.Item>
            </>
        );

        return (
            <div>
                <Menu
                    className={this.props.className + ' nav-menu'}
                    attached={this.props.attached}
                >
                    <Menu.Item>
                        {this.props.displayNoteName ? null : (
                            <Image
                                as={Link}
                                to='/home'
                                size='tiny'
                                src={Logo}
                            />
                        )}
                    </Menu.Item>

                    {/* When parent is EditNote, then display the note name item */}
                    {this.props.displayNoteName ? <NoteNameMenuItem /> : null}

                    {/* Navigation links */}
                    <Menu.Menu position='right'>
                        {/* Menu will have different options depending on whether the user is logged in or not */}
                        {this.context.token
                            ? loggedInMenuItems
                            : defaultMenuItems}
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

ConnectedNavMenu.propTypes = {
    className: PropTypes.string,
    // optional prop for stacking another menu above/below
    attached: PropTypes.string,
    // optional prop for whether to display or hide hte note name menu item
    displayNoteName: PropTypes.bool,
};

const NavMenu = ConnectedNavMenu;
export default NavMenu;

// class component that displays and changes note name
// shown only if parent is EditNote.
class NoteNameMenuItem extends Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            firstName: this.firstName,
            middleName: this.middleName,
            lastName: this.lastName,
            dob: this.dob,
            primaryEmail: this.primaryEmail,
            secondaryEmail: this.secondaryEmail,
            primaryPhone: this.primaryPhone,
            secondaryPhone: this.secondaryPhone,
            age: this.age,
            months: this.months,
            invalidFirstName: false,
            invalidLastName: false,
            invalidEmail: false,
            invalidPhone: false,
            invalidDate: false,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.savePatientInfo = this.savePatientInfo.bind(this);
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.setChange = this.setChange.bind(this);
    }

    handleInputChange = (event) => {
        this.setState({ textInput: event.target.value });
        this.context.onContextChange('title', event.target.value);
    };

    closeModal() {
        this.setState({ open: false });
    }

    openModal() {
        this.setState({ open: true });
    }

    savePatientInfo() {
        const {
            invalidDate,
            invalidEmail,
            invalidFirstName,
            invalidLastName,
            invalidPhone,
        } = this.state;
        if (
            invalidFirstName ||
            invalidLastName ||
            invalidEmail ||
            invalidPhone ||
            invalidDate
        ) {
            alert('Please make sure all the required fields are completed');
        } else {
            alert('Patient information is saved!');
            this.getAge(this.state.dob);
            this.closeModal();
        }
    }

    // validations
    onFirstNameChange = (e) => {
        if (!e.target.value) {
            this.setState({ invalidFirstName: true });
        } else {
            this.setState({ invalidFirstName: false });
        }
    };

    onLastNameChange = (e) => {
        if (!e.target.value) {
            this.setState({ invalidLastName: true });
        } else {
            this.setState({ invalidLastName: false });
        }
    };

    onPhoneChange = (e) => {
        const re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
        if (!e.target.value || !re.test(e.target.value)) {
            this.setState({ invalidPhone: true });
        } else {
            this.setState({ invalidPhone: false });
        }
    };

    onEmailChange = (e) => {
        const re = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[A-z]+\.[A-z]{3}.?[A-z]{0,3}$/g;
        if (!e.target.value || !re.test(e.target.value)) {
            this.setState({ invalidEmail: true });
        } else {
            this.setState({ invalidEmail: false });
        }
    };

    onDateChange = (e) => {
        const re = /^((0[1-9]|10|11|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9])|(3[01]))(-|\/)((19)([2-9])(\d{1})|(20)([012])(\d{1})|([8901])(\d{1})))$/gm;
        if (!e.target.value || !re.test(e.target.value)) {
            this.setState({ invalidDate: true });
        } else {
            this.setState({ invalidDate: false });
        }
    };

    setChange = (e, { id, value }) => {
        switch (id) {
            case 'first-name':
                this.setState({ firstName: value });
                break;
            case 'middle-name':
                this.setState({ middleName: value });
                break;
            case 'last-name':
                this.setState({ lastName: value });
                break;
            case 'primary-phone':
                this.setState({ primaryPhone: value });
                break;
            case 'secondary-phone':
                this.setState({ secondaryPhone: value });
                break;
            case 'primary-email':
                this.setState({ primaryEmail: value });
                break;
            case 'secondary-email':
                this.setState({ secondaryEmail: value });
                break;
            case 'dob':
                this.setState({ dob: value });
                break;
            default:
                break;
        }
    };

    getAge(dateString) {
        let now = new Date();
        let yearNow = now.getYear();
        let monthNow = now.getMonth();

        let dob = new Date(
            dateString.substring(6, 10),
            dateString.substring(0, 2) - 1,
            dateString.substring(3, 5)
        );

        let yearDob = dob.getYear();
        let monthDob = dob.getMonth();
        let age = {};

        let yearAge = yearNow - yearDob;
        let monthAge;

        if (monthNow >= monthDob) {
            monthAge = monthNow - monthDob;
        } else {
            yearAge--;
            monthAge = 12 + monthNow - monthDob;
        }

        age = {
            years: yearAge,
            months: monthAge,
        };

        this.setState({ age: age.years });
        this.setState({ months: age.months });
    }

    render() {
        const { open } = this.state;
        return (
            <Menu.Item className='note-name-menu-item'>
                <HPIContext.Consumer>
                    {() => (
                        <>
                            <Input
                                className='note-title'
                                size='huge'
                                transparent
                                placeholder='Untitled Note'
                                onChange={this.handleInputChange}
                                onFocus={() => {
                                    if (
                                        this.context.title === 'Untitled Note'
                                    ) {
                                        this.context.onContextChange(
                                            'title',
                                            ''
                                        );
                                    }
                                }}
                                onBlur={() => {
                                    this.setState({ isTitleFocused: false });
                                    if (this.context.title === '') {
                                        this.context.onContextChange(
                                            'title',
                                            'Untitled Note'
                                        );
                                    }
                                }}
                                value={this.context.title}
                            />
                            <Button
                                mini
                                onClick={this.context.saveNote}
                                className='save-button'
                            >
                                Save
                            </Button>
                        </>
                    )}
                </HPIContext.Consumer>
                <div className='patient-info'>
                    {this.state.age > 1 && this.state.age < 11 ? (
                        <h4>
                            Patient: {this.state.firstName}{' '}
                            {this.state.lastName}, {this.state.age} years and{' '}
                            {this.state.months} months old
                        </h4>
                    ) : (
                        ''
                    )}
                    {this.state.age >= 11 ? (
                        <h4>
                            Patient: {this.state.firstName}{' '}
                            {this.state.lastName}, {this.state.age} years old
                        </h4>
                    ) : (
                        ''
                    )}
                    {this.state.age === 0 ? (
                        <h4>
                            Patient: {this.state.firstName}{' '}
                            {this.state.lastName}, {this.state.months} months
                            old
                        </h4>
                    ) : (
                        ''
                    )}
                </div>
                <Modal
                    className='patient-modal'
                    onClose={this.closeModal}
                    onOpen={this.openModal}
                    open={open}
                    size='tiny'
                    dimmer='inverted'
                    trigger={
                        <Button className='patient-modal-button' tiny basic>
                            Add/Edit Patient Info
                        </Button>
                    }
                >
                    <Header>Patient Information</Header>
                    <Modal.Content>
                        <Form>
                            <div className='full-name'>
                                <Form.Field required>
                                    <label>First Name</label>
                                    <Input
                                        className='patient-info-input'
                                        id='first-name'
                                        fluid
                                        placeholder='First Name'
                                        type='text'
                                        value={this.state.firstName}
                                        onBlur={this.onFirstNameChange}
                                        onChange={this.setChange}
                                    />
                                </Form.Field>
                                {/* { this.state.invalidFirstName && (
                                <p className='error' id='first-name-error'>First name must not be blank</p>
                            )} */}
                                <Form.Field>
                                    <label>Middle Name</label>
                                    <Input
                                        className='patient-info-input'
                                        id='middle-name'
                                        fluid
                                        placeholder='Middle Name'
                                        type='text'
                                        value={this.state.middleName}
                                        // onBlur={this.onLastNameChange}
                                        onChange={this.setChange}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <label>Last Name</label>
                                    <Input
                                        className='patient-info-input'
                                        id='last-name'
                                        fluid
                                        placeholder='Last Name'
                                        type='text'
                                        value={this.state.lastName}
                                        onBlur={this.onLastNameChange}
                                        onChange={this.setChange}
                                    />
                                </Form.Field>
                                {/* { this.state.invalidLastName && (
                                <p className='error' id='last-name-error'>Last name must not be blank</p>
                            )} */}
                            </div>
                            <Form.Field required>
                                <label>Date Of Birth</label>
                                <Input
                                    className='patient-info-input'
                                    id='dob'
                                    placeholder='MM/DD/YYYY'
                                    type='text'
                                    value={this.state.dob}
                                    onBlur={this.onDateChange}
                                    onChange={this.setChange}
                                />
                            </Form.Field>
                            {this.state.invalidDate && (
                                <p className='error'>Date must be valid</p>
                            )}

                            <Form.Field required>
                                <label>Primary Email</label>
                                <Input
                                    className='patient-info-input'
                                    id='primary-email'
                                    placeholder='johndoe@email.com'
                                    type='text'
                                    value={this.state.primaryEmail}
                                    onBlur={this.onEmailChange}
                                    onChange={this.setChange}
                                />
                            </Form.Field>
                            {this.state.invalidEmail && (
                                <p className='error'>Email must be valid</p>
                            )}

                            <Form.Field>
                                <label>Secondary Email</label>
                                <Input
                                    className='patient-info-input'
                                    id='secondary-email'
                                    placeholder='johndoe@email.com'
                                    type='text'
                                    value={this.state.secondaryEmail}
                                    // onBlur={this.onEmailChange}
                                    onChange={this.setChange}
                                />
                            </Form.Field>

                            <Form.Field required>
                                <label>Primary Phone Number</label>
                                <Input
                                    className='patient-info-input'
                                    id='primary-phone'
                                    placeholder='000-000-0000'
                                    type='text'
                                    value={this.state.primaryPhone}
                                    onBlur={this.onPhoneChange}
                                    onChange={this.setChange}
                                />
                            </Form.Field>
                            {this.state.invalidPhone && (
                                <p className='error'>
                                    Phone number must be valid
                                </p>
                            )}

                            <Form.Field>
                                <label>Secondary Phone Number</label>
                                <Input
                                    className='patient-info-input'
                                    id='secondary-phone'
                                    placeholder='000-000-0000'
                                    type='text'
                                    value={this.state.secondaryPhone}
                                    // onBlur={this.onPhoneChange}
                                    onChange={this.setChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color='blue'
                            type='submit'
                            onClick={this.savePatientInfo}
                        >
                            Save
                        </Button>
                        <Button color='black' onClick={this.closeModal}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Menu.Item>
        );
    }
}
