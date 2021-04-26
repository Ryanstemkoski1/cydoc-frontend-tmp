import React, {
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from 'react';
import {
    Form,
    Segment,
    Button,
    Container,
    Image,
    Header,
    Grid,
} from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import GetLogin from 'auth/login';
import SetupAccount from 'auth/setupAccount';
import AuthContext from '../../contexts/AuthContext';
import NotesContext from '../../contexts/NotesContext';
import Logo from '../../assets/cydoc-logo.svg';
import NavMenu from '../../components/navigation/NavMenu';
import FirstTimeLogin from './FirstTimeLogin';
import './Account.css';

const Login = () => {
    const context = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('healthcare professional');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const isMounted = useRef(true);
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [sessionUserAttributes, setSessionUserAttributes] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // set isMounted to false when component is unmounted
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleUsernameChange = (e, { value }) => {
        setUsername(value);
    };

    const handlePasswordChange = (e, { value }) => {
        setPassword(value);
    };

    const handleRoleChange = (e, { value }) => {
        setRole(value);
    };

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
                setCurrentUser(loginResponse.currentUser);
                setSessionUserAttributes(loginResponse.userAttr);
                setIsFirstLogin(loginResponse.isFirstLoginFlag);
                setRedirect(loginResponse.redirectFlag);
            }

            // finished logging in
            setIsLoggingIn(false);
        }
    }, [username, password, role, context, isLoggingIn]);

    const onChangePasswordSubmit = useCallback(
        async (newPassword, attributes) => {
            const newUserAttr = {
                ...sessionUserAttributes,
                given_name: attributes.firstName,
                middle_name: attributes.middleName,
                family_name: attributes.lastName,
                phone_number: attributes.countryCode + attributes.phoneNumber,
            };
            attributes['custom:UUID'] = newUserAttr['custom:UUID'];
            delete newUserAttr['custom:UUID'];
            setSessionUserAttributes(newUserAttr);

            // update account password and other attributes
            const setupAccountResponse = await SetupAccount(
                currentUser,
                newUserAttr,
                username,
                newPassword,
                attributes
            );

            if (setupAccountResponse) {
                // update state after user has setup account
                setIsFirstLogin(setupAccountResponse.isFirstLoginFlag);
            }
        },
        [currentUser, sessionUserAttributes, username]
    );

    if (redirect || context.token) {
        return (
            <NotesContext.Consumer>
                {(ctx) => {
                    ctx.loadNotes(context.user._id);
                    return <Redirect push to='/dashboard' />;
                }}
            </NotesContext.Consumer>
        );
    }

    if (isFirstLogin) {
        return (
            <FirstTimeLogin
                onSubmit={onChangePasswordSubmit}
                role={role}
                username={username}
                email={sessionUserAttributes?.email}
            />
        );
    }

    return (
        <>
            <NavMenu />
            <Container className='login'>
                <Segment clearing>
                    <Container textAlign='center'>
                        <Image size='tiny' href='/' src={Logo} alt='logo' />
                        <Header as='h1' className='logo-text' content='Cydoc' />
                    </Container>
                    <Container
                        className='login-header'
                        color='black'
                        textAlign='center'
                        content='Login'
                    />
                    <Form size='mini' onSubmit={handleSubmit}>
                        <Form.Input
                            fluid
                            aria-label='username'
                            label='Username'
                            name='username'
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <Form.Input
                            fluid
                            aria-label='password'
                            type='password'
                            label='Password'
                            name='password'
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <label className='role-label'>I am a:</label>
                        <Form.Group>
                            <Form.Radio
                                label='healthcare professional'
                                value='healthcare professional'
                                className='role'
                                checked={role === 'healthcare professional'}
                                onChange={handleRoleChange}
                            />
                            <Form.Radio
                                label='manager'
                                value='manager'
                                className='role'
                                checked={role === 'manager'}
                                onChange={handleRoleChange}
                            />
                        </Form.Group>
                        <Grid padded verticalAlign='middle'>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Link
                                        style={{ color: '#007db3' }}
                                        to='/forgotpasswordemail'
                                        floated='left'
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
                    </Form>
                </Segment>
            </Container>
        </>
    );
};

export default Login;
