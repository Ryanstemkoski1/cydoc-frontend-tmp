import React from 'react';
import { ErrorMessage, Field, Formik, FormikHelpers } from 'formik';
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
import { ErrorText } from 'components/Atoms/ErrorText';

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

interface LoginSchema {
    email: string;
    password: string;
    role: DbUser['role'];
    loginError?: string;
}

const Login = () => {
    const { signIn } = useAuth();

    const onSubmit = async (
        values: LoginSchema,
        { setErrors, setSubmitting }: FormikHelpers<LoginSchema>
    ) => {
        setErrors({});
        setSubmitting(true);
        const { errorMessage, user } = await signIn(
            values.email,
            values.password
        );
        if (errorMessage?.length) {
            setErrors({ loginError: errorMessage });
        }
        // successful logins should be handled by the hook/routes logic

        setSubmitting(false);
    };

    return (
        <>
            <Formik<LoginSchema>
                initialValues={{
                    email: '',
                    password: '',
                    role: 'manager',
                }}
                onSubmit={onSubmit}
                validateOnChange={true}
                validationSchema={validationSchema}
            >
                {({ errors, submitForm }) => (
                    <div>
                        <Container textAlign='center'>
                            <Image size='tiny' href='/' src={Logo} alt='logo' />
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
                            content='Login'
                        />
                        <Field
                            name='email'
                            margin='normal'
                            required
                            fullWidth
                            label='Email'
                            id='email'
                            type='input'
                            as={TextField}
                            variant='outlined'
                        />
                        <Field
                            fullWidth
                            name='password'
                            margin='normal'
                            autoComplete='current-password'
                            required
                            label='Password'
                            type='password'
                            id='password'
                            as={TextField}
                            variant='outlined'
                        />
                        <FormControl>
                            <FormLabel id='demo-radio-buttons-group-label'>
                                I am a:
                            </FormLabel>
                            <RadioGroup
                                defaultValue='manager'
                                name='radio-buttons-group'
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                }}
                            >
                                <FormControlLabel
                                    value='clinician'
                                    name='role'
                                    control={<Radio />}
                                    label='Healthcare Professional'
                                />
                                <FormControlLabel
                                    value='manager'
                                    name='role'
                                    label='Manager'
                                    control={<Radio />}
                                />
                            </RadioGroup>
                        </FormControl>
                        <Grid align='middle'>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Link
                                        style={{ color: '#007db3' }}
                                        to='/forgotpasswordemail'
                                        className='forgot-password-button'
                                    >
                                        Forgot Password?
                                    </Link>
                                </Grid.Column>
                                <Grid.Column textAlign='right'>
                                    <Button
                                        color='teal'
                                        size='small'
                                        type='submit'
                                        aria-label='login-button'
                                        content='Login'
                                        onClick={submitForm}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <ErrorText
                            key={'loginError'}
                            message={errors?.loginError || null}
                        />
                    </div>
                )}
            </Formik>
        </>
    );
};

export default Login;
