import React, { useState, useEffect } from 'react';
import { Form, Message, Loader } from 'semantic-ui-react';
import * as yup from 'yup';
import constants from 'constants/registration-constants.json';
import DemographicsForm from 'components/tools/DemographicsForm';
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

const createSchema = async (role) => {
    if (role === 'doctor') {
        return yup.object().shape({
            countryCode: yup
                .string()
                .oneOf(['+1'], 'only US phone numbers allowed'),
            phoneNumber: yup
                .string()
                .matches(/^\d{10,20}$/, 'phone number must be valid'),
            isStudent: yup.string().when('role', {
                is: 'healthcare professional',
                then: yup
                    .string()
                    .required('please specify your student status'),
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
                                return (
                                    item !== '' && arr.indexOf(item) !== index
                                );
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
                                return (
                                    item !== '' && arr.indexOf(item) !== index
                                );
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
                                return (
                                    item !== '' && arr.indexOf(item) !== index
                                );
                            }).length === 0
                        );
                    }
                ),
        });
    } else if (role === 'manager') {
        return yup.object().shape({
            countryCode: yup
                .string()
                .oneOf(['+1'], 'only US phone numbers allowed'),
            phoneNumber: yup
                .string()
                .matches(
                    /^\d{10}$/,
                    'phone number must be a valid US phone number'
                ),
        });
    }
};

const UserForm = (props) => {
    const [userInfo, setUserInfo] = useState(props.userInfo);
    const [isSendingInfo, setIsSendingInfo] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    useEffect(() => {
        setUserInfo(props.userInfo);
    }, [props]);

    const handleChange = (e, { name, value }) => {
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleIsPhoneNumberMobileChange = () => {
        setUserInfo({
            ...userInfo,
            phoneNumberIsMobile: !userInfo.phoneNumberIsMobile,
        });
    };

    const handleUSphoneNumberChange = () => {
        if (userInfo.countryCode == '+1') {
            setUserInfo({
                ...userInfo,
                countryCode: '',
            });
        } else {
            setUserInfo({
                ...userInfo,
                countryCode: '+1',
            });
        }
    };

    const handleArrayChange = (e, { name, index, value }) => {
        const newArray = [...userInfo[name]];
        newArray[index] = value;
        setUserInfo({
            ...userInfo,
            [name]: newArray,
        });
    };

    const handleSubmit = async () => {
        // dont send information to Cognito/Dynamo while currently sending
        if (isSendingInfo) {
            return;
        }

        setIsSendingInfo(true);
        const infoToValidate = {
            role: userInfo.role,
            countryCode: userInfo.countryCode,
            phoneNumber: userInfo.phoneNumber.replace(/-|\(|\)/gi, ''),
            isStudent: userInfo.isStudent,
            degreesCompleted: userInfo.degreesCompleted,
            degreesInProgress: userInfo.degreesInProgress,
            specialties: userInfo.specialties,
        };
        const validationSchema = await createSchema(userInfo.role);
        validationSchema
            .validate(infoToValidate, { abortEarly: false })
            .then(() => {
                setFormErrors([]);
                props.handleSubmit(userInfo);
            })
            .catch((err) => setFormErrors(err.errors));
        setIsSendingInfo(false);
    };

    const additionalFields = () => {
        if (userInfo.role === 'patient') {
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
        if (userInfo.role === 'doctor') {
            return (
                <>
                    <label className='label-font'>Student status</label>
                    <Form.Group inline widths='equal'>
                        <Form.Radio
                            label='student'
                            value='Yes'
                            name='isStudent'
                            checked={userInfo.isStudent === 'Yes'}
                            onChange={handleChange}
                        />
                        <Form.Radio
                            label='non-student'
                            value='No'
                            name='isStudent'
                            checked={userInfo.isStudent === 'No'}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <label className='label-font'>Degrees completed</label>
                    <Form.Group>
                        {[0, 1, 2].map((i) => {
                            return (
                                <Form.Dropdown
                                    key={i}
                                    search
                                    selection
                                    clearable
                                    name='degreesCompleted'
                                    aria-label='Degrees-Completed'
                                    options={degreeOptions}
                                    value={userInfo.degreesCompleted[i]}
                                    index={i}
                                    onChange={handleArrayChange}
                                />
                            );
                        })}
                    </Form.Group>
                    <label className='label-font'>Degrees in progress</label>
                    <Form.Group>
                        {[0, 1, 2].map((i) => {
                            return (
                                <Form.Dropdown
                                    key={i}
                                    search
                                    selection
                                    clearable
                                    name='degreesInProgress'
                                    aria-label='Degrees-In-Progress'
                                    options={degreeOptions}
                                    value={userInfo.degreesInProgress[i]}
                                    index={i}
                                    onChange={handleArrayChange}
                                />
                            );
                        })}
                    </Form.Group>
                    <label className='label-font'>Specialties</label>
                    <Form.Group>
                        {[0, 1, 2].map((i) => {
                            return (
                                <Form.Dropdown
                                    key={i}
                                    search
                                    selection
                                    clearable
                                    name='specialties'
                                    aria-label='Specialties'
                                    options={specialtyOptions}
                                    value={userInfo.specialties[i]}
                                    index={i}
                                    onChange={handleArrayChange}
                                />
                            );
                        })}
                    </Form.Group>
                </>
            );
        }
    };

    // show loader while retrieving info from Cognito/database
    if (!props.doneLoading) {
        return <Loader active inline='centered' />;
    }

    return (
        <Form
            size='small'
            onSubmit={handleSubmit}
            error={formErrors.length > 0}
        >
            <Form.Input
                fluid
                readOnly
                aria-label='Username'
                label='Username'
                placeholder='username'
                value={userInfo.username}
            />
            <Form.Group widths='equal'>
                <Form.Input
                    required
                    aria-label='First-Name'
                    label='First name'
                    placeholder='first name'
                    name='firstName'
                    value={userInfo.firstName}
                    onChange={handleChange}
                />
                <Form.Input
                    aria-label='Middle-Name'
                    label='Middle name'
                    placeholder='middle name'
                    name='middleName'
                    value={userInfo.middleName}
                    onChange={handleChange}
                />
                <Form.Input
                    required
                    aria-label='Last-Name'
                    label='Last name'
                    placeholder='last name'
                    name='lastName'
                    value={userInfo.lastName}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input
                    fluid
                    readOnly
                    width={6}
                    aria-label='Email'
                    type='email'
                    label='Email'
                    name='email'
                    placeholder='name@example.com'
                    value={userInfo.email}
                />
                <Form.Checkbox
                    required
                    width={2}
                    className='US-phone-checkbox'
                    label='U.S. phone number'
                    name='USphoneNumber'
                    checked={userInfo.countryCode}
                    onChange={handleUSphoneNumberChange}
                />
                <Form.Input
                    fluid
                    required
                    width={6}
                    type='tel'
                    aria-label='Phone-Number'
                    label='Phone number'
                    placeholder='phone number'
                    name='phoneNumber'
                    value={userInfo.phoneNumber}
                    onChange={handleChange}
                />
                <Form.Checkbox
                    width={2}
                    className='mobile-checkbox'
                    label='Mobile'
                    name='phoneNumberIsMobile'
                    checked={userInfo.phoneNumberIsMobile}
                    onChange={handleIsPhoneNumberMobileChange}
                />
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input
                    fluid
                    type='date'
                    name='birthday'
                    aria-label='Date-Of-Birth'
                    label='Date of birth'
                    placeholder='date of birth'
                    value={userInfo.birthday}
                    onChange={handleChange}
                />
            </Form.Group>
            {additionalFields()}
            <Message
                error
                header='Error!'
                content={formErrors.map((m) => (
                    <Message.Item key={m}>{m}</Message.Item>
                ))}
            />
            <Form.Button
                type='submit'
                color='teal'
                size='small'
                floated='right'
                aria-label={props.buttonAriaLabel}
                content={props.buttonText}
            />
        </Form>
    );
};

export default UserForm;
