import React, {
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from 'react';
import {
    Form,
    Grid,
    Segment,
    Button,
    Container,
    Image,
    Header,
    Message,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import Logo from '../../assets/cydoc-logo.svg';
import NavMenu from '../../components/navigation/NavMenu';
import './Account.css';
import ResetPassword from 'auth/forgotPassword';
import EnterConfirmationCode from 'auth/enterConfirmationCode';

const passwordErrors = {
    containsNumber: 'Must contain at least one number.',
    containsUpper: 'Must contain at least one uppercase character.',
    containsLower: 'Must contain at least one lowercase character.',
    containsSpecial:
        'Must contain at least one of the following special characters: = + - ^ $ * . [ ] { } ( ) ? " ! @ # % & / \\ , > < \' : ; | _ ~ `',
    passesMinLength: 'Must be at least 25 characters.',
};

const ForgotPasswordEmail = () => {
    const context = useContext(AuthContext);
    const [username, setUserName] = useState('');
    const [role, setRole] = useState('healthcare professional');
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoggingEmail, setIsLoggingEmail] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [isConfirmed, setConfirmed] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const isMounted = useRef(true);
    const [passwordReqs, setPasswordReqs] = useState({
        containsNumber: false,
        containsUpper: false,
        containsLower: false,
        containsSpecial: false,
        passesMinLength: false,
    });
    //set isMounted to false when component is unmounted
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleNewPasswordChange = (e, { value }) => {
        setPasswordReqs({
            ...passwordReqs,
            containsNumber: value.match(/\d+/g) ? true : false,
            containsUpper: value.toLowerCase() !== value,
            containsLower: value.toUpperCase() !== value,
            containsSpecial: value.match(
                /=+|\++|-+|\^+|\$+|\*+|\.+|\[+|\]+|{+|}+|\(+|\)+|\?+|"+|!+|@+|#+|%+|&+|\/+|\\+|,+|>+|<+|'+|:+|;+|\|+|_+|~+|`+/g
            )
                ? true
                : false,
            passesMinLength: value.length >= 25,
        });
        setNewPassword(value);
    };

    const handleEmailChange = (e, { value }) => {
        setEmail(value);
    };

    const handleUsernameChange = (e, { value }) => {
        setUserName(value);
    };
    const handleEmailSubmit = useCallback(async () => {
        if (isLoggingEmail) {
            return;
        }

        //enter email and send code
        setIsLoggingEmail(true);
        const emailResponse = await ResetPassword(
            username,
            role,
            email,
            context
        );

        if (isMounted.current) {
            if (emailResponse.success) {
                setCodeSent(true);
            }
        }
        setIsLoggingEmail(false);
    }, [username, role, email, context, isLoggingEmail]);

    const handleCodeSubmit = useCallback(async () => {
        if (isConfirming) {
            return;
        }
        setIsConfirming(true);
        const confirmationCodeResponse = await EnterConfirmationCode(
            username,
            role,
            confirmationCode,
            newPassword,
            confirmPassword
        );
        if (isMounted.current) {
            if (confirmationCodeResponse.success) {
                setConfirmed(true);
            }
        }
        setIsConfirming(false);
    }, [
        confirmationCode,
        newPassword,
        confirmPassword,
        isConfirming,
        role,
        username,
    ]);

    const handleConfirmationCodeChange = (e, { value }) => {
        setConfirmationCode(value);
    };

    const handleConfirmPasswordChange = (e, { value }) => {
        setConfirmPassword(value);
    };

    const handleRoleChange = (e, { value }) => {
        setRole(value);
    };

    const passwordErrorMessages = () => {
        const errMsgs = [];
        for (const err in passwordErrors) {
            if (!passwordReqs[err]) {
                errMsgs.push(
                    <Message.Item key={err} content={passwordErrors[err]} />
                );
            }
        }

        return errMsgs;
    };

    function renderEnterEmail() {
        return (
            <Container className='forgot-password-email'>
                <Segment clearing>
                    <Container textAlign='center'>
                        <Image size='tiny' href='/' src={Logo} alt='logo' />
                        <Header as='h1' className='logo-text' content='Cydoc' />
                    </Container>
                    <Container
                        className='forgot-password-email-header'
                        color='black'
                        textAlign='center'
                        content='Forgot Password'
                    />
                    <Form size='mini' onSubmit={handleEmailSubmit}>
                        <Form.Input
                            fluid
                            aria-label='enter_email'
                            label='Enter email:'
                            name='enter_email'
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <Form.Input
                            fluid
                            aria-label='enter_username'
                            label='Enter username:'
                            name='enter_username'
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <label className='role-label'>I am a:</label>
                        <Form.Group>
                            <Form.Radio
                                label='healthcare professional'
                                value='healthcare professional'
                                checked={role === 'healthcare professional'}
                                onChange={handleRoleChange}
                            />
                            <Form.Radio
                                label='healthcare manager'
                                value='healthcare manager'
                                checked={role === 'healthcare manager'}
                                onChange={handleRoleChange}
                            />
                        </Form.Group>
                        <Grid.Row columns={2}>
                            <Grid.Column textAlign='left'>
                                <Button
                                    color='teal'
                                    size='small'
                                    aria-label='find-email'
                                    content='Find Email'
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Form>
                </Segment>
            </Container>
        );
    }

    function renderEnterConfirmation() {
        return (
            <Container className='forgot-password'>
                <Segment clearing>
                    <Container textAlign='center'>
                        <Image size='tiny' href='/' src={Logo} alt='logo' />
                        <Header as='h1' className='logo-text' content='Cydoc' />
                    </Container>
                    <Container
                        className='forgot-password-header'
                        color='black'
                        textAlign='center'
                        content='Reset Password'
                    />
                    <Form size='mini' onSubmit={handleCodeSubmit}>
                        <Form.Input
                            fluid
                            aria-label='enterconfirmationcode'
                            label='Enter Confirmation Code:'
                            name='enterconfirmationcode'
                            value={confirmationCode}
                            onChange={handleConfirmationCodeChange}
                        />
                        <Form.Input
                            fluid
                            aria-label='enternewpassword'
                            type='password'
                            label='Enter New Password:'
                            name='enternewpassword'
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                        />
                        <Form.Input
                            fluid
                            aria-label='confirmpassword'
                            type='password'
                            label='Confirm New Password:'
                            name='confirmpassword'
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        {passwordErrorMessages().length > 0 && (
                            <Message
                                error
                                header='Password must satisfy the following requirements:'
                                list={passwordErrorMessages()}
                            />
                        )}
                        <Grid.Row columns={2}>
                            <Grid.Column textAlign='left'>
                                <Button
                                    color='teal'
                                    size='small'
                                    aria-label='submit'
                                    content='Submit'
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Form>
                </Segment>
            </Container>
        );
    }

    function renderSuccessMessage() {
        return (
            <Container className='forgot-password'>
                <Segment clearing>
                    <Container textAlign='center'>
                        <Image size='tiny' href='/' src={Logo} alt='logo' />
                        <Header as='h1' className='logo-text' content='Cydoc' />
                    </Container>
                    <Container
                        className='forgot-password-header'
                        color='black'
                        textAlign='center'
                        content='Password Succesfully Changed'
                    />
                    <Grid padded verticalAlign='middle'>
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <Link
                                    style={{ color: '#007db3' }}
                                    to='/login'
                                    className='forgot-password-button'
                                    floated='center'
                                >
                                    Back to Login Page
                                </Link>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Container>
        );
    }

    return (
        <>
            <div className='nav-menu-container'>
                <NavMenu />
            </div>
            <div className='forgot-password-email'>
                {!codeSent
                    ? renderEnterEmail()
                    : !isConfirmed
                    ? renderEnterConfirmation()
                    : renderSuccessMessage()}
            </div>
        </>
    );
};

export default ForgotPasswordEmail;
