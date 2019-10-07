// src/js/components/NewNoteForm.js
import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addTemplate } from "../actions/index";
import {Container, Form, Header, Segment} from "semantic-ui-react";
import {Redirect} from "react-router-dom"

function mapDispatchToProps(dispatch) {
    return {
        addTemplate: note => dispatch(addTemplate(note))
    };
}
class ConnectedCreateTemplateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateName: "",
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
        const { templateName } = this.state;
        const id = uuidv1();
        this.props.addTemplate({ templateName, id });
        this.setState({ templateName: "" , redirect: true});
    }
    render() {
        if(this.state.redirect){
            return <Redirect push to= "/editgraph" />;
        }

        const { templateName } = this.state;
        return (
            <Container>
                <Segment>
                    <Form size={'large'} onSubmit={this.handleSubmit}>
                        <Header as={"h2"} textAlign={"center"}>new template</Header>
                        <Form.Input
                            placeholder={"Please enter a short title or description"}
                            type="text"
                            id="templateName"
                            value={templateName}
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
const NewTemplateForm = connect(null, mapDispatchToProps)(ConnectedCreateTemplateForm);
export default NewTemplateForm;