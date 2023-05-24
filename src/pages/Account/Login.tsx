import React, {
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from 'react';
import { Field, Formik } from 'formik';
import { TextField } from '@mui/material';

import { Redirect } from 'react-router';
import GetLogin from 'auth/login';
import { triggerEmailVerification, verifyEmail } from 'auth/verifyEmail';
import AuthContext from '../../contexts/AuthContext';
import NotesContext from '../../contexts/NotesContext';
import NavMenu from '../../components/navigation/NavMenu';
import './Account.css';
import isEmailVerified from 'auth/isEmailVerified';
import ClinicianSignUpForm from './ClinicianSignUpForm';
import { VerifyEmailForm } from './VerifyEmailForm';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import {
    Form,
    Segment,
    Button,
    Container,
    Image,
    Header,
    Grid,
    Modal,
    Input,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/cydoc-logo.svg';
import './Account.css';
import * as Yup from 'yup';
import { CognitoUser } from 'amazon-cognito-identity-js';

const validationSchema = Yup.object({
    username: Yup.string()
        .label('Username')
        .trim()
        .required('Username is required')
        .min(1),
    password: Yup.string()
        .label('Password')
        .trim()
        .required('Password is required')
        .min(6), // TODO: link up min with ACTUAL password minimum
});

const Login = () => {
    const context = useContext(AuthContext);
    const [role, setRole] = useState('doctor');
    const isMounted = useRef(true);
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [sessionUserAttributes, setSessionUserAttributes] = useState(null);
    const [emailVerified, setIsEmailVerified] = useState(false);
    const [cognitoUser, setCognitoUser] = useState<null | CognitoUser>(null);
    const [emailVerificationCode, setEmailVerificationCode] = useState('');
    const [emailVerificationChecked, setEmailVerificationChecked] =
        useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = useCallback(async () => {
        // don't login again while logging in
        if (isLoggingIn) {
            return;
        }

        // log user in
        setIsLoggingIn(true);
        const loginResponse = await GetLogin(username, password, role, context);

        // only update if still mounted
        if (isMounted.current) {
            if (loginResponse) {
                // update state after user has logged in
                setCognitoUser(loginResponse.currentUser);
                setSessionUserAttributes(loginResponse.userAttr);
                setIsFirstLogin(loginResponse.isFirstLoginFlag);
            }

            // finished logging in
            setIsLoggingIn(false);
        }
    }, [username, password, role, context, isLoggingIn]);

    // set isMounted to false when component is unmounted
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // TODO: add & verify types for auth context
    // @ts-expect-error the AuthContext module doesn't have typescript types yet...
    const authenticated = !!context?.token;

    const checkEmailVerification = useCallback(async () => {
        const emailVerified = await isEmailVerified(role);
        setIsEmailVerified(emailVerified);
        setEmailVerificationChecked(true);
        if (!emailVerified) {
            const cognitoUser = await triggerEmailVerification(username, role);
            if (cognitoUser) {
                setCognitoUser(cognitoUser);
            }
        }
    }, [role, username]);

    useEffect(() => {
        if (authenticated) {
            checkEmailVerification();
        }
    }, [authenticated, checkEmailVerification]);

    if (emailVerified && authenticated) {
        return (
            <NotesContext.Consumer>
                {(ctx) => {
                    // TODO: add & verify types for auth context
                    // @ts-expect-error the AuthContext module doesn't have typescript types yet...
                    ctx.loadNotes(context.user._id);
                    return <Redirect push to='/dashboard' />;
                }}
            </NotesContext.Consumer>
        );
    }

    const showEmailVerificationModal =
        !emailVerified && authenticated && emailVerificationChecked;

    if (isFirstLogin) {
        return (
            <ClinicianSignUpForm
                cognitoUser={cognitoUser}
                sessionUserAttributes={sessionUserAttributes}
            />
        );
    } else {
        return (
            <>
                <NavMenu
                    className={''}
                    attached={'top'}
                    displayNoteName={false}
                />
                <Modal open={showEmailVerificationModal}>
                    <VerifyEmailForm />
                </Modal>
                <Formik
                    initialValues={{ brandCode: '' }}
                    onSubmit={handleSubmit}
                    validateOnChange={true}
                    validationSchema={validationSchema}
                >
                    {({ errors, submitForm }) => (
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
                                    content='Login'
                                />
                                {/* <Field
                                name='brandCode'
                                label='Brand Code'
                                type='input'
                                as={TextField}
                                variant='outlined'
                                className={classes.textField}
                            />
                            <LoadingButton
                                disabled={!!errors.brandCode}
                                variant='contained'
                                type='submit'
                                onClick={() => submitForm()}
                                loading={isLoading}
                            >
                                Verify Code
                            </LoadingButton>
                            <p>
                                Have an account?
                                <Button onClick={() => logout()}>
                                    Sign In As Different User
                                </Button>
                            </p> */}
                                <Field
                                    name='username'
                                    label='Username'
                                    type='input'
                                    as={TextField}
                                    variant='outlined'
                                />
                                <Field
                                    name='password'
                                    label='Password'
                                    type='password'
                                    as={TextField}
                                    variant='outlined'
                                />
                                {/* <TextField
                                    id='filled-password-input'
                                    label='Password'
                                    type='password'
                                    autoComplete='current-password'
                                    variant='filled'
                                /> */}

                                <label className='role-label'>I am a:</label>
                                <FormControl>
                                    <FormLabel id='demo-radio-buttons-group-label'>
                                        I am a:
                                    </FormLabel>
                                    <RadioGroup
                                        aria-labelledby='demo-radio-buttons-group-label'
                                        defaultValue='female'
                                        name='radio-buttons-group'
                                    >
                                        <Field
                                            name='role'
                                            label='Clinician'
                                            value='clinician'
                                            type='radio'
                                            as={FormControlLabel}
                                            variant='outlined'
                                        />
                                        <Field
                                            name='role'
                                            value='manager'
                                            label='Manager'
                                            type='radio'
                                            as={Radio}
                                            variant='outlined'
                                        />
                                    </RadioGroup>
                                </FormControl>
                                <Form.Group>
                                    <Form.Radio
                                        label='healthcare professional'
                                        value='doctor'
                                        className='role'
                                        checked={role === 'doctor'}
                                        // onChange={handleRoleChange}
                                    />
                                    <Form.Radio
                                        label='manager'
                                        value='manager'
                                        className='role'
                                        checked={role === 'manager'}
                                        // onChange={handleRoleChange}
                                    />
                                </Form.Group>
                                <Grid verticalAlign='middle'>
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
                                                aria-label='login-button'
                                                content='Login'
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Container>
                    )}
                </Formik>
            </>
        );
    }
};

export default Login;
