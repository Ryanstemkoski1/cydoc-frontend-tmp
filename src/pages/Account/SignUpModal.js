import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import DoctorSignUp from './DoctorSignUp';
import './Account.css';

const SignUpModal = ({ navToSignUp }) => {
    const [isActive, setActive] = useState(navToSignUp);
    const [continueActive, setContinueActive] = useState(false);

    return (
        <>
            {(() => {
                if (continueActive) {
                    return <DoctorSignUp continueIsActive={continueActive} />;
                } else {
                    return (
                        <Modal
                            dimmer='inverted'
                            size='tiny'
                            onClose={() => {
                                setActive(false);
                                setContinueActive(false);
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
                                        First month $0, then $9/month. Cancel
                                        any time.
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
                    );
                }
            })()}
        </>
    );
};

export default SignUpModal;
