import React, {Component, Fragment} from 'react'
import {Grid, Form, Checkbox} from 'semantic-ui-react'
import PropTypes from 'prop-types'

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class ReviewOfSystemsCategory extends Component{

    constructor(props) {
        super(props)

        this.category = this.props.category
        this.options = this.props.options
        this.state = {}
    }

    handleChange = (option, value) => {
        this.setState({[option]: value})
    }

    render() {
        return (
            <Grid.Column>
                <h3>{this.category}</h3>
                <Form>
                    <label>Y N</label>
                    {this.options.map(
                    option => 
                        <Form.Group inline>
                            <Checkbox radio value='y' checked={this.state[option] === 'y'} onChange={(e, {value}) => this.handleChange(option, value)}/>
                            <Checkbox radio value='n' checked={this.state[option] === 'n'} onChange={(e, {value}) => this.handleChange(option, value)}/>
                            <label style={{paddingLeft: "10px"}}>{option}</label>
                        </Form.Group>
                    )}
                </Form>
            </Grid.Column>
        );
    }

    
}

ReviewOfSystemsCategory.propTypes = {
    category: PropTypes.string.isRequired, //Heading that goes over the divider
    options: PropTypes.array.isRequired, //Options to choose from the category
}