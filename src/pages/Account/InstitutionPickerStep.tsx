import React, { useEffect, useState } from 'react';

import './Account.css';
import { Container, Modal, Header, Loader } from 'semantic-ui-react';
import { SignUpFormData } from './SignUpForm';
import { useField } from 'formik';

export function InstitutionPickerStep() {
    const [loading, setLoading] = useState(false);
    const [{ value: firstName }] =
        useField<SignUpFormData['firstName']>('firstName');
    const [{ value: lastName }] =
        useField<SignUpFormData['lastName']>('lastName');

    return (
        <>
            <Modal.Header>Pick Institution</Modal.Header>
            <Modal.Content>
                {loading ? (
                    <Loader active inline='centered' />
                ) : (
                    <Container>
                        <Header as='h5' textAlign='center' content='' />
                        <div id='signup-modal-div'>
                            <p
                                style={{ textAlign: 'left' }}
                                id='signup-modal-text'
                            >
                                Which Institution do you work at?
                            </p>
                        </div>
                        <div
                            style={{
                                maxWidth: '350px',
                                marginTop: '15px',
                                marginBottom: '15px',
                                border: '1px solid grey',
                                borderRadius: '4px',
                                height: '400px',
                                padding: '10px 10px 0 10px',
                            }}
                        ></div>
                    </Container>
                )}
            </Modal.Content>
        </>
    );
}
