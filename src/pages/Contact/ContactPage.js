import React, {Component, Fragment} from 'react';
import firebase from './config.js';
// import NavMenu from '../components/NavMenu';
// import "../../css/components/navMenu.css";
import "./contactPage.css";
import { Form , Grid, Header, Input, Container, TextArea, Message } from 'semantic-ui-react'


export default class ContactPage extends Component {

    state = {
        name: '',
        email: '',
        message: '',
        category: '',
        subject: '',
        sent: false,
        emailErrorStatus: false,
        emailErrorMessage: "Please enter a valid email address"
    }

    validateEmail = email => {
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regEx.test(email.toLowerCase());
    }

    submitUserData = e => {
        e.preventDefault();

        if(!this.validateEmail(this.state.email)) {
            this.setState({ emailErrorStatus: true })
            return;
        } 
        else if (this.validateEmail(this.state.email) && this.state.emailErrorStatus === true) {
            this.setState({ emailErrorStatus: false })
        }

        var data = {
            name: this.state.name,
            email: this.state.email,
            subject: this.state.subject,
            message: this.state.message,
            datetime: firebase.firestore.Timestamp.fromDate(new Date())
        }

        const db = firebase.firestore();
        db.collection("contact-data").add(data);

        this.setState({
            name: '',
            email: '',
            message: '',
            subject: '',
            category: '',
            sent: true
        });
        console.log('DATA SAVED');
    }

    checkCategory = (e, { value }) => this.setState({ category: value, subject: value })

    render() {
        return (
            <Container className="contact-page" centered >
                <Header as="h1" className="contact-title">Contact Us</Header>
                
                <Form>
                    <Form.Input
                        required
                        label={<label><b>Name: </b>(required)</label>}
                        placeholder='Your Name'
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value})}
                    />

                    <Form.Input
                        required
                        type='email'
                        label={<label><b>Email: </b>(required)</label>}
                        placeholder='Your Email'
                        value={this.state.email}
                        onChange={e => this.setState({ email: e.target.value})}
                        error={this.state.emailErrorStatus ? this.state.emailErrorMessage : false}
                    />
                    
                    <Form.Field required>
                        <label><b>Please select a message category:</b></label>   
                        <Grid stackable columns={4}>
                            <Grid.Column computer={2} tablet={4}>
                                <Form.Radio 
                                    label="Comment"
                                    value="Comment"
                                    checked={this.state.category === "Comment"} 
                                    onChange={this.checkCategory}
                                />
                            </Grid.Column>
                            <Grid.Column computer={3} tablet={4}>
                                <Form.Radio 
                                    label="New Feature Request"
                                    value="New Feature Request"
                                    checked={this.state.category === "New Feature Request"} 
                                    onChange={this.checkCategory}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} tablet={4}>
                                <Form.Radio 
                                    label="Suggestion"
                                    value="Suggestion"
                                    checked={this.state.category === "Suggestion"} 
                                    onChange={this.checkCategory}
                                />
                            </Grid.Column>
                            <Grid.Column computer={2} tablet={4}>
                                <Form.Radio 
                                    label="Other"
                                    value="Other"
                                    checked={this.state.category === "Other"} 
                                    onChange={this.checkCategory}
                                />
                            </Grid.Column>
                        </Grid>
                    </Form.Field>
                    
                    {
                        this.state.category === "Other" && 
                        <Form.Field control={Input} type="text" placeholder="Email Subject" onChange={e => this.setState({subject: e.target.value})} />  
                    }
                    
                    <Form.Field
                        required
                        label={<label><b>Message: </b>(required)</label>}
                        control={TextArea}
                        placeholder="Message"
                        value={this.state.message}
                        onChange={e => this.setState({message: e.target.value})} 
                    />

                    <Form.Button
                        className="submit-button" 
                        type="submit"
                        onClick={e => this.submitUserData(e)}
                        disabled={!this.state.name || !this.state.email || !this.state.subject || !this.state.message}
                    >Submit
                    </Form.Button>
                </Form>

                {
                    this.state.sent === true && 
                    <Grid centered>
                        <Message
                            success
                            floating
                            compact
                            className='success-msg'
                            size='tiny'
                            header='Your email has been sent'
                            // content='We have received your email and will get back to you shortly'
                        />
                    </Grid>
                }

            </Container>
        );
    }
}