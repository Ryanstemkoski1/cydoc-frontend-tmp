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
    Card,
    Icon,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import Logo from '../../assets/cydoc-logo.svg';
import './Account.css';
import ResetPassword from 'auth/forgotPassword';
import EnterConfirmationCode from 'auth/enterConfirmationCode';
import { passwordErrors } from 'constants/passwordErrors';
import { passwordRequirements } from 'auth/passwordReqs';

const ForgotPasswordEmail = () => {
    const context = useContext(AuthContext);
    const [username, setUserName] = useState('');
    const [role, setRole] = useState('doctor');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoggingUser, setIsLoggingUser] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [obfuscatedEmail, setObfuscatedEmail] = useState('');
    const [isConfirmed, setConfirmed] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [passwordMeetsReqs, setPasswordMeetsReqs] = useState(true);
    const [showPasswordReqs, setShowPasswordReqs] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showPasswordsMatch, setShowPasswordsMatch] = useState(false);
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

    const handleConfirmPasswordChange = (e, { value }) => {
        setConfirmPassword(value);
    };
    const handleNewPasswordChange = (e, { value }) => {
        setPasswordReqs(passwordRequirements(passwordReqs, value, role));
        setNewPassword(value);
    };

    const handleUsernameChange = (e, { value }) => {
        setUserName(value);
    };

    const handleFocusNewPassword = (value) => {
        setShowPasswordReqs(value);
    };

    const handleFocusConfirmPassword = (value) => {
        setShowPasswordsMatch(value);
    };

    const handleUserSubmit = useCallback(async () => {
        if (isLoggingUser) {
            return;
        }

        //enter email and send code
        setIsLoggingUser(true);
        const emailResponse = await ResetPassword(username, role, context);

        if (isMounted.current) {
            if (emailResponse.success) {
                setCodeSent(true);
                setObfuscatedEmail(emailResponse.obfuscatedEmail);
            }
        }
        setIsLoggingUser(false);
    }, [username, role, context, isLoggingUser]);

    const handleCodeSubmit = useCallback(async () => {
        if (isConfirming) {
            return;
        }
        setIsConfirming(true);

        for (const req in passwordReqs) {
            if (!passwordReqs[req]) {
                setShowPasswordReqs(true);
                setPasswordMeetsReqs(false);
                setIsConfirming(false);
                return;
            }
        }

        setPasswordMeetsReqs(true);
        setShowPasswordReqs(false);
        setPasswordsMatch(newPassword === confirmPassword);
        if (newPassword !== confirmPassword) {
            setShowPasswordsMatch(true);
            setIsConfirming(false);
            return;
        }

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
                alert('Password successfully updated.');
            }
        }
        setIsConfirming(false);
        return;
    }, [
        confirmationCode,
        newPassword,
        confirmPassword,
        isConfirming,
        role,
        username,
        passwordReqs,
    ]);

    const handleConfirmationCodeChange = (e, { value }) => {
        setConfirmationCode(value);
    };

    const handleRoleChange = (e, { value }) => {
        setRole(value);
    };

    const passwordErrorMessages = () => {
        const errMsgs = [];
        const passwordErrs = passwordErrors(role);
        for (const err in passwordErrs) {
            if (passwordReqs[err]) {
                errMsgs.push(
                    <Card.Content
                        key={err}
                        className={passwordMeetsReqs ? 'req-met' : ''}
                    >
                        <Icon name='check' size='small' />
                        {passwordErrs[err]}
                    </Card.Content>
                );
            } else {
                errMsgs.push(
                    <Card.Content
                        key={err}
                        className={!passwordMeetsReqs ? 'req-not-met' : ''}
                    >
                        <Icon name='times' size='small' />
                        {passwordErrs[err]}
                    </Card.Content>
                );
            }
        }
        return errMsgs;
    };

    const checkPasswordsMatch = () => {
        const errMsgs = [];
        if (newPassword !== confirmPassword) {
            errMsgs.push(
                <Card.Content
                    key={'passwords-do-not-match'}
                    className={'passwords-do-match'}
                >
                    <Icon name='exclamation' size='small' />
                    {'Passwords do not match'}
                </Card.Content>
            );
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
                    <Form size='mini' onSubmit={handleUserSubmit}>
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
                                value='doctor'
                                checked={role === 'doctor'}
                                onChange={handleRoleChange}
                            />
                            <Form.Radio
                                label='healthcare manager'
                                value='manager'
                                checked={role === 'manager'}
                                onChange={handleRoleChange}
                            />
                        </Form.Group>
                        <Grid.Row columns={2}>
                            <Grid.Column textAlign='left'>
                                <Button
                                    color='teal'
                                    size='small'
                                    aria-label='find-email'
                                    content='Continue'
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
                    <Form size='mini'>
                        <Form.Input
                            fluid
                            aria-label='enterconfirmationcode'
                            label={`Enter Confirmation Code Emailed to: ${obfuscatedEmail}`}
                            name='enterconfirmationcode'
                            value={confirmationCode}
                            onChange={handleConfirmationCodeChange}
                        />
                        <Form.Input
                            fluid
                            error={!passwordMeetsReqs}
                            aria-label='enternewpassword'
                            type='password'
                            label='Enter New Password:'
                            name='enternewpassword'
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            onFocus={() => handleFocusNewPassword(true)}
                            onBlur={() => handleFocusNewPassword(false)}
                        />
                        {showPasswordReqs && (
                            <Card
                                fluid
                                className={
                                    passwordMeetsReqs
                                        ? 'password-reqs'
                                        : 'password-reqs-not-met'
                                }
                                header='New password requirements:'
                                description={passwordErrorMessages()}
                            />
                        )}
                        <Form.Input
                            fluid
                            error={!passwordsMatch}
                            aria-label='confirmpassword'
                            type='password'
                            label='Confirm New Password:'
                            name='confirmpassword'
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            onFocus={() => handleFocusConfirmPassword(true)}
                            onBlur={() => handleFocusConfirmPassword(false)}
                        />
                        {showPasswordsMatch && (
                            <Container className='pass-match-error'>
                                {checkPasswordsMatch()}
                            </Container>
                        )}
                        <Grid.Row columns={2}>
                            <Grid.Column textAlign='left'>
                                <Button
                                    color='teal'
                                    size='small'
                                    aria-label='submit'
                                    content='Submit'
                                    onClick={handleCodeSubmit}
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
        <div className='forgot-password-email'>
            {!codeSent || !obfuscatedEmail
                ? renderEnterEmail()
                : !isConfirmed
                ? renderEnterConfirmation()
                : renderSuccessMessage()}
        </div>
    );
};

export default ForgotPasswordEmail;
