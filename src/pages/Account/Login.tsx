import React, {
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from 'react';
import { Field, Formik } from 'formik';
import { TextField } from '@mui/material';

import GetLogin from 'auth/login';
import AuthContext from '../../contexts/AuthContext';
import NavMenu from '../../components/navigation/NavMenu';
import './Account.css';
import ClinicianSignUpForm from './ClinicianSignUpForm';
import { VerifyEmailModalForm } from './VerifyEmailModalForm';
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
    const isMounted = useRef(true);
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [sessionUserAttributes, setSessionUserAttributes] = useState(null);

    // TODO: put cognito user into hook
    const [cognitoUser, setCognitoUser] = useState<null | CognitoUser>(null);

    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = useCallback(
        async ({
            username,
            password,
            role,
        }: {
            username: string;
            password: string;
            role: string;
        }) => {
            // eslint-disable-next-line no-console
            console.log(`**** submitting login form`);
            // don't login again while logging in
            if (isLoggingIn) {
                return;
            }

            // log user in
            setIsLoggingIn(true);
            const loginResponse = await GetLogin(
                username,
                password,
                role,
                context
            );

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
        },
        [context, isLoggingIn]
    );

    // set isMounted to false when component is unmounted
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

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
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                        role: 'manager',
                    }}
                    onSubmit={handleSubmit}
                    validateOnChange={true}
                    validationSchema={validationSchema}
                >
                    {({ errors, submitForm }) => (
                        <div>
                            <VerifyEmailModalForm
                                cognitoUser={cognitoUser}
                                context={context}
                            />
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
                                    <Field
                                        name='username'
                                        margin='normal'
                                        required
                                        fullWidth
                                        label='Username'
                                        id='username'
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
                                </Segment>
                            </Container>
                        </div>
                    )}
                </Formik>
            </>
        );
    }
};

export default Login;
