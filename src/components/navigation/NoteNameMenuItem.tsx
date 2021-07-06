import React, { useState, useContext } from 'react';
import {
    Menu,
    Icon,
    Button,
    Input,
    Modal,
    Form,
    Header,
    InputOnChangeData,
} from 'semantic-ui-react';
import NotesContext from '../../contexts/NotesContext';
import states from 'constants/stateAbbreviations.json';
import DemographicsForm from '../tools/DemographicsForm';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { initialNoteTitle } from 'redux/reducers/currentNoteReducer';
import {
    updateNoteTitle,
    UpdateNoteTitleAction,
} from 'redux/actions/currentNoteActions';
import { selectNoteTitle } from 'redux/selectors/currentNoteSelectors';

interface StateProps {
    note: CurrentNoteState;
    title: string;
}

interface DispatchProps {
    updateNoteTitle: (title: string) => UpdateNoteTitleAction;
}

type NoteNameMenuItemProps = StateProps & DispatchProps;
type FieldError = false | { content: string };
type FormChangeHandler = (
    e: React.ChangeEvent,
    data: InputOnChangeData
) => void;

interface User {
    username: string;
    [key: string]: string;
}

export interface Context {
    user: User | null;
    token: string | null;
    storeLoginInfo: (user: string, token: string) => void;
    logOut: () => void;
    updateNote: (note: any) => string;
}

const stateOptions = states.map((state) => ({
    key: state,
    value: state,
    text: state,
}));

// TODO: Connect to backend
// Component that displays and changes note name shown only if parent is EditNote.
const NoteNameMenuItem = (props: NoteNameMenuItemProps) => {
    const { title, note, updateNoteTitle } = props;
    const context = useContext(NotesContext) as Context;

    // Form fields
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [primaryEmail, setPrimaryEmail] = useState('');
    const [secondaryEmail, setSecondaryEmail] = useState(''); // TODO: remove this line when switching to AWS backend
    const [primaryPhone, setPrimaryPhone] = useState('');
    const [primaryMobile, setPrimaryMobile] = useState(false);
    const [age, setAge] = useState({
        years: 0,
        months: 0,
    });
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
    });
    // Field error messages
    const [invalidFirstName, setInvalidFirstName] = useState<FieldError>(false);
    const [invalidLastName, setInvalidLastName] = useState<FieldError>(false);
    const [invalidEmail, setInvalidEmail] = useState<FieldError>(false);
    const [invalidPhone, setInvalidPhone] = useState<FieldError>(false);
    const [invalidDate, setInvalidDate] = useState<FieldError>(false);
    const [saveButton, setSaveButton] = useState('');
    const [buttonIcon, setButtonIcon] = useState<undefined | string>(undefined);

    // Update note in backend
    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        setSaveButton('loading');
        const updatedNote = {
            ...note,
            modifiedTime: Date.now(),
        };

        try {
            const message = await context.updateNote(updatedNote);
            let resSaveButton = '',
                resButtonIcon = '';
            switch (message) {
                case 'Save Success':
                    resSaveButton = 'positive icon';
                    resButtonIcon = 'check';
                    break;
                case 'Save Failure':
                    resSaveButton = 'negative icon';
                    resButtonIcon = 'close';
                    break;
                default:
                    alert('No message');
            }
            setSaveButton(resSaveButton);
            setButtonIcon(resButtonIcon);
        } catch (e) {
            setSaveButton('negative icon');
            setButtonIcon('close');
        } finally {
            setTimeout(() => {
                setSaveButton('');
                setButtonIcon(undefined);
            }, 2000);
        }
    };

    // Modal event handlers
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    // Patient Info form event handlers
    const processDob = (dateString: string) => {
        const now = new Date();
        const yearNow = now.getFullYear();
        const monthNow = now.getMonth();

        const dob = new Date(
            parseInt(dateString.substring(6, 10)),
            parseInt(dateString.substring(0, 2)) - 1,
            parseInt(dateString.substring(3, 5))
        );

        const yearDob = dob.getFullYear();
        const monthDob = dob.getMonth();

        let years = yearNow - yearDob;
        let months: number;

        if (monthNow >= monthDob) {
            months = monthNow - monthDob;
        } else {
            years--;
            months = 12 + monthNow - monthDob;
        }
        setAge({ months, years });
    };

    const savePatientInfo = () => {
        if (
            invalidFirstName ||
            invalidLastName ||
            invalidEmail ||
            invalidPhone ||
            invalidDate
        ) {
            alert('Please make sure all the required fields are completed');
            return;
        }
        alert('Patient information is saved!');
        processDob(dob);
        closeModal();
    };

    const formatOnChange = function (
        action: (val: any) => void
    ): FormChangeHandler {
        return (_e, { value }) => action(value);
    };
    const onAddressChange: FormChangeHandler = (_e, { value, id }) =>
        setAddress({ ...address, [id]: value });

    const onPrimaryMobileChange: FormChangeHandler = (e, { value }) => {
        const digits = /^[0-9]{10}$/;
        if (value.match(digits)) {
            const number = `${value.slice(0, 3)}-${value.slice(
                3,
                6
            )}-${value.slice(6)}`;
            setPrimaryPhone(number);
        } else {
            setPrimaryPhone(value);
        }
    };

    // Form validators
    const validateFirstName = (e: React.FocusEvent) => {
        const target = e.target as HTMLInputElement;
        if (!target.value) {
            setInvalidFirstName({ content: 'First name must not be blank' });
        } else {
            setInvalidFirstName(false);
        }
    };

    const validateLastName = (e: React.FocusEvent) => {
        const target = e.target as HTMLInputElement;
        if (!target.value) {
            setInvalidLastName({ content: 'Last name must not be blank' });
        } else {
            setInvalidLastName(false);
        }
    };

    const validatePhone = (e: React.FocusEvent) => {
        const target = e.target as HTMLInputElement;
        // regex for digits with dashes
        const dashes = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
        // regex for digits only
        const digits = /^[0-9]{10}$/;
        if (
            !target.value ||
            !(dashes.test(target.value) || digits.test(target.value))
        ) {
            setInvalidPhone({ content: 'Phone number must be valid' });
        } else {
            setInvalidPhone(false);
        }
    };

    const validateEmail = (e: React.FocusEvent) => {
        const target = e.target as HTMLInputElement;
        const re = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[A-z]+\.[A-z]{3}.?[A-z]{0,3}$/g;
        if (!target.value || !re.test(target.value)) {
            setInvalidEmail({ content: 'Email must be valid' });
        } else {
            setInvalidEmail(false);
        }
    };

    const validateDate = (e: React.FocusEvent) => {
        const target = e.target as HTMLInputElement;
        const re = /^((0[1-9]|10|11|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9])|(3[01]))(-|\/)((19)([2-9])(\d{1})|(20)([012])(\d{1})|([8901])(\d{1})))$/gm;
        if (!target.value || !re.test(target.value)) {
            setInvalidDate({ content: 'Date must be valid ' });
        } else {
            setInvalidDate(false);
        }
    };

    return (
        <Menu.Item className='note-name-menu-item'>
            <Input
                aria-label='Note-Title'
                className='note-title'
                size='huge'
                transparent
                placeholder={initialNoteTitle}
                onChange={formatOnChange(updateNoteTitle)}
                onFocus={() =>
                    title === initialNoteTitle && updateNoteTitle('')
                }
                onBlur={() => title === '' && updateNoteTitle(initialNoteTitle)}
                value={title}
            />
            <Button
                size='mini'
                onClick={handleSave}
                className={`save-button ${saveButton}`}
            >
                {saveButton.includes('icon') ? (
                    <Icon className={buttonIcon} />
                ) : (
                    'Save'
                )}
            </Button>
            <div className='patient-info'>
                {age.years >= 1 && age.years < 11 && (
                    <h4>
                        {`Patient: ${firstName} ${lastName}, \
                        ${age.years} years and \
                        ${age.months} months old`}
                    </h4>
                )}
                {age.years >= 11 && (
                    <h4>
                        {`Patient: ${firstName} ${lastName}, \
                        ${age.years} years old`}
                    </h4>
                )}
                {age.years < 1 && (
                    <h4>
                        {`Patient: ${firstName} ${lastName}, \
                        ${age.months} months old`}
                    </h4>
                )}
            </div>
            <Modal
                className='patient-modal'
                onClose={closeModal}
                onOpen={openModal}
                open={open}
                size='tiny'
                dimmer='inverted'
                trigger={
                    <Button className='patient-modal-button' size='tiny' basic>
                        Add/Edit Patient Info
                    </Button>
                }
            >
                <Header>Patient Information</Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal' className='error-div'>
                            <Form.Field
                                fluid
                                required
                                id='firstName'
                                type='text'
                                label='First Name'
                                className='patient-info-input'
                                placeholder='First Name'
                                control={Input}
                                value={firstName}
                                error={invalidFirstName}
                                onBlur={validateFirstName}
                                onChange={formatOnChange(setFirstName)}
                            />
                            <Form.Field
                                fluid
                                type='text'
                                id='middleName'
                                label='Middle Name'
                                className='patient-info-input'
                                placeholder='Middle Name'
                                value={middleName}
                                control={Input}
                                onChange={formatOnChange(setMiddleName)}
                            />
                        </Form.Group>
                        <Form.Group widths='equal' className='error-div'>
                            <Form.Field
                                fluid
                                required
                                type='text'
                                label='Last Name'
                                id='lastName'
                                className='patient-info-input'
                                placeholder='Last Name'
                                control={Input}
                                value={lastName}
                                error={invalidLastName}
                                onBlur={validateLastName}
                                onChange={formatOnChange(setLastName)}
                            />
                            <Form.Field
                                required
                                id='dob'
                                type='text'
                                label='Date Of Birth'
                                className='patient-info-input'
                                placeholder='MM/DD/YYYY'
                                control={Input}
                                value={dob}
                                error={invalidDate}
                                onBlur={validateDate}
                                onChange={formatOnChange(setDob)}
                            />
                        </Form.Group>
                        <Form.Input
                            size='small'
                            label='Street Address'
                            id='street'
                            type='text'
                            value={address.street}
                            onChange={onAddressChange}
                        />
                        <Form.Group>
                            <Form.Input
                                width={8}
                                label='City'
                                className='address'
                                id='city'
                                type='text'
                                value={address.city}
                                onChange={onAddressChange}
                            />
                            <Form.Select
                                width={3}
                                fluid
                                label='State'
                                className='address'
                                id='state'
                                options={stateOptions}
                                value={address.state}
                                onChange={(_e, { value }) =>
                                    setAddress({
                                        ...address,
                                        state: value as string,
                                    })
                                }
                            />
                            <Form.Input
                                width={5}
                                label='Zip Code'
                                className='address'
                                id='zip'
                                type='text'
                                value={address.zip}
                                onChange={onAddressChange}
                            />
                        </Form.Group>
                        <Form.Group widths='equal' className='error-div'>
                            <Form.Field
                                required
                                type='text'
                                id='primaryEmail'
                                label='Primary Email'
                                className='patient-info-input'
                                placeholder='johndoe@email.com'
                                control={Input}
                                error={invalidEmail}
                                value={primaryEmail}
                                onBlur={validateEmail}
                                onChange={formatOnChange(setPrimaryEmail)}
                            />
                        </Form.Group>
                        <Form.Group className='error-div phone-div'>
                            <Form.Field
                                required
                                width={12}
                                label='Primary Phone'
                                className='patient-info-input'
                                id='primaryPhone'
                                type='text'
                                control={Input}
                                error={invalidPhone}
                                value={primaryPhone}
                                onBlur={validatePhone}
                                onChange={onPrimaryMobileChange}
                            />
                            <Form.Field
                                width={4}
                                className='mobile-checkbox'
                                label='Mobile'
                                control='input'
                                type='checkbox'
                                name='primaryMobile'
                                checked={primaryMobile}
                                onChange={() =>
                                    setPrimaryMobile(!primaryMobile)
                                }
                            />
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
                        onClick={savePatientInfo}
                        content='Save'
                    />
                    <Button
                        color='black'
                        onClick={closeModal}
                        content='Close'
                    />
                </Modal.Actions>
            </Modal>
        </Menu.Item>
    );
};

export default connect(
    (state: CurrentNoteState) => ({
        note: state,
        title: selectNoteTitle(state),
    }),
    { updateNoteTitle }
)(NoteNameMenuItem);
