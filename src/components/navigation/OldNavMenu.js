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
    HIDE_CYDOC_IN_NAV_MENU_BP,
    LOGGEDIN_NAV_MENU_MOBILE_BP,
    NOTE_PAGE_MOBILE_BP,
} from 'constants/breakpoints.js';
import HPIContext from 'contexts/HPIContext.js';
import AuthContext from '../../contexts/AuthContext';
import Logo from '../../assets/cydoc-logo.svg';
import './OldNavMenu.css';
import states from 'constants/stateAbbreviations.json';
import DemographicsForm from '../tools/DemographicsForm';
import signout from '../../auth/signout.js';

const stateOptions = states.map((state) => ({
    key: state,
    value: state,
    text: state,
}));

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

    localSignout = () => {
        signout(this.context.role);
        this.context.logOut();
    };

    render() {
        const { windowWidth } = this.state;
        const collapseLoggedInNav = windowWidth < LOGGEDIN_NAV_MENU_MOBILE_BP;
        const hideCydoc = windowWidth < HIDE_CYDOC_IN_NAV_MENU_BP;
        const pathEqual = window.location.pathname === '/editnote';

        const dropdownOptions = [
            {
                as: Link,
                to: '/editprofile',
                key: 'editProfile',
                text: 'Edit Profile',
                icon: 'setting',
                selected: false,
                active: window.location.href.includes('editprofile'),
            },
            {
                as: Link,
                to: '/profilesecurity',
                key: 'profileSecurity',
                text: 'Profile Security',
                icon: 'lock',
                selected: false,
                active: window.location.href.includes('profilesecurity'),
            },
            {
                as: Link,
                to: '/',
                key: 'logout',
                text: 'Log Out',
                icon: 'sign out',
                onClick: this.localSignout,
                //onClick: this.context.logOut,
                selected: false,
                active: false,
            },
        ];

        // Menu items when not logged in
        const defaultMenuItems = (
            <Menu.Item>
                <Button
                    as={Link}
                    color='teal'
                    name='login'
                    to='/login'
                    content='Login'
                />
            </Menu.Item>
        );

        // Menu items when logged in
        const loggedInMenuItems = collapseLoggedInNav ? (
            <>
                <Menu.Item
                    style={{
                        width: pathEqual ? '0px' : '',
                        height: pathEqual ? '20px' : '',
                        marginTop:
                            windowWidth < NOTE_PAGE_MOBILE_BP && pathEqual
                                ? '70px'
                                : '',
                        marginLeft:
                            windowWidth < NOTE_PAGE_MOBILE_BP && pathEqual
                                ? '-75px'
                                : '',
                    }}
                >
                    <Button
                        basic
                        color='teal'
                        as={Link}
                        to='/dashboard'
                        name='home'
                        icon='hospital outline'
                    />
                </Menu.Item>
                <Menu.Item
                    style={{
                        width: pathEqual ? '0px' : '',
                        height: pathEqual ? '20px' : '',
                        marginLeft:
                            windowWidth < NOTE_PAGE_MOBILE_BP && pathEqual
                                ? '-32px'
                                : '',
                        marginTop:
                            windowWidth < NOTE_PAGE_MOBILE_BP && pathEqual
                                ? '130px'
                                : '',
                    }}
                >
                    <Dropdown
                        button
                        basic
                        color='teal'
                        floating
                        icon={null}
                        name='profile'
                        className='profile-button profile-mobile'
                        options={dropdownOptions}
                        trigger={
                            <span>
                                <Icon
                                    name='user outline'
                                    className='profile-mobile-icon'
                                />
                            </span>
                        }
                    />
                </Menu.Item>
            </>
        ) : (
            <>
                <Menu.Item>
                    <Button
                        basic
                        color='teal'
                        as={Link}
                        name='home'
                        to='/dashboard'
                        content='Home'
                        icon='hospital outline'
                    />
                </Menu.Item>
                <Menu.Item>
                    <Dropdown
                        button
                        basic
                        color='teal'
                        floating
                        name='profile'
                        className={
                            windowWidth < 800
                                ? 'profile-button'
                                : 'profile-button profile-mobile'
                        }
                        options={dropdownOptions}
                        icon={windowWidth < 800 ? null : ''}
                        trigger={
                            <span>
                                <Icon
                                    name='user outline'
                                    className={
                                        windowWidth < 800
                                            ? 'profile-mobile-icon'
                                            : ''
                                    }
                                />{' '}
                                {windowWidth < 800 ? (
                                    <></>
                                ) : (
                                    <>{this.context.user?.firstName}</>
                                )}
                            </span>
                        }
                    />
                </Menu.Item>
            </>
        );

        return (
            <div>
                <Menu
                    className={this.props.className + 'nav-menu'}
                    attached={this.props.attached}
                    style={{
                        width:
                            windowWidth < NOTE_PAGE_MOBILE_BP && pathEqual
                                ? windowWidth
                                : '',
                        height:
                            windowWidth < NOTE_PAGE_MOBILE_BP && pathEqual
                                ? '240px'
                                : '100px',
                    }}
                >
                    <Menu.Item as={Link} to='/dashboard' className='logo-menu'>
                        <Image src={Logo} className='logo-circle' />
                        {!this.props.displayNoteName && !hideCydoc && (
                            <Header
                                as='h1'
                                className='logo-text'
                                content='Cydoc'
                            />
                        )}
                    </Menu.Item>

                    {/* When parent is EditNote, then display the note name item */}
                    {this.props.displayNoteName && <NoteNameMenuItem />}

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
            address: {
                street: this.street,
                city: this.city,
                state: this.state,
                zip: this.zip,
            },
            primaryEmail: this.primaryEmail,
            // secondaryEmail: '', // TODO: remove this line when switching to AWS backend
            primaryPhone: this.primaryPhone,
            age: this.age,
            months: this.months,
            invalidFirstName: false,
            invalidLastName: false,
            invalidEmail: false,
            invalidPhone: false,
            invalidDate: false,
            primaryMobile: false,
            saveButton: '',
            buttonIcon: undefined,
            windowWidth: 0,
            windowHeight: 0,
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
        this.handleMobile = this.handleMobile.bind(this);
        this.setPrimaryMobile = this.setPrimaryMobile.bind(this);
        this.handleSave = this.handleSave.bind(this);
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

    handleInputChange = (event) => {
        this.setState({ textInput: event.target.value });
        this.context.onContextChange('title', event.target.value);
    };

    handleSave = (event) => {
        event.preventDefault();
        this.setState({ saveButton: 'loading' });
        this.context
            .saveNote()
            .then((message) => {
                if (message === 'Save Success') {
                    this.setState(
                        { saveButton: 'positive icon', buttonIcon: 'check' },
                        () => {
                            setTimeout(() => {
                                this.setState({
                                    saveButton: '',
                                    buttonIcon: undefined,
                                });
                            }, 1000);
                        }
                    );
                } else if (message === 'Save Failure') {
                    this.setState(
                        { saveButton: 'negative icon', buttonIcon: 'close' },
                        () => {
                            setTimeout(() => {
                                this.setState({
                                    saveButton: '',
                                    buttonIcon: undefined,
                                });
                            }, 1000);
                        }
                    );
                } else {
                    alert('No message');
                }
            })
            .catch((error) => {
                this.setState(
                    { saveButton: 'negative icon', buttonIcon: 'close' },
                    () => {
                        setTimeout(() => {
                            this.setState({
                                saveButton: '',
                                buttonIcon: undefined,
                            });
                        }, 1000);
                    }
                );
                alert(error);
            });
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
        // regex for digits with dashes
        const dashes = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

        // regex for digits only
        const digits = /^[0-9]{10}$/;

        if (
            e.target.value ||
            dashes.test(e.target.value) ||
            digits.test(e.target.value)
        ) {
            this.setState({ invalidPhone: false });
        } else {
            this.setState({ invalidPhone: true });
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
        let newState = this.state;
        newState[id] = value;
        this.setState(newState);

        if (id === 'street') {
            newState.address[id] = value;
            this.setState(newState);
        } else if (id === 'city') {
            newState.address[id] = value;
            this.setState(newState);
        } else if (id === 'state') {
            newState.address[id] = value;
            this.setState(newState);
        } else if (id === 'zip') {
            newState.address[id] = value;
            this.setState(newState);
        }
    };

    setPrimaryMobile = (e, { value }) => {
        const digits = /^[0-9]{10}$/;
        if (value.match(digits)) {
            let number =
                value.slice(0, 3) +
                '-' +
                value.slice(3, 6) +
                '-' +
                value.slice(6);
            this.setState({ primaryPhone: number });
        } else {
            this.setState({ primaryPhone: value });
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

    handleMobile = () => {
        this.setState({ primaryMobile: !this.state.primaryMobile });
    };

    render() {
        const { open, windowWidth } = this.state;

        return (
            <Menu.Item
                className='note-name-menu-item'
                style={{
                    marginLeft: windowWidth < NOTE_PAGE_MOBILE_BP ? '5px' : '',
                    marginTop:
                        windowWidth < NOTE_PAGE_MOBILE_BP ? '20px' : '15px',
                }}
            >
                <HPIContext.Consumer>
                    {() => (
                        <>
                            <Input
                                aria-label='Note-Title'
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
                                onClick={this.handleSave}
                                className={`save-button ${this.state.saveButton}`}
                            >
                                {this.state.saveButton.includes('icon') ? (
                                    <Icon className={this.state.buttonIcon} />
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </>
                    )}
                </HPIContext.Consumer>
                <div className='patient-info'>
                    {this.state.age >= 1 && this.state.age < 11 ? (
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
                    {this.state.age < 1 ? (
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
                        <Button
                            className='patient-modal-button'
                            size='tiny'
                            basic
                            style={{
                                marginBottom:
                                    windowWidth < NOTE_PAGE_MOBILE_BP
                                        ? '70px'
                                        : '',
                            }}
                        >
                            Add/Edit Patient Info
                        </Button>
                    }
                >
                    <Header>Patient Information</Header>
                    <Modal.Content>
                        <Form>
                            <Form.Group widths='equal' className='error-div'>
                                <Form.Input
                                    required
                                    label='First Name'
                                    className='patient-info-input'
                                    id='firstName'
                                    fluid
                                    placeholder='First Name'
                                    type='text'
                                    value={this.state.firstName}
                                    onBlur={this.onFirstNameChange}
                                    onChange={this.setChange}
                                />
                                {this.state.invalidFirstName && (
                                    <p className='error' id='first-name-error'>
                                        First name must not be blank
                                    </p>
                                )}

                                <Form.Input
                                    label='Middle Name'
                                    className='patient-info-input'
                                    id='middleName'
                                    fluid
                                    placeholder='Middle Name'
                                    type='text'
                                    value={this.state.middleName}
                                    // onBlur={this.onLastNameChange}
                                    onChange={this.setChange}
                                />
                            </Form.Group>

                            <Form.Group widths='equal' className='error-div'>
                                <Form.Input
                                    required
                                    label='Last Name'
                                    className='patient-info-input'
                                    id='lastName'
                                    fluid
                                    placeholder='Last Name'
                                    type='text'
                                    value={this.state.lastName}
                                    onBlur={this.onLastNameChange}
                                    onChange={this.setChange}
                                />
                                {this.state.invalidLastName && (
                                    <p className='error' id='last-name-error'>
                                        Last name must not be blank
                                    </p>
                                )}

                                <Form.Input
                                    required
                                    label='Date Of Birth'
                                    className='patient-info-input'
                                    id='dob'
                                    placeholder='MM/DD/YYYY'
                                    type='text'
                                    value={this.state.dob}
                                    onBlur={this.onDateChange}
                                    onChange={this.setChange}
                                />
                                {this.state.invalidDate && (
                                    <p className='error' id='dob-error'>
                                        Date must be valid
                                    </p>
                                )}
                            </Form.Group>

                            <Form.Input
                                size='small'
                                label='Street Address'
                                id='street'
                                type='text'
                                value={this.state.address.street}
                                onChange={this.setChange}
                            />

                            <Form.Group>
                                <Form.Input
                                    width={8}
                                    label='City'
                                    className='address'
                                    id='city'
                                    type='text'
                                    value={this.state.address.city}
                                    onChange={this.setChange}
                                />

                                <Form.Select
                                    width={3}
                                    fluid
                                    label='State'
                                    className='address'
                                    id='state'
                                    options={stateOptions}
                                    value={this.state.address.state}
                                    onChange={this.setChange}
                                />

                                <Form.Input
                                    width={5}
                                    label='Zip Code'
                                    className='address'
                                    id='zip'
                                    type='text'
                                    value={this.state.address.zip}
                                    onChange={this.setChange}
                                />
                            </Form.Group>

                            <Form.Group widths='equal' className='error-div'>
                                <Form.Input
                                    required
                                    label='Primary Email'
                                    className='patient-info-input'
                                    id='primaryEmail'
                                    placeholder='johndoe@email.com'
                                    type='text'
                                    value={this.state.primaryEmail}
                                    onBlur={this.onEmailChange}
                                    onChange={this.setChange}
                                />
                                {this.state.invalidEmail && (
                                    <p className='error' id='email-error'>
                                        Email must be valid
                                    </p>
                                )}
                            </Form.Group>

                            <Form.Group className='error-div phone-div'>
                                <Form.Input
                                    required
                                    width={12}
                                    label='Primary Phone'
                                    className='patient-info-input'
                                    id='primaryPhone'
                                    type='text'
                                    value={this.state.primaryPhone}
                                    onBlur={this.onPhoneChange}
                                    onChange={this.setPrimaryMobile}
                                />
                                {this.state.invalidPhone && (
                                    <p className='error' id='phone-error'>
                                        Phone number must be valid
                                    </p>
                                )}
                                <Form.Field
                                    width={4}
                                    className='mobile-checkbox'
                                    label='Mobile'
                                    control='input'
                                    type='checkbox'
                                    name='primaryMobile'
                                    checked={this.state.primaryMobile}
                                    onChange={this.handleMobile}
                                />
                                {this.state.invalidPhone && (
                                    <p className='error' id='phone-error'>
                                        Phone number must be valid
                                    </p>
                                )}
                            </Form.Group>
                            <DemographicsForm
                                race={[]}
                                asian={[]}
                                otherRace={[]}
                                ethnicity=''
                                otherEthnicity={[]}
                                gender=''
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color='blue'
                            type='submit'
                            onClick={this.savePatientInfo}
                            content='Save'
                        />
                        <Button
                            color='black'
                            onClick={this.closeModal}
                            content='Close'
                        />
                    </Modal.Actions>
                </Modal>
            </Menu.Item>
        );
    }
}
