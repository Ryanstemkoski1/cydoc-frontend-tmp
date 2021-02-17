import React, { useState } from 'react';
import {
    Form,
    Grid,
    Segment,
    Button,
    Divider,
    Container,
    Message,
    Image,
    Header,
} from 'semantic-ui-react';
import * as yup from 'yup';
import Logo from '../../assets/cydoc-logo.svg';
import NavMenu from '../../components/navigation/NavMenu';
import DemographicsForm from '../../components/tools/DemographicsForm';
import constants from 'constants/registration-constants.json';
import './Account.css';

const degreeOptions = constants.degrees.map((degree) => ({
    key: degree,
    value: degree,
    text: degree,
}));
const specialtyOptions = constants.specialties.map((specialty) => ({
    key: specialty,
    value: specialty,
    text: specialty,
}));
const workfeatOptions = constants.workplaceFeatures.map((workfeat) => ({
    key: workfeat,
    value: workfeat,
    text: workfeat,
}));

const yasaSchema = yup.object().shape({
    newPassword: yup.string().required('password is required'),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), null], 'passwords must match'),
    backupEmail: yup
        .string()
        .required('backup email is required')
        .email('backup email must be valid'),
    phoneNumber: yup
        .string()
        .required('phone number is required')
        .matches(/^\+\d{7,20}$/, 'phone number must be valid'),
    firstName: yup.string().required('first name is required'),
    lastName: yup.string().required('last name is required'),
    studentStatus: yup.string().when('role', {
        is: 'healthcare professional',
        then: yup.string().required('please specify your student status'),
        otherwise: yup.string(),
    }),
    workplace: yup.string().when('role', {
        is: 'healthcare professional',
        then: yup.string().required('workplace is required'),
        otherwise: yup.string(),
    }),
    degreesCompleted: yup
        .array()
        .of(yup.string())
        .test(
            'degreesCompleted-duplicates',
            'Cannot put same degree twice under degrees completed',
            (arr) => {
                return (
                    arr.filter((item, index) => {
                        return item !== '' && arr.indexOf(item) !== index;
                    }).length === 0
                );
            }
        ),
    degreesInProgress: yup
        .array()
        .of(
            yup
                .string()
                .notOneOf(
                    [
                        yup.ref('$degreesCompleted[0]'),
                        yup.ref('$degreesCompleted[1]'),
                        yup.ref('$degreesCompleted[2]'),
                    ],
                    'Same degree cannot be both completed and in progress'
                )
        )
        .test(
            'degreesInProgress-duplicates',
            'Cannot put same degree twice under degrees in progress',
            (arr) => {
                return (
                    arr.filter((item, index) => {
                        return item !== '' && arr.indexOf(item) !== index;
                    }).length === 0
                );
            }
        ),
    specialties: yup
        .array()
        .test(
            'specialty-duplicates',
            'Cannot put same specialty twice',
            (arr) => {
                return (
                    arr.filter((item, index) => {
                        return item !== '' && arr.indexOf(item) !== index;
                    }).length === 0
                );
            }
        ),
});

const FirstTimeLogin = ({ onSubmit, role }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [workplace, setWorkplace] = useState('');
    const [backupEmail, setBackupEmail] = useState('');
    const [studentStatus, setStudentStatus] = useState('');
    const [degreesCompleted, setDegreesCompleted] = useState(['', '', '']);
    const [degreesInProgress, setDegreesInProgress] = useState(['', '', '']);
    const [specialties, setSpecialties] = useState(['', '', '']);
    const [workplaceFeatures, setWorkplaceFeatures] = useState([]);
    const [formErrors, setFormErrors] = useState([]);
    const [passwordReqs, setPasswordReqs] = useState({
        containsNumber: false,
        containsUpper: false,
        containsLower: false,
        containsSpecial: false,
        passesMinLength: false,
    });

    const handleNewPasswordChange = (e, { value }) => {
        const minLength =
            role === 'manager' || role === 'healthcare manager' ? 25 : 16;
        setPasswordReqs({
            ...passwordReqs,
            containsNumber: value.match(/\d+/g) ? true : false,
            containsUpper: value.toLowerCase() !== value,
            containsLower: value.toUpperCase() !== value,
            containsSpecial: value.match(
                /=+|\++|-+|\^+|\$+|\*+|\.+|\[+|\]+|{+|}+|\(+|\)+|\?+|"+|!+|@+|#+|%+|&+|\/+|\\+|,+|>+|<+|'+|:+|;+|\|+|_+|~+|`+/g
            )
                ? true
                : false,
            passesMinLength: value.length >= minLength,
        });
        setNewPassword(value);
    };

    const handleConfirmNewPasswordChange = (e, { value }) => {
        setConfirmNewPassword(value);
    };

    const handleCountryCodeChange = (e, { value }) => {
        setCountryCode(value);
    };

    const handlePhoneNumberChange = (e, { value }) => {
        setPhoneNumber(value);
    };

    const handleFirstNameChange = (e, { value }) => {
        setFirstName(value);
    };

    const handleMiddleNameChange = (e, { value }) => {
        setMiddleName(value);
    };

    const handleLastNameChange = (e, { value }) => {
        setLastName(value);
    };

    const handleDobChange = (e, { value }) => {
        setDob(value);
    };

    const handleWorkplaceChange = (e, { value }) => {
        setWorkplace(value);
    };

    const handleBackupEmailChange = (e, { value }) => {
        setBackupEmail(value);
    };

    const handleStudentStatusChange = (e, { value }) => {
        setStudentStatus(value);
    };

    const handleDegreesCompletedChange = (e, { index, value }) => {
        const newDegreesCompleted = degreesCompleted;
        newDegreesCompleted[index] = value;
        setDegreesCompleted(newDegreesCompleted);
    };

    const handleDegreesInProgressChange = (e, { index, value }) => {
        const newDegreesInProgress = degreesInProgress;
        newDegreesInProgress[index] = value;
        setDegreesInProgress(newDegreesInProgress);
    };

    const handleSpecialtiesChange = (e, { index, value }) => {
        const newSpecialties = specialties;
        newSpecialties[index] = value;
        setSpecialties(newSpecialties);
    };

    const handleWorkplaceFeaturesChange = (e, { value }) => {
        setWorkplaceFeatures(value);
    };

    const handleSubmit = () => {
        const attributes = {
            phoneNumber: countryCode + phoneNumber.replace(/-|\(|\)/gi, ''),
            firstName,
            middleName,
            lastName,
            dob,
            workplace,
            inPatient: null,
            institutionType: '',
            address: '',
            backupEmail,
            role,
            studentStatus,
            degreesCompleted,
            degreesInProgress,
            specialties,
            workplaceFeatures,
        };

        const validationAttributes = {
            ...attributes,
            newPassword,
            confirmNewPassword,
        };

        yasaSchema
            .validate(validationAttributes, { abortEarly: false })
            .then(() => {
                onSubmit(newPassword, attributes);
            })
            .catch((err) => {
                setFormErrors(err.errors);
            });
    };

    const additionalFields = () => {
        if (role === 'healthcare professional') {
            return (
                <>
                    <label>Student status</label>
                    <Form.Group>
                        <Form.Radio
                            label='student'
                            value='y'
                            name='studentStatus'
                            checked={studentStatus === 'y'}
                            onChange={handleStudentStatusChange}
                        />
                        <Form.Radio
                            label='non-student'
                            value='n'
                            name='studentStatus'
                            checked={studentStatus === 'n'}
                            onChange={handleStudentStatusChange}
                        />
                    </Form.Group>
                    <label>Degrees completed</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Degrees-Completed'
                            options={degreeOptions}
                            value={degreesCompleted[0]}
                            name='degreesCompleted'
                            index={0}
                            onChange={handleDegreesCompletedChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Degrees-Completed'
                            options={degreeOptions}
                            value={degreesCompleted[1]}
                            name='degreesCompleted'
                            index={1}
                            onChange={handleDegreesCompletedChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Degrees-Completed'
                            options={degreeOptions}
                            value={degreesCompleted[2]}
                            name='degreesCompleted'
                            index={2}
                            onChange={handleDegreesCompletedChange}
                        />
                    </Form.Group>
                    <label>Degrees in progress</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Degrees-In-Progress'
                            options={degreeOptions}
                            value={degreesInProgress[0]}
                            name='degreesInProgress'
                            index={0}
                            onChange={handleDegreesInProgressChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Degrees-In-Progress'
                            options={degreeOptions}
                            value={degreesInProgress[1]}
                            name='degreesInProgress'
                            index={1}
                            onChange={handleDegreesInProgressChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Degrees-In-Progress'
                            options={degreeOptions}
                            value={degreesInProgress[2]}
                            name='degreesInProgress'
                            index={2}
                            onChange={handleDegreesInProgressChange}
                        />
                    </Form.Group>
                    <label>Specialties</label>
                    <Form.Group>
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Specialties'
                            options={specialtyOptions}
                            value={specialties[0]}
                            name='specialties'
                            index={0}
                            onChange={handleSpecialtiesChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Specialties'
                            options={specialtyOptions}
                            value={specialties[1]}
                            name='specialties'
                            index={1}
                            onChange={handleSpecialtiesChange}
                        />
                        <Form.Dropdown
                            search
                            selection
                            clearable
                            aria-label='Specialties'
                            options={specialtyOptions}
                            value={specialties[2]}
                            name='specialties'
                            index={2}
                            onChange={handleSpecialtiesChange}
                        />
                    </Form.Group>
                    <Form.Input
                        fluid
                        aria-label='Workplace'
                        label='Workplace'
                        placeholder='workplace'
                        name='workplace'
                        value={workplace}
                        onChange={handleWorkplaceChange}
                        required
                    />
                    <Form.Dropdown
                        aria-label='Workplace-Features'
                        label='Workplace features'
                        selection
                        multiple
                        options={workfeatOptions}
                        value={workplaceFeatures}
                        name='workplaceFeatures'
                        onChange={handleWorkplaceFeaturesChange}
                    />
                    <DemographicsForm
                        race={[]}
                        asian={[]}
                        otherRace={[]}
                        ethnicity=''
                        otherEthnicity={[]}
                        gender=''
                    />
                </>
            );
        }

        if (role === 'patient') {
            return (
                <DemographicsForm
                    race={[]}
                    asian={[]}
                    otherRace={[]}
                    ethnicity=''
                    otherEthnicity={[]}
                    gender=''
                />
            );
        }
    };

    const passwordErrors = {
        containsNumber: 'Must contain at least one number.',
        containsUpper: 'Must contain at least one uppercase character.',
        containsLower: 'Must contain at least one lowercase character.',
        containsSpecial:
            'Must contain at least one of the following special characters: = + - ^ $ * . [ ] { } ( ) ? " ! @ # % & / \\ , > < \' : ; | _ ~ `',
        passesMinLength: `Must be at least ${
            role === 'manager' || role === 'healthcare manager' ? '25' : '16'
        } characters.`,
    };

    const passwordErrorMessages = () => {
        const errMsgs = [];
        for (const err in passwordErrors) {
            if (!passwordReqs[err]) {
                errMsgs.push(
                    <Message.Item key={err} content={passwordErrors[err]} />
                );
            }
        }

        return errMsgs;
    };

    return (
        <>
            <div className='nav-menu-container'>
                <NavMenu />
            </div>
            <Container className='sign-up'>
                <Segment clearing>
                    <Container textAlign='center'>
                        <Image size='tiny' href='/' src={Logo} alt='logo' />
                        <Header
                            as='h1'
                            className='logo-text'
                            content='Cydoc'
                            alt='logo'
                        />
                    </Container>
                    <Container
                        className='login-header'
                        color='black'
                        textAlign='center'
                        content='Finish setting up your account'
                    />
                    <Form
                        size='small'
                        onSubmit={handleSubmit}
                        error={
                            formErrors.length > 0 ||
                            passwordErrorMessages().length > 0
                        }
                    >
                        <Divider section />
                        <Form.Input
                            fluid
                            aria-label='New-Password'
                            type='password'
                            label='New password'
                            name='newPassword'
                            placeholder='new password'
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />
                        <Form.Input
                            fluid
                            aria-label='Confirm-New-Password'
                            type='password'
                            label='Confirm new password'
                            name='confirmNewPassword'
                            placeholder='confirm new password'
                            value={confirmNewPassword}
                            onChange={handleConfirmNewPasswordChange}
                        />
                        {passwordErrorMessages().length > 0 && (
                            <Message
                                error
                                header='Password must satisfy the following requirements:'
                                list={passwordErrorMessages()}
                            />
                        )}
                        <Divider section />
                        <Form.Group>
                            <Form.Input
                                fluid
                                aria-label='First-Name'
                                label='First name'
                                placeholder='first name'
                                name='firstName'
                                value={firstName}
                                onChange={handleFirstNameChange}
                            />
                            <Form.Input
                                fluid
                                aria-label='Middle-Name'
                                label='Middle name'
                                placeholder='middle name'
                                name='middleName'
                                value={middleName}
                                onChange={handleMiddleNameChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Input
                                fluid
                                aria-label='Last-Name'
                                label='Last name'
                                placeholder='last name'
                                name='lastName'
                                value={lastName}
                                onChange={handleLastNameChange}
                            />
                            <Form.Input
                                fluid
                                aria-label='Date-Of-Birth'
                                label='Date of birth'
                                placeholder='date of birth'
                                name='dob'
                                type='date'
                                value={dob}
                                onChange={handleDobChange}
                            />
                        </Form.Group>
                        <Form.Input
                            fluid
                            aria-label='Backup-Email'
                            type='email'
                            label='Backup email'
                            placeholder='name@example.com'
                            name='backupEmail'
                            value={backupEmail}
                            onChange={handleBackupEmailChange}
                        />
                        <Form.Group>
                            <Form.Select
                                fluid
                                label='Code'
                                options={[
                                    { key: 'US', text: '+1', value: '+1' },
                                ]}
                                placeholder='+1'
                                value={countryCode}
                                onChange={handleCountryCodeChange}
                                width={5}
                            />
                            <Form.Input
                                fluid
                                type='tel'
                                aria-label='Phone-Number'
                                label='Phone number'
                                placeholder='phone number'
                                name='phoneNumber'
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                            />
                        </Form.Group>
                        {additionalFields()}
                        {formErrors.length > 0 && (
                            <Message
                                error
                                header='Error!'
                                content={formErrors.map((m) => (
                                    <Message.Item key={m}>{m}</Message.Item>
                                ))}
                            />
                        )}
                        <Grid padded>
                            <Grid.Row>
                                <Grid.Column textAlign='right'>
                                    <Button
                                        color='teal'
                                        size='small'
                                        aria-label='Finish-Setting-Up-Account'
                                        content='Finish'
                                        disabled={
                                            passwordErrorMessages().length > 0
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Segment>
            </Container>
        </>
    );
};

export default FirstTimeLogin;
