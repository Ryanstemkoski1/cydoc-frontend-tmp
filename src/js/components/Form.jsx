// src/js/components/Form.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addArticle } from "../actions/index";
import {Container, Form, Header, Label, Segment} from "semantic-ui-react";

function mapDispatchToProps(dispatch) {
    return {
        addArticle: article => dispatch(addArticle(article))
    };
}
class ConnectedForm extends Component {
    constructor() {
        super();
        this.state = {
            title: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        const { title } = this.state;
        const id = uuidv1();
        this.props.addArticle({ title, id });
        this.setState({ title: "" });
    }
    render() {
        const { title } = this.state;
        return (
            <Container >
                <Segment>
                    <Form size={'large'} onSubmit={this.handleSubmit}>
                        <Header as={"h2"} textAlign={"center"}>new note</Header>
                        <Form.Input
                            placeholder={"Please enter a short title or description"}
                            type="text"
                            id="title"
                            value={title}
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
const AddNoteForm = connect(null, mapDispatchToProps)(ConnectedForm);
export default AddNoteForm;