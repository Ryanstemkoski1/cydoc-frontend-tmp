import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import './Account.css';
import ClinicianSignUpForm from './ClinicianSignUpForm';

interface SignupModalProps {
    navToSignUp: boolean;
    reloadModal: () => void;
}

const SignUpModal = (props: SignupModalProps) => {
    const [isActive, setActive] = useState(props.navToSignUp); // starts off true
    const [continueActive, setContinueActive] = useState(true);

    return (
        <>
            {continueActive ? (
                <ClinicianSignUpForm
                    sessionUserAttributes={null}
                    cognitoUser={null}
                />
            ) : (
                <Modal
                    dimmer='inverted'
                    size='tiny'
                    onClose={() => {
                        setActive(false);
                        setContinueActive(false);
                        props.reloadModal();
                    }}
                    onOpen={() => {
                        setActive(true);
                        setContinueActive(false);
                    }}
                    open={isActive}
                >
                    <Modal.Content>
                        <div id='signup-modal-div'>
                            <h3 id='signup-modal-title'>
                                Sign up for a free 30-day trial
                            </h3>
                            <p id='signup-modal-text'>
                                Write better notes, faster.
                            </p>
                            <p>
                                First month $0, then $9/month. Cancel any time.
                            </p>
                        </div>
                        <div id='signup-modal-btns'>
                            <Button
                                basic
                                color='teal'
                                content='Cancel'
                                type='button'
                                onClick={() => {
                                    setActive(false);
                                    props.reloadModal();
                                    setContinueActive(false);
                                }}
                            />
                            <Button
                                color='teal'
                                content='Continue'
                                type='button'
                                onClick={() => {
                                    setActive(false);
                                    setContinueActive(true);
                                }}
                            />
                        </div>
                    </Modal.Content>
                </Modal>
            )}
        </>
    );
};

export default SignUpModal;
