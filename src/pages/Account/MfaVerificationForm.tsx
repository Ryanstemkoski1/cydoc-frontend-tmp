import React from 'react';
import { Field, Formik, FormikHelpers } from 'formik';
import { TextField } from '@mui/material';

import NavMenu from '../../components/navigation/NavMenu';
import './Account.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import {
    Segment,
    Button,
    Container,
    Image,
    Header,
    Grid,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/cydoc-logo.svg';
import './Account.css';
import * as Yup from 'yup';
import { useAuth } from 'hooks/useAuth';
import { DbUser } from 'types/users';

const validationSchema = Yup.object({
    email: Yup.string()
        .label('Email')
        .trim()
        .required('Email is required')
        .min(1),
    password: Yup.string()
        .label('Password')
        .trim()
        .required('Password is required')
        .min(6), // TODO: link up min with ACTUAL password minimum
});

interface VerifyCodeSchema {
    code: string;
    mfaError?: string;
}

const Login = () => {
    const { verifyMfaCode } = useAuth();

    const onSubmit = async (
        { code }: VerifyCodeSchema,
        { setErrors, setSubmitting }: FormikHelpers<VerifyCodeSchema>
    ) => {
        setSubmitting(true);
        setErrors({}); // blow out errors before re-submitting

        const { errorMessage, user } = await verifyMfaCode(code);

        if (errorMessage?.length) {
            setErrors({ mfaError: errorMessage });
        }
        // successful logins should be handled by the hook/routes logic

        setSubmitting(false);
    };

    return (
        <>
            <NavMenu className={''} attached={'top'} displayNoteName={false} />
            <Formik<VerifyCodeSchema>
                initialValues={{
                    code: '',
                }}
                onSubmit={onSubmit}
                validateOnChange={true}
                validationSchema={validationSchema}
            >
                {({ errors, submitForm }) => (
                    <div>
                        <Container className='login'>
                            <Segment clearing>
                                <Container textAlign='center'>
                                    <Image
                                        size='tiny'
                                        href='/'
                                        src={Logo}
                                        alt='logo'
                                    />
                                    <Header
                                        as='h1'
                                        className='logo-text'
                                        content='Cydoc'
                                    />
                                </Container>
                                <Container
                                    className='login-header'
                                    color='black'
                                    textAlign='center'
                                    content='Verify Code'
                                />
                                <Container
                                    className='login-header'
                                    color='black'
                                    textAlign='center'
                                    content='Enter SMS code received'
                                />
                                <Field
                                    name='code'
                                    margin='normal'
                                    required
                                    fullWidth
                                    label='SMS Code'
                                    id='code'
                                    type='input'
                                    as={TextField}
                                    variant='outlined'
                                />
                                <Grid align='middle'>
                                    <Grid.Row columns={1}>
                                        <Button
                                            color='teal'
                                            size='small'
                                            type='submit'
                                            aria-label='login-button'
                                            content='Confirm'
                                            onClick={submitForm}
                                        />
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Container>
                    </div>
                )}
            </Formik>
        </>
    );
};

export default Login;
