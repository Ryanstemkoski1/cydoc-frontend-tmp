import React, {Component, Fragment} from 'react';
import {
    Button,
    Dropdown,
    Form,
    FormField,
    FormInput,
    Grid,
    GridColumn,
    Header, Icon,
    Label,
    Segment
} from "semantic-ui-react";
import NavMenu from "../components/NavMenu";
import Input from "semantic-ui-react/dist/commonjs/elements/Input";
import Container from "semantic-ui-react/dist/commonjs/elements/Container";

export default class EditGraph extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const questionOptions = [
            {key: "yn", value: "yes/no", text:"yes/no"}
        ];
        return (
            <Fragment>
                <div style={{position: "relative", top: "100px", width: "1300px", left: "70px"}}>
                    <Container fluid>
                        <Segment>
                            <Header as={"h2"} textAlign={"centered"}>new template</Header>
                            <Grid columns={4}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Form>
                                            <Form.Field>
                                                <label>category</label>
                                                <Input field={"category"}/>
                                            </Form.Field>
                                        </Form>
                                    </Grid.Column>
                                    <GridColumn>
                                        <Form>
                                            <Form.Field>
                                                <label>Root Question</label>
                                                <Input field={"Root Question"}/>
                                            </Form.Field>
                                        </Form>
                                    </GridColumn>
                                    <GridColumn>
                                        <Form>
                                            <Form.Field>
                                                <label>Question Type</label>
                                                <Dropdown
                                                    search
                                                    selection
                                                    options={questionOptions}
                                                    placeholder={"Select Type"}
                                                    field={"Question Type"}/>
                                            </Form.Field>
                                        </Form>
                                    </GridColumn>
                                    <GridColumn>
                                        <Form>
                                            <Form.Field>
                                                <label>Text if Yes</label>
                                                <Input field={"Text if yes"}/>
                                            </Form.Field>
                                            <Form.Field>
                                                    <label>Text if No</label>
                                                    <Input field={"Text if no"}/>
                                            </Form.Field>
                                        </Form>
                                    </GridColumn>
                                </Grid.Row>
                                <Grid.Row>
                                    <GridColumn style={{marginLeft: "60px"}}>
                                        <Button icon labelPosition='right'>
                                            Add Child Question
                                            <Icon name='right arrow' />
                                        </Button>
                                    </GridColumn>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Container>

                </div>
                <div style={{position: "fixed", top: "0", right: "0", left: "0", boxShadow: "0 3px 4px -6px gray"}}>
                    <NavMenu attached="top"/>
                </div>
            </Fragment>
        );
    }

}