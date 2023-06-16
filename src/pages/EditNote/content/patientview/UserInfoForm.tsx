import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    UpdateUserInfo,
    ValidateUserInfo,
    updateUserInfo,
    validateUserInfo,
} from 'redux/actions/additionalSurveyActions';
import { CurrentNoteState } from 'redux/reducers';
import { UserInfo } from 'redux/reducers/additionalSurveyReducer';
import {
    CheckboxProps,
    Dropdown,
    DropdownProps,
    Form,
    Message,
} from 'semantic-ui-react';
import { formValidation } from './validation';

const RACE_OPTION = [
    {
        text: 'American Indian or Alaska Native',
        value: 'American Indian or Alaska Native',
    },
    { text: 'Asian', value: 'Asian' },
    { text: 'Black or African American', value: 'Black or African American' },
    {
        text: 'Native Hawaiian or Other Pacific Islander',
        value: 'Native Hawaiian or Other Pacific Islander',
    },
    { text: 'White', value: 'White' },
];
const GENDER_IDENTITY_OPTION = [
    { text: 'Woman', value: 'Woman' },
    { text: 'Man', value: 'Man' },
    { text: 'Transgender', value: 'Transgender' },
    { text: 'Genderqueer/Non-Binary', value: 'Genderqueer/Non-Binary' },
];

const RELATIONSHIP_TO_PARENT = [
    { text: 'Self', value: 'Self' },
    { text: 'Spouse', value: 'Spouse' },
    { text: 'Parent/Guardian', value: 'Parent/Guardian' },
    { text: 'Other', value: 'Other' },
];

const UserInfoForm = (props: UserInfoFormProps & DispatchProps) => {
    const {
        userInfo,
        isUserInfoValid,
        updateUserInfo,
        validateUserInfo,
    } = props;

    const [message, setMessage] = useState('');

    const handleChange = (
        key: string,
        parent: 'address' | 'insuranceInfo' | undefined,
        value:
            | string
            | boolean
            | (string | boolean | number)[]
            | number
            | undefined
    ) => {
        if (parent) {
            const updated: UserInfo = {
                ...userInfo,
                [parent]: { ...userInfo[parent], [key]: value },
            };

            updateUserInfo(updated);
        } else {
            const updated: UserInfo = {
                ...userInfo,
                [key]: value,
            };
            updateUserInfo(updated);
        }
        return;
    };
    const validateForm = async () => {
        try {
            await formValidation.validate(userInfo);
            validateUserInfo(true);
            setMessage('');
        } catch (e) {
            if (e instanceof Error) {
                setMessage(e.message ?? '');
            }
            validateUserInfo(false);
        }
    };

    return (
        <div className='sixteen wide column'>
            <Form size='small'>
                {!isUserInfoValid && (
                    <Message negative>
                        <Message.Header> {message} </Message.Header>
                    </Message>
                )}
                <h4>Personal Information</h4>
                <div className='equal width fields'>
                    <Form.Input
                        fluid
                        aria-label='Phone number'
                        label='Phone Number'
                        name='cell phone number'
                        value={userInfo.cellPhoneNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(
                                'cellPhoneNumber',
                                undefined,
                                e.target.value
                            )
                        }
                        type='number'
                        onBlur={validateForm}
                    />
                    <Form.Input
                        fluid
                        aria-label='email-address'
                        label='Email Address'
                        name='emailAddress'
                        value={userInfo.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange('email', undefined, e.target.value)
                        }
                        onBlur={validateForm}
                    />
                </div>

                {/* <h4>Your Address</h4> */}
                <div className='equal width fields'>
                    <Form.Input
                        fluid
                        aria-label='Address line 1'
                        label='Address Line 1'
                        name='Address line 1'
                        value={userInfo.address.addressLine1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(
                                'addressLine1',
                                'address',
                                e.target.value
                            )
                        }
                    />
                    <Form.Input
                        fluid
                        aria-label='Address line 2'
                        label='Address Line 2'
                        name='Address line 2'
                        value={userInfo.address.addressLine2}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(
                                'addressLine2',
                                'address',
                                e.target.value
                            )
                        }
                    />
                </div>
                <div className='equal width fields'>
                    <Form.Input
                        fluid
                        aria-label='city'
                        label='City'
                        name='city'
                        value={userInfo.address.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange('city', 'address', e.target.value)
                        }
                        onBlur={validateForm}
                    />
                    <Form.Input
                        fluid
                        aria-label='state'
                        label='State'
                        name='state'
                        value={userInfo.address.state}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange('state', 'address', e.target.value)
                        }
                        onBlur={validateForm}
                    />
                </div>
                <div className='equal width fields width-50-desktop'>
                    <Form.Input
                        fluid
                        aria-label='zipcode'
                        label='Zip Code'
                        name='zipcode'
                        type='number'
                        value={userInfo.address.zipCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange('zipCode', 'address', e.target.value)
                        }
                        onBlur={validateForm}
                    />
                </div>

                <div className='equal width fields'>
                    <Form.Field>
                        <h4 className='user-info-labels'>Race</h4>
                        <Dropdown
                            fluid
                            multiple
                            placeholder={'Choose to select'}
                            selection
                            options={RACE_OPTION}
                            value={userInfo.race}
                            onChange={(
                                e: React.SyntheticEvent<HTMLElement>,
                                data: DropdownProps
                            ) => handleChange('race', undefined, data?.value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <h4 className='user-info-labels'>Gender Identity</h4>
                        <Dropdown
                            fluid
                            multiple
                            selection
                            options={GENDER_IDENTITY_OPTION}
                            value={userInfo.genderIdentity}
                            placeholder={'Choose to select'}
                            onChange={(
                                e: React.SyntheticEvent<HTMLElement>,
                                data: DropdownProps
                            ) =>
                                handleChange(
                                    'genderIdentity',
                                    undefined,
                                    data?.value
                                )
                            }
                        />
                    </Form.Field>
                </div>

                <div className='equal width fields'>
                    <div className='fluid width-100 form radio-wrapper'>
                        <h4 className='user-info-labels'>Ethnicity</h4>
                        <div className='flex flex-wrap'>
                            <Form.Field>
                                <Form.Radio
                                    label='Hispanic or Latino'
                                    name='ethnicity'
                                    value='Hispanic or Latino'
                                    checked={
                                        userInfo.ethnicity ===
                                        'Hispanic or Latino'
                                    }
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'ethnicity',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='Not Hispanic or Latino'
                                    name='ethnicity'
                                    value='Not Hispanic or Latino'
                                    checked={
                                        userInfo.ethnicity ===
                                        'Not Hispanic or Latino'
                                    }
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'ethnicity',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                        </div>
                    </div>
                </div>
                <div className='equal width fields'>
                    <div className='width-100 form radio-wrapper'>
                        <h4 className='user-info-labels'>
                            Sex Assigned at Birth
                        </h4>
                        <div className='flex flex-wrap'>
                            <Form.Field>
                                <Form.Radio
                                    label='Female'
                                    name='sex'
                                    value='female'
                                    checked={userInfo.sex === 'female'}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'sex',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='Male'
                                    name='sex'
                                    value='male'
                                    checked={userInfo.sex === 'male'}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'sex',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                        </div>
                    </div>
                </div>
                <div className='equal width fields'>
                    <div className='width-100 form radio-wrapper'>
                        <h4 className='user-info-labels'>Preferred Pronouns</h4>
                        <div className='flex flex-wrap'>
                            <Form.Field>
                                <Form.Radio
                                    label='She/Her'
                                    name='preferredPronouns'
                                    value='She/Her'
                                    checked={
                                        userInfo.preferredPronouns === 'She/Her'
                                    }
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'preferredPronouns',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='He/Him'
                                    name='preferredPronouns'
                                    value='He/Him'
                                    checked={
                                        userInfo.preferredPronouns === 'He/Him'
                                    }
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'preferredPronouns',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='They/Them'
                                    name='preferredPronouns'
                                    value='They/Them'
                                    checked={
                                        userInfo.preferredPronouns ===
                                        'They/Them'
                                    }
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'preferredPronouns',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                        </div>
                    </div>
                </div>

                <div className='equal width fields'>
                    <div className='width-100 form radio-wrapper'>
                        <h4 className='user-info-labels'>Title:</h4>
                        <div className='flex flex-wrap'>
                            <Form.Field>
                                <Form.Radio
                                    label='Mr.'
                                    name='title'
                                    value='Mr.'
                                    checked={userInfo.title === 'Mr.'}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'title',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='Ms.'
                                    name='title'
                                    value='Ms.'
                                    checked={userInfo.title === 'Ms.'}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'title',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='Mrs.'
                                    name='title'
                                    value='Mrs.'
                                    checked={userInfo.title === 'Mrs.'}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'title',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='Miss'
                                    name='title'
                                    value='Miss'
                                    checked={userInfo.title === 'Miss'}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'title',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='Mx'
                                    name='title'
                                    value='MX'
                                    checked={userInfo.title === 'MX'}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'title',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.Radio
                                    label='Dr.'
                                    name='title'
                                    value='Dr.'
                                    checked={userInfo.title === 'Dr.'}
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>,
                                        data: CheckboxProps
                                    ) =>
                                        handleChange(
                                            'title',
                                            undefined,
                                            data.value
                                        )
                                    }
                                />
                            </Form.Field>
                        </div>
                    </div>
                </div>

                <hr className='section-break' />

                <h4>Insurance Information</h4>
                <div className='equal width fields'>
                    <Form.Checkbox
                        aria-label='Are you insured?'
                        label='Are you Insured?'
                        name='insured'
                        checked={userInfo.isInsured}
                        onChange={() =>
                            handleChange(
                                'isInsured',
                                undefined,
                                !userInfo.isInsured
                            )
                        }
                    />
                </div>
                {userInfo.isInsured && (
                    <>
                        <div className='equal width fields'>
                            <Form.Input
                                fluid
                                aria-label='Insurance company'
                                label='Insurance Company'
                                name='Insurance company'
                                value={
                                    userInfo.insuranceInfo.insuranceCompanyName
                                }
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        'insuranceCompanyName',
                                        'insuranceInfo',
                                        e.target.value
                                    )
                                }
                            />

                            <Form.Input
                                fluid
                                // required
                                aria-label='Insurance company phone number'
                                label='Insurance Company Phone Number'
                                name='Insurance company phone number'
                                value={
                                    userInfo.insuranceInfo
                                        .insuranceCompanyPhoneNumber
                                }
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        'insuranceCompanyPhoneNumber',
                                        'insuranceInfo',
                                        e.target.value
                                    )
                                }
                                type='number'
                                onBlur={validateForm}
                            />
                        </div>
                        <div className='equal width fields'>
                            <Form.Input
                                fluid
                                aria-label='Policy holders name'
                                label="Policy Holder's Name"
                                name='Policy holders name'
                                value={userInfo.insuranceInfo.policyHolderName}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        'policyHolderName',
                                        'insuranceInfo',
                                        e.target.value
                                    )
                                }
                            />
                            <Form.Input
                                fluid
                                type='date'
                                aria-label='Policy holders date of birth'
                                label="Policy Holder's Date of Birth"
                                name='Policy holders date of birth'
                                value={userInfo.insuranceInfo.policyHolderDOB}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        'policyHolderDOB',
                                        'insuranceInfo',
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <Form.Field>
                            <label>
                                Policy Holder&apos;s Relationship to Patient
                            </label>
                            <div className='equal width fields width-50-desktop'>
                                <Form.Select
                                    options={RELATIONSHIP_TO_PARENT}
                                    value={
                                        userInfo.insuranceInfo
                                            .policyHolderRelationship
                                    }
                                    placeholder={'Choose to select'}
                                    onChange={(
                                        e: React.SyntheticEvent<HTMLElement>,
                                        data: DropdownProps
                                    ) =>
                                        handleChange(
                                            'policyHolderRelationship',
                                            'insuranceInfo',
                                            data.value
                                        )
                                    }
                                />
                            </div>
                        </Form.Field>

                        <div className='equal width fields'>
                            <Form.Checkbox
                                aria-label='Is policy holder employed?'
                                label='Is Policy Holder Employed?'
                                name='Is policy holder employed?'
                                checked={
                                    userInfo.insuranceInfo.policyHolderEmployed
                                }
                                onChange={() =>
                                    handleChange(
                                        'policyHolderEmployed',
                                        'insuranceInfo',
                                        !userInfo.insuranceInfo
                                            .policyHolderEmployed
                                    )
                                }
                            />
                        </div>
                        {userInfo.insuranceInfo.policyHolderEmployed && (
                            <div className='equal width fields width-50-desktop'>
                                <Form.Input
                                    fluid
                                    aria-label='Policy holders employer'
                                    label="Policy Holder's Employer"
                                    name='Policy holders employer'
                                    value={
                                        userInfo.insuranceInfo
                                            .policyHolderEmployer
                                    }
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        handleChange(
                                            'policyHolderEmployer',
                                            'insuranceInfo',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        )}

                        <div className='equal width fields'>
                            <Form.Input
                                fluid
                                // required
                                aria-label='Policy holders SSN'
                                label="Policy Holder's SSN#"
                                name='Policy holders SSN'
                                value={userInfo.insuranceInfo.policyHolderSSN}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        'policyHolderSSN',
                                        'insuranceInfo',
                                        e.target.value
                                    )
                                }
                                onBlur={validateForm}
                                type='number'
                            />

                            <Form.Input
                                fluid
                                aria-label='Policy holders Id'
                                label="Policy Holder's ID#"
                                name='Policy holders Id'
                                value={userInfo.insuranceInfo.policyHolderID}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        'policyHolderID',
                                        'insuranceInfo',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className='equal width fields width-50-desktop'>
                            <Form.Input
                                fluid
                                aria-label='Policy holders Group'
                                label='Group#'
                                name='Policy holders Group'
                                value={userInfo.insuranceInfo.group}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(
                                        'group',
                                        'insuranceInfo',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
};

const mapDispatchToProps = {
    updateUserInfo,
    validateUserInfo,
};

export interface UserInfoFormProps {
    userInfo: UserInfo;
    isUserInfoValid: boolean;
}

interface DispatchProps {
    updateUserInfo: (userInfo: UserInfo) => UpdateUserInfo;
    validateUserInfo: (isValid: boolean) => ValidateUserInfo;
}

const mapStateToProps = (state: CurrentNoteState): UserInfoFormProps => {
    return {
        userInfo: state.additionalSurvey.userInfo,
        isUserInfoValid: state.additionalSurvey.isUserInfoValid,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoForm);
