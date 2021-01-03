import React, { Component, Fragment } from 'react';
import {Dropdown, Menu, Image, Icon, Button, Input, Modal, Form, Segment, Header} from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { DEFAULT_NAV_MENU_MOBILE_BP, LOGGEDIN_NAV_MENU_MOBILE_BP } from "constants/breakpoints.js";
import HPIContext from 'contexts/HPIContext.js';
import AuthContext from "../../contexts/AuthContext";
import LogoLight from '../../assets/logo-light.png'
import LogoName from '../../assets/logo-name.png'
import './NavMenu.css';
import states from 'constants/stateAbbreviations.json';
import DemographicsForm from '../tools/DemographicsForm';

const stateOptions = states.map((state) => ({key: state, value: state, text: state}));

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
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    render() {
        const { windowWidth } = this.state;
        const collapseDefaultNav = windowWidth < DEFAULT_NAV_MENU_MOBILE_BP;
        const collapseLoggedInNav = windowWidth < LOGGEDIN_NAV_MENU_MOBILE_BP;
        return (
            <div>
                <Menu className={this.props.className + " nav-menu"} attached={this.props.attached}>

                    {/* Logo Image - display icon when tabs not collapsed, and brand name when collpased. */}
                    {/* Only logo image is displayed when the note name must be shown next to it */}
                    <Menu.Item>
                        {this.props.displayNoteName && collapseLoggedInNav?
                            null :
                            <Image className="nav-menu-logo" href='/home' src={LogoLight} />
                        }
                        {this.props.displayNoteName ?
                            null :
                            <Image className="nav-menu-brand" size='small' href='/home' src={LogoName} />
                        }
                    </Menu.Item>    

                    {/* When parent is EditNote, then display the note name item */}
                    {this.props.displayNoteName ?  <NoteNameMenuItem /> : null}

                    {/* Navigation links */}
                    <Menu.Menu position="right">
                        {/* Menu will have different options depending on whether the user is logged in or not */}
                        {this.context.token ?
                            <LoggedInMenuItems
                                handleLogout={this.context.logOut}
                                name={this.context.user.firstName}
                                collapseNav={collapseLoggedInNav} />
                            :
                            <DefaultMenuItems collapseNav={collapseDefaultNav} />}
                    </Menu.Menu>
                </Menu>
            </div>

        );
    }
};

const NavMenu = ConnectedNavMenu;
export default NavMenu;

NavMenu.propTypes = {
    // optional prop for stacking another menu above/below
    attached: PropTypes.string,
    // optional prop for whether to display or hide hte note name menu item
    displayNoteName: PropTypes.bool
};

// class component that displays and changes note name
// shown only if parent is EditNote.
class NoteNameMenuItem extends Component {

    static contextType = HPIContext
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
                zip: this.zip
            },
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
            primaryMobile: false,
            secondaryMobile: false
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
        this.setSecondaryMobile = this.setSecondaryMobile.bind(this);
    }

    handleInputChange = (event) => {
        this.setState({textInput: event.target.value})
        this.context.onContextChange("title", event.target.value)
    }

    closeModal() {
        this.setState({open: false})
    }

    openModal() {
        this.setState({open: true})
    }

    savePatientInfo() {
        const { invalidDate, invalidEmail, invalidFirstName, invalidLastName, invalidPhone } = this.state
        if (invalidFirstName || invalidLastName || invalidEmail || invalidPhone || invalidDate) {
            alert('Please make sure all the required fields are completed')
        } else {
            alert('Patient information is saved!');
            this.getAge(this.state.dob);
            this.closeModal();   
        }
    };

    // validations
    onFirstNameChange = (e) => {
        if (!e.target.value) {
            this.setState({ invalidFirstName: true})
        } else {
            this.setState({ invalidFirstName: false})
        }
    }

    onLastNameChange = (e) => {
        if (!e.target.value) {
            this.setState({ invalidLastName: true})
        } else {
            this.setState({ invalidLastName: false})
        }
    }

    onPhoneChange = (e) => {
        // regex for digits with dashes
        const dashes = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

        // regex for digits only
        const digits = /^[0-9]{10}$/;

        if (e.target.value || dashes.test(e.target.value) || digits.test(e.target.value)) {
            this.setState({ invalidPhone: false})
        } else {
            this.setState({ invalidPhone: true})
        }

    }

    onEmailChange = (e) => {
        const re = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[A-z]+\.[A-z]{3}.?[A-z]{0,3}$/g;
        if (!e.target.value || !re.test(e.target.value)) {
            this.setState({ invalidEmail: true})
        } else {
            this.setState({ invalidEmail: false})
        }
    }

    onDateChange = (e) => {
        const re = /^((0[1-9]|10|11|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9])|(3[01]))(-|\/)((19)([2-9])(\d{1})|(20)([012])(\d{1})|([8901])(\d{1})))$/gm;
        if (!e.target.value || !re.test(e.target.value)) {
            this.setState({ invalidDate: true})
        } else {
            this.setState({ invalidDate: false})
        }
    }

    setChange = (e, {id, value}) => {

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
    }

    setPrimaryMobile = (e, {value}) => {
        const digits = /^[0-9]{10}$/;
        if (value.match(digits)) {
            let number = value.slice(0,3) + "-" + value.slice(3,6) + "-" + value.slice(6);
            this.setState({ primaryPhone: number})
        } else {
            this.setState({ primaryPhone: value})
        }
    }

    setSecondaryMobile = (e, {value}) => {
        const digits = /^[0-9]{10}$/;
        if (value.match(digits)) {
            let number = value.slice(0,3) + "-" + value.slice(3,6) + "-" + value.slice(6);
            this.setState({ secondaryPhone: number})
        } else {
            this.setState({ secondaryPhone: value})
        }
    }

    getAge(dateString) {
        var now = new Date();      
        var yearNow = now.getYear();
        var monthNow = now.getMonth();
      
        var dob = new Date(dateString.substring(6,10),
                           dateString.substring(0,2)-1,                   
                           dateString.substring(3,5)                  
                           );
      
        var yearDob = dob.getYear();
        var monthDob = dob.getMonth();
        var age = {};
            
        let yearAge = yearNow - yearDob;
      
        if (monthNow >= monthDob)
          var monthAge = monthNow - monthDob;
        else {
          yearAge--;
          var monthAge = 12 + monthNow -monthDob;
        }
      
        age = {
            years: yearAge,
            months: monthAge,
            };
      
        this.setState({age: age.years});
        this.setState({months: age.months});
      }
      
    handleMobile = (e) => {
        let mobile = e.target.name;
        if (mobile === 'primaryMobile') {
            if (!this.state.primaryMobile) {
                this.setState({ primaryMobile: true})
            } else {
                this.setState({ primaryMobile: false})
            }
        }

        if (mobile === 'secondaryMobile') {
            if (!this.state.secondaryMobile) {
                this.setState({ secondaryMobile: true})
            } else {
                this.setState({ secondaryMobile: false})
            }
        }
    }

    render () {
        const { open } = this.state
        return (
            <Menu.Item className="note-name-menu-item">
                <HPIContext.Consumer>
                    {value =>
                        <>
                            <Input
                                className='note-title'
                                size="huge"
                                transparent
                                placeholder="Untitled Note"
                                onChange={this.handleInputChange}
                                onFocus={()=>{
                                    if (this.context.title === "Untitled Note") {
                                        this.context.onContextChange("title", "")
                                    }
                                }}
                                onBlur={()=>{
                                    this.setState({isTitleFocused: false})
                                    if (this.context.title === '') {
                                        this.context.onContextChange("title", "Untitled Note")
                                    }
                                }}
                                value={this.context.title}
                            />
                            <Button mini onClick={this.context.saveNote} className="save-button">
                                Save
                            </Button>
                        </>
                    }
                    </HPIContext.Consumer>
                    <div className='patient-info'> 
                    {this.state.age >= 1 && this.state.age < 11 ? 
                        <h4>Patient: {this.state.firstName} {this.state.lastName}, {this.state.age} years and {this.state.months} months old</h4>
                        : ""
                    }
                    {this.state.age >= 11 ?
                        <h4>Patient: {this.state.firstName} {this.state.lastName}, {this.state.age} years old</h4>
                        : ""
                    }
                    {this.state.age < 1 ?
                        <h4>Patient: {this.state.firstName} {this.state.lastName}, {this.state.months} months old</h4>
                        : ""
                    }
                    
                    </div>
                    <Modal
                        className='patient-modal'
                        onClose={this.closeModal}
                        onOpen={this.openModal}
                        open={open}
                        size='tiny'
                        dimmer='inverted'
                        trigger={<Button className='patient-modal-button' tiny basic>Add/Edit Patient Info</Button>}
                        >
                        <Header>Patient Information</Header>
                        <Modal.Content>
                        <Form>
                            <Form.Group widths='equal' className='error-div'>
                                <Form.Input required
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
                                { this.state.invalidFirstName && (
                                    <p className='error' id='first-name-error'>First name must not be blank</p>
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
                                <Form.Input required
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
                                { this.state.invalidLastName && (
                                    <p className='error' id='last-name-error'>Last name must not be blank</p>
                                )} 

                                <Form.Input required
                                    label='Date Of Birth'
                                    className='patient-info-input' 
                                    id='dob' 
                                    placeholder='MM/DD/YYYY' 
                                    type='text' 
                                    value={this.state.dob}
                                    onBlur={this.onDateChange} 
                                    onChange={this.setChange}
                                />
                                { this.state.invalidDate && (
                                    <p className='error' id='dob-error'>Date must be valid</p>
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
                                <Form.Input width={8}
                                    label='City'
                                    className='address'
                                    id='city'
                                    type='text'
                                    value={this.state.address.city}
                                    onChange={this.setChange}
                                />

                                <Form.Select width={3}
                                    fluid
                                    label='State'
                                    className='address'
                                    id='state'
                                    options={stateOptions}
                                    value={this.state.address.state}
                                    onChange={this.setChange}
                                />

                                <Form.Input width={5}
                                    label='Zip Code'
                                    className='address'
                                    id='zip'
                                    type='text'
                                    value={this.state.address.zip}
                                    onChange={this.setChange}
                                />
                            </Form.Group>

                            <Form.Group widths='equal' className='error-div'>
                                <Form.Input required
                                    label='Primary Email'
                                    className='patient-info-input' 
                                    id='primaryEmail' 
                                    placeholder='johndoe@email.com' 
                                    type='text' 
                                    value={this.state.primaryEmail}
                                    onBlur={this.onEmailChange}
                                    onChange={this.setChange}
                                />
                                { this.state.invalidEmail && (
                                    <p className='error' id='email-error'>Email must be valid</p>
                                )}

                                <Form.Input
                                    label='Secondary Email'
                                    className='patient-info-input' 
                                    id='secondaryEmail' 
                                    placeholder='johndoe@email.com' 
                                    type='text' 
                                    value={this.state.secondaryEmail}
                                    // onBlur={this.onEmailChange}
                                    onChange={this.setChange}
                                />
                            </Form.Group>

                            <Form.Group className='error-div phone-div'>
                                <Form.Input required width={8}
                                    label='Primary Phone'
                                    className='patient-info-input' 
                                    id='primaryPhone' 
                                    type='text' 
                                    value={this.state.primaryPhone}
                                    onBlur={this.onPhoneChange}
                                    onChange={this.setPrimaryMobile}
                                    />
                                { this.state.invalidPhone && (
                                    <p className='error' id='phone-error'>Phone number must be valid</p>
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
                            </Form.Group>

                            <Form.Group className='phone-div'>
                                <Form.Input width={8}
                                    label='Secondary Phone'
                                    className='patient-info-input' 
                                    id='secondaryPhone' 
                                    type='text' 
                                    value={this.state.secondaryPhone}
                                    // onBlur={this.onPhoneChange}
                                    onChange={this.setSecondaryMobile}
                                />
                                <Form.Field 
                                    width={4} 
                                    className='mobile-checkbox' 
                                    label='Mobile' 
                                    control='input' 
                                    type='checkbox'
                                    name='secondaryMobile'
                                    checked={this.state.secondaryMobile}
                                    onChange={this.handleMobile}
                                />
                            </Form.Group>
                            
                            <DemographicsForm 
                                race=''
                                asian={[]}
                                otherRace={[]}
                                ethnicity=''
                                otherEthnicity={[]}
                                gender=''
                            />

                        </Form>
                        </Modal.Content>
                        <Modal.Actions>                    
                            <Button color='blue' type='submit' onClick={this.savePatientInfo}>Save</Button>
                            <Button color='black' onClick={this.closeModal}>Close</Button>
                        </Modal.Actions>
                    </Modal>
            </Menu.Item>
        )
    }

}

// Functional component for menu items that show when user is not logged in
function DefaultMenuItems(props) {
    return props.collapseNav ?
        (<Menu.Item>
                <Dropdown icon="large bars" className='collapsed-dropdown'>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} name="about" to="/about" text="About" />
                        <Dropdown.Item as={Link} name="login" to="/login" text="Login" />
                        <Dropdown.Item as={Link} name="register" to="/register" text="Sign Up" />
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
        ) : (
            <Fragment>
                <Menu.Item as={Link} name="about" to="/about" text="About" />
                <Menu.Item>
                    <Button.Group>
                        <Button as={Link} basic color={"teal"} name="login" to="/login" text="Login" >Login</Button>
                        <Button as={Link} color={"teal"} name="register" to="/register" text="Sign Up" >Sign Up</Button>
                    </Button.Group>
                </Menu.Item>

            </Fragment>
        );
}

//Functional component for menu items that show when user is logged in
function LoggedInMenuItems(props) {
    return (props.collapseNav ? (
            // (<Menu.Item>
            //         <Dropdown icon="large bars">
            //             <Dropdown.Menu>
            //                 <Dropdown.Item name="welcome" style={{color: '#6DA3B1', fontStyle: 'italic', fontWeight: 'light'}}>
            //                     {props.name}
            //                 </Dropdown.Item>
            //                 <Dropdown.Item as={Link} name="myNotes" to="/dashboard" text="My Notes" />
            //
            //                 <Dropdown.Item name="logout" href="/home" text="Logout" onClick={props.handleLogout} />
            //             </Dropdown.Menu>
            //         </Dropdown>
            //     </Menu.Item>
            <>
                <Menu.Item>

                    <Button.Group>
                        <Button as={Link} name="myNotes" to="/dashboard" text="My Notes" >
                            <Icon name="sticky note outline" className='collapsed-icon'/>
                        </Button>
                        <Button name="logout" href="/home" text="Logout" onClick={props.handleLogout} className='logout-button'>
                            <Icon name="sign out alternate" className='collapsed-icon'/>
                        </Button>
                    </Button.Group>
                </Menu.Item>
            </>
        ) : (
            <>
                <Menu.Item>
                    <Button.Group>
                        <Button as={Link} name="myNotes" to="/dashboard" text="My Notes" >My Notes</Button>
                        <Button name="logout" href="/home" text="Logout" onClick={props.handleLogout} className="logout-button">Log Out</Button>
                    </Button.Group>
                </Menu.Item>
                <Menu.Item name="welcome" style={{color: '#6DA3B1', fontWeight: 'normal'}}>
                    <Icon name="user outline" /> {props.name}
                </Menu.Item>
            </>
        )
    );
}

