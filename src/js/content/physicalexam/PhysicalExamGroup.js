import React, {Component, Fragment} from 'react'
import {Divider, Header, Grid, Form, Checkbox, TextArea} from 'semantic-ui-react'
import PropTypes from 'prop-types'

export const MyContext = React.createContext('yasa')

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class PhysicalExamGroup extends Component{
    
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        if (this.props.abnormalFindings == true) {
            return (
                <MyContext.Provider value={this.props.category}>
                    <Fragment>
                        <Header as="h4">{this.props.category}</Header>
                        <Divider />
                        <Form>
                            <Grid columns="equal">
                                <Grid.Row>
                                    <Grid.Column>
                                        {this.props.children}
                                    </Grid.Column>
                                    <Grid.Column floated="right" width={5}>
                                        <Form.Field>
                                            <label>Abnormal Findings</label>
                                            <TextArea/>
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                    </Fragment>
                </MyContext.Provider>
                
                
                
            )
        }

        else {
            return (
                <MyContext.Provider value={this.props.category}>
                    <Fragment>
                        <Header as="h4">{this.props.category}</Header>
                        <Divider />
                        <Form>
                            <Grid columns="equal">
                            <Grid.Row>
                                <Grid.Column>
                                    {this.props.children}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        </Form>
                    </Fragment>
                </MyContext.Provider>
                
            ) 
        }
        
    }

    
}

PhysicalExamGroup.propTypes = {
    content: PropTypes.any.isRequired,
}