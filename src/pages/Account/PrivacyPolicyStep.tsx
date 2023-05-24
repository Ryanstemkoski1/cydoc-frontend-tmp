import React from 'react';

import './Account.css';
import { Container, Form, Modal, Header, Divider } from 'semantic-ui-react';
import Policy from '../../constants/Documents/policy';
import { useField } from 'formik';
import { SignUpFormData } from './ClinicianSignUpForm';
const cssScroll = '.scroll { max-height: 240px; overflow-y: scroll; }';
const cssCheckBoxes =
    '.checkBox { vertical-align: middle; line-height: 5px; min-width: 5px; display:flex; align-content:middle; flex:1; justify-content: center; }';
const cssRightCheckBox = '.rCheckBox { float:right }';

export function PrivacyPolicyStep() {
    const [{ value: isPrivacyChecked }, , { setValue: setIsPrivacyChecked }] =
        useField<SignUpFormData['isPrivacyChecked']>('isPrivacyChecked');

    return (
        <>
            <Modal.Header>Privacy Policy</Modal.Header>
            <Modal.Content>
                <Form>
                    {/* <Form error={passwordErrorMessages().length > 0}> */}
                    <Container>
                        <Header as='h5' textAlign='center' content='' />
                        <div className='scroll'>
                            <style>{cssScroll}</style>
                            <Policy title={true} />
                        </div>
                        <Divider section />
                        <div className='checkBox'>
                            <style> {cssCheckBoxes} </style>
                            <div className='rCheckBox'>
                                <style>{cssRightCheckBox}</style>
                                <Form.Input
                                    required
                                    label='Agree To Privacy Policy'
                                    name='privacy'
                                    type='checkbox'
                                    checked={isPrivacyChecked}
                                    onClick={() => {
                                        setIsPrivacyChecked(!isPrivacyChecked);
                                    }}
                                />
                            </div>
                        </div>
                    </Container>
                    <Container className='modal-button-container'>
                        {/* <Button
                            basic
                            color='teal'
                            content='Cancel'
                            type='button'
                            onClick={() => {
                                setIsInviteDoctorOpen(false);
                                reloadModal();
                            }}
                        /> */}
                        {/* 
                        TODO: verify this logic is in step controller:
                        <Button
                            color='teal'
                            content='Prev'
                            type='button'
                            onClick={(e) => {
                                onPrevClick(e);
                            }}
                        />
                        {isPrivacyChecked && !isInvited && (
                            <Button
                                color='teal'
                                content='Submit'
                                onClick={createDoctor}
                            />
                        )}
                        {isPrivacyChecked && isInvited && (
                            <Button
                                color='teal'
                                content='Submit'
                                onClick={handleSubmit}
                            />
                        )} */}
                    </Container>
                </Form>
            </Modal.Content>
        </>
    );
}
