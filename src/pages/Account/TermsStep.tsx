import React, { useEffect } from 'react';

import './Account.css';
import { Container, Modal, Header, Divider } from 'semantic-ui-react';
import Terms_and_conditions from 'constants/Documents/terms_and_conditions';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Field, useField } from 'formik';
import { SignUpFormData } from './SignUpForm';

const cssCheckBoxes =
    '.checkBox { vertical-align: middle; line-height: 5px; min-width: 5px; display:flex; align-content:middle; flex:1; justify-content: center; }';
const cssScroll = '.scroll { max-height: 240px; overflow-y: scroll; }';
const cssRightCheckBox = '.rCheckBox { float:right }';

export function TermsStep() {
    const [{ value }, , helpers] = useField<SignUpFormData>('isTermsChecked');

    // here we set touched when the value changes,
    // so users don't need to click out of the checkbox for the form to be valid
    useEffect(() => {
        if (value) {
            helpers.setTouched(true, true);
        }
        // Don't include helpers here, causes infinite renders!
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <>
            <Modal.Header>Terms of Use</Modal.Header>
            <Modal.Content>
                {/* <Form error={passwordErrorMessages().length > 0}> */}
                <Container>
                    <Header as='h5' textAlign='center' content='' />
                    <div className='scroll'>
                        <style> {cssScroll} </style>
                        <Terms_and_conditions title={true} />
                    </div>
                    <Divider section />
                    <div className='checkBox' style={{ textAlign: 'right' }}>
                        <style> {cssCheckBoxes} </style>
                        <div className='rCheckBox'>
                            <style>{cssRightCheckBox}</style>
                            {/* <Form.Input
                                    onClick={() => {
                                        setIsTermsChecked(!isTermsChecked);
                                    }}
                                /> */}
                            <FormControlLabel
                                control={
                                    <Field
                                        name='isTermsChecked'
                                        margin='normal'
                                        required
                                        id='isTermsChecked'
                                        type='checkbox'
                                        as={Checkbox}
                                    />
                                }
                                label='Agree To Terms of Use'
                            />
                        </div>
                    </div>
                </Container>
            </Modal.Content>
        </>
    );
}
