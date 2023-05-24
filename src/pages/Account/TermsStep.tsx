import React from 'react';

import './Account.css';
import {
    Button,
    Container,
    Form,
    Modal,
    Header,
    Divider,
} from 'semantic-ui-react';
import Terms_and_conditions from 'constants/Documents/terms_and_conditions';

const cssCheckBoxes =
    '.checkBox { vertical-align: middle; line-height: 5px; min-width: 5px; display:flex; align-content:middle; flex:1; justify-content: center; }';
const cssScroll = '.scroll { max-height: 240px; overflow-y: scroll; }';
const cssRightCheckBox = '.rCheckBox { float:right }';

export function TermsStep() {
    return (
        <>
            <Modal.Header>Terms of Use</Modal.Header>
            <Modal.Content>
                {/* <Form error={passwordErrorMessages().length > 0}>
                    <Container>
                        <Header as='h5' textAlign='center' content='' />
                        <div className='scroll'>
                            <style> {cssScroll} </style>
                            <Terms_and_conditions title={true} />
                        </div>
                        <Divider section />
                        <div
                            className='checkBox'
                            style={{ textAlign: 'right' }}
                        >
                            <style> {cssCheckBoxes} </style>
                            <div className='rCheckBox'>
                                <style>{cssRightCheckBox}</style>
                                <Form.Input
                                    required
                                    label='Agree To Terms of Use'
                                    name='term'
                                    type='checkbox'
                                    checked={isTermsChecked}
                                    onClick={() => {
                                        setIsTermsChecked(!isTermsChecked);
                                    }}
                                />
                            </div>
                        </div>
                    </Container>
                    <Container className='modal-button-container'>
                        <Button
                            basic
                            color='teal'
                            content='Cancel'
                            type='button'
                            onClick={() => {
                                setIsInviteDoctorOpen(false);
                                reloadModal();
                            }}
                        />
                        <Button
                            color='teal'
                            content='Prev'
                            type='button'
                            onClick={(e) => {
                                onPrevClick(e);
                            }}
                        />
                        <Button
                            color='teal'
                            content='Next'
                            onClick={(e) => {
                                if (isSubmitValid(wizardPage)) {
                                    onNextClick(e);
                                }
                            }}
                        />
                    </Container>
                </Form> */}
            </Modal.Content>
        </>
    );
}
