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
import './NavMenu.css';
import signout from '../../auth/signout.js';
import DoctorSignUp from '../../pages/Account/DoctorSignUp';

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
                <DoctorSignUp />
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
            firstName: '',
            lastName: '',
            dob: '',
            age: this.age,
            months: this.months,
            gender: '',
            pronouns: '',
            currentDay: new Date().getDate(),
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            invalidLastName: false,
            invalidDate1: false,
            invalidDate2: false,
            invalidDate3: false,
            saveInfo: false,
            saveButton: '',
            buttonIcon: undefined,
            windowWidth: 0,
            windowHeight: 0,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.savePatientInfo = this.savePatientInfo.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.setChange = this.setChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.notSaveModal = this.notSaveModal.bind(this);
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

    notSaveModal() {
        this.setState({
            firstName: '',
            lastName: '',
            dob: '',
            gender: '',
            pronouns: '',
            invalidLastName: false,
            invalidDate1: false,
            invalidDate2: false,
            saveInfo: false,
        });

        this.closeModal();
    }

    savePatientInfo() {
        const {
            invalidDate1,
            invalidDate2,
            invalidDate3,
            invalidLastName,
            lastName,
            gender,
            pronouns,
            dob,
        } = this.state;
        if (
            invalidLastName ||
            lastName === '' ||
            gender === '' ||
            pronouns === ''
        ) {
            alert(
                'Last name, gender, and preferred pronouns are required to generate a note.'
            );
        } else {
            if (dob !== '' && (invalidDate1 || invalidDate2 || invalidDate3)) {
                alert('Date of birth is not valid.');
            } else {
                alert('Patient information is saved!');
                if (this.state.dob !== '') this.getAge(this.state.dob);
                this.setState({ saveInfo: true });
                this.closeModal();
            }
        }
    }

    // validations
    onLastNameChange = (e) => {
        if (!e.target.value) {
            this.setState({ invalidLastName: true });
        } else {
            this.setState({ invalidLastName: false });
        }
    };

    onDateChange = (e) => {
        if (!/^\d\d\/\d\d\/\d\d\d\d$/.test(e.target.value)) {
            this.setState({
                invalidDate1: true,
                invalidDate2: false,
                invalidDate3: false,
            });
        } else {
            const parts = e.target.value.split('/').map((p) => parseInt(p, 10));
            parts[0] -= 1;
            const d = new Date(parts[2], parts[0], parts[1]);

            if (
                d.getMonth() === parts[0] &&
                d.getDate() === parts[1] &&
                d.getFullYear() === parts[2]
            ) {
                if (
                    d.getFullYear() < this.state.currentYear &&
                    d.getFullYear() >= 1900
                ) {
                    this.setState({
                        invalidDate1: false,
                        invalidDate2: false,
                        invalidDate3: false,
                    });
                } else if (
                    d.getFullYear() === this.state.currentYear &&
                    d.getMonth() <= this.state.currentMonth &&
                    d.getDate() <= this.state.currentDay
                ) {
                    this.setState({
                        invalidDate1: false,
                        invalidDate2: false,
                        invalidDate3: false,
                    });
                } else {
                    this.setState({
                        invalidDate1: false,
                        invalidDate2: false,
                        invalidDate3: true,
                    });
                }
            } else {
                this.setState({
                    invalidDate2: true,
                    invalidDate1: false,
                    invalidDate3: false,
                });
            }
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

    handleChange(e, { name, value }) {
        let newState = this.state;
        newState[name] = value;
        this.setState(newState);
    }

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
                    {this.state.lastName === '' && this.state.open === false ? (
                        <></>
                    ) : (
                        <>
                            {this.state.dob === '' &&
                            this.state.open === false ? (
                                <h4>Patient: {this.state.lastName}</h4>
                            ) : (
                                <>
                                    {this.state.age >= 1 &&
                                    this.state.age < 11 ? (
                                        <>
                                            {this.state.firstName === '' ? (
                                                <h4>
                                                    Patient:{' '}
                                                    {this.state.lastName},{' '}
                                                    {this.state.age} years and{' '}
                                                    {this.state.months} months
                                                    old
                                                </h4>
                                            ) : (
                                                <h4>
                                                    Patient:{' '}
                                                    {this.state.firstName}{' '}
                                                    {this.state.lastName},{' '}
                                                    {this.state.age} years and{' '}
                                                    {this.state.months} months
                                                    old
                                                </h4>
                                            )}
                                        </>
                                    ) : (
                                        ''
                                    )}
                                    {this.state.age >= 11 ? (
                                        <>
                                            {this.state.firstName === '' ? (
                                                <h4>
                                                    Patient:{' '}
                                                    {this.state.lastName},{' '}
                                                    {this.state.age} years old
                                                </h4>
                                            ) : (
                                                <h4>
                                                    Patient:{' '}
                                                    {this.state.firstName}{' '}
                                                    {this.state.lastName},{' '}
                                                    {this.state.age} years old
                                                </h4>
                                            )}
                                        </>
                                    ) : (
                                        ''
                                    )}
                                    {this.state.age < 1 ? (
                                        <>
                                            {this.state.firstName === '' ? (
                                                <h4>
                                                    Patient:{' '}
                                                    {this.state.lastName},{' '}
                                                    {this.state.months} months
                                                    old
                                                </h4>
                                            ) : (
                                                <h4>
                                                    Patient:{' '}
                                                    {this.state.firstName}{' '}
                                                    {this.state.lastName},{' '}
                                                    {this.state.months} months
                                                    old
                                                </h4>
                                            )}
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </>
                            )}
                        </>
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
                            </Form.Group>

                            <Form.Group widths='equal' className='error-div'>
                                <Form.Input
                                    label='Date Of Birth'
                                    className='patient-info-input'
                                    id='dob'
                                    placeholder='MM/DD/YYYY'
                                    type='text'
                                    value={this.state.dob}
                                    onBlur={this.onDateChange}
                                    onChange={this.setChange}
                                />

                                {this.state.invalidDate1 &&
                                    this.state.dob !== '' && (
                                        <p className='error' id='dob-error'>
                                            Date must be in MM/DD/YYYY format
                                        </p>
                                    )}

                                {this.state.invalidDate2 &&
                                    this.state.dob !== '' && (
                                        <p className='error' id='dob-error'>
                                            Month and/or day is outside of range
                                        </p>
                                    )}

                                {this.state.invalidDate3 &&
                                    this.state.dob !== '' && (
                                        <p className='error' id='dob-error'>
                                            Only dates from 01/01/1900 to today
                                            are allowed
                                        </p>
                                    )}
                            </Form.Group>

                            <Form.Group
                                grouped
                                className='identity-groups required field'
                            >
                                <label>Gender</label>
                                <Form.Radio
                                    className='identity-fields'
                                    name='gender'
                                    label='Prefer Not To Say'
                                    value='Prefer Not To Say'
                                    checked={
                                        this.state.gender ===
                                        'Prefer Not To Say'
                                    }
                                    onChange={this.handleChange}
                                />
                                <Form.Radio
                                    className='identity-fields'
                                    name='gender'
                                    label='Male'
                                    value='Male'
                                    checked={this.state.gender === 'Male'}
                                    onChange={this.handleChange}
                                />
                                <Form.Radio
                                    className='identity-fields'
                                    name='gender'
                                    label='Female'
                                    value='Female'
                                    checked={this.state.gender === 'Female'}
                                    onChange={this.handleChange}
                                />
                                <Form.Radio
                                    className='identity-fields'
                                    name='gender'
                                    label='Transgender Woman'
                                    value='Transgender Woman'
                                    checked={
                                        this.state.gender ===
                                        'Transgender Woman'
                                    }
                                    onChange={this.handleChange}
                                />
                                <Form.Radio
                                    className='identity-fields'
                                    name='gender'
                                    label='Transgender Man'
                                    value='Transgender Man'
                                    checked={
                                        this.state.gender === 'Transgender Man'
                                    }
                                    onChange={this.handleChange}
                                />
                                <Form.Radio
                                    className='identity-fields'
                                    name='gender'
                                    label='Gender Queer'
                                    value='Gender Queer'
                                    checked={
                                        this.state.gender === 'Gender Queer'
                                    }
                                    onChange={this.handleChange}
                                />
                                <Form.Radio
                                    className='identity-fields'
                                    name='gender'
                                    label='Open-ended'
                                    value='Open-ended'
                                    checked={this.state.gender === 'Open-ended'}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group
                                grouped
                                className='identity-groups required field'
                            >
                                <label>Preferred Pronouns</label>
                                <Form.Radio
                                    className='identity-fields'
                                    name='pronouns'
                                    label='He/him'
                                    value='He/him'
                                    checked={this.state.pronouns === 'He/him'}
                                    onChange={this.handleChange}
                                />
                                <Form.Radio
                                    className='identity-fields'
                                    name='pronouns'
                                    label='She/her'
                                    value='She/her'
                                    checked={this.state.pronouns === 'She/her'}
                                    onChange={this.handleChange}
                                />
                                <Form.Radio
                                    className='identity-fields'
                                    name='pronouns'
                                    label='They/them'
                                    value='They/them'
                                    checked={
                                        this.state.pronouns === 'They/them'
                                    }
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
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
                            onClick={
                                this.state.saveInfo
                                    ? this.closeModal
                                    : this.notSaveModal
                            }
                            content='Close'
                        />
                    </Modal.Actions>
                </Modal>
            </Menu.Item>
        );
    }
}
