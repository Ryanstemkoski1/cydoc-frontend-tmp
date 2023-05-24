import React from 'react';

import './Account.css';
import {
    Button,
    Container,
    Form,
    Modal,
    Header,
    Divider,
    Loader,
} from 'semantic-ui-react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

interface Props {
    onClose: () => void;
    onPrevClick: () => void;
    onNextClick: () => void;
}
export function NextBackButtonGroup({
    onClose,
    onNextClick,
    onPrevClick,
}: Props) {
    return (
        <Container className='modal-button-container'>
            <Button
                basic
                color='teal'
                content='Cancel'
                type='button'
                onClick={onClose}
            />
            <Button
                color='teal'
                content='Prev'
                type='button'
                onClick={onPrevClick}
            />
            <Button color='teal' content='Next' onClick={onNextClick} />
        </Container>
    );
}
