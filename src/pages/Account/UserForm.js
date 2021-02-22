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
const workfeatOptions = constants.workplaceFeatures.map((workfeat) => ({
    key: workfeat,
    value: workfeat,
    text: workfeat,
}));

const schema = yup.object().shape({
    phoneNumber: yup
        .string()
        .matches(/^\+\d{10,20}$/, 'phone number must be valid'),
    studentStatus: yup.string().when('role', {
        is: 'healthcare professional',
        then: yup.string().required('please specify your student status'),
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
            isPhoneNumberMobile: !userInfo.isPhoneNumberMobile,
        });
    };

    const handleArrayChange = (e, { name, index, value }) => {
        const newArray = [...userInfo[name]];
        newArray[index] = value;
        setUserInfo({
            ...userInfo,
            [name]: newArray,
        });
    };

    const handleSubmit = () => {
        // dont send information to Cognito/Dynamo while currently sending
        if (isSendingInfo) {
            return;
        }

        setIsSendingInfo(true);
        const infoToValidate = {
            role: userInfo.role,
            phoneNumber:
                userInfo.countryCode +
                userInfo.phoneNumber.replace(/-|\(|\)/gi, ''),
            studentStatus: userInfo.studentStatus,
            degreesCompleted: userInfo.degreesCompleted,
            degreesInProgress: userInfo.degreesInProgress,
            specialties: userInfo.specialties,
        };
        schema
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
        if (userInfo.role === 'healthcare professional') {
            return (
                <>
                    <label className='label-font'>Student status</label>
                    <Form.Group inline widths='equal'>
                        <Form.Radio
                            label='student'
                            value='y'
                            name='studentStatus'
                            checked={userInfo.studentStatus === 'y'}
                            onChange={handleChange}
                        />
                        <Form.Radio
                            label='non-student'
                            value='n'
                            name='studentStatus'
                            checked={userInfo.studentStatus === 'n'}
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
                    <Form.Input
                        fluid
                        aria-label='Workplace'
                        label='Workplace'
                        placeholder='workplace'
                        name='workplace'
                        value={userInfo.workplace}
                        onChange={handleChange}
                        required
                    />
                    <Form.Dropdown
                        aria-label='Workplace-Features'
                        label='Workplace features'
                        selection
                        multiple
                        options={workfeatOptions}
                        value={userInfo.workplaceFeatures}
                        name='workplaceFeatures'
                        onChange={handleChange}
                    />
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
                <Form.Select
                    fluid
                    required
                    width={2}
                    label='Code'
                    options={[{ key: 'US', text: '+1', value: '+1' }]}
                    placeholder='+1'
                    name='countryCode'
                    value={userInfo.countryCode}
                    onChange={handleChange}
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
                    name='isPhoneNumberMobile'
                    checked={userInfo.isPhoneNumberMobile}
                    onChange={handleIsPhoneNumberMobileChange}
                />
            </Form.Group>
            <Form.Group widths='equal'>
                <Form.Input
                    fluid
                    type='date'
                    name='dob'
                    aria-label='Date-Of-Birth'
                    label='Date of birth'
                    placeholder='date of birth'
                    value={userInfo.dob}
                    onChange={handleChange}
                />
                <Form.Input
                    fluid
                    aria-label='Address'
                    label='Address'
                    placeholder='address'
                    name='address'
                    value={userInfo.address}
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
