// src/js/components/NewNoteForm.js
import React, { Component } from "react";
import uuidv1 from "uuid";
import {Container, Form, Header, Segment} from "semantic-ui-react";
import {Redirect} from "react-router-dom"


class ConnectedCreateNoteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noteName: "",
            redirect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        const { noteName } = this.state;
        const id = uuidv1();
        this.props.addNote({ noteName, id });
        this.setState({ noteName: "" , redirect: true});
    }
    render() {
        if(this.state.redirect){
            return <Redirect push to= "/editnote" />;
        }

        const { noteName } = this.state;
        return (
            <Container>
                <Segment>
                    <Form size={'large'} onSubmit={this.handleSubmit}>
                        <Header as={"h2"} textAlign={"center"}>new note</Header>
                        <Form.Input
                            placeholder={"Please enter a short title or description"}
                            type="text"
                            id="noteName"
                            value={noteName}
                            onChange={this.handleChange}
                        />

                        <Form.Button basic>
                            create
                        </Form.Button>
                    </Form>
                </Segment>
            </Container>
        );
    }
}
const NewNoteForm = ConnectedCreateNoteForm;
export default NewNoteForm;