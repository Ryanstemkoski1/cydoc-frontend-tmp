import React, {Component, Fragment} from 'react'
import {Grid, Form, Checkbox, Button} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import HPIContext from '../../contexts/HPIContext'

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class ReviewOfSystemsCategory extends Component{

    static contextType = HPIContext

    constructor(props) {
        super(props)

        this.category = this.props.category
        this.options = this.props.options
        this.state = {}
    }

    handleChange = (option, value) => {
        const values = this.context["Review of Systems"]
        values[this.category][option] = value
        this.context.onContextChange("Review of Systems", values)
    }

    render() {
        return (
            <Grid.Row>
                <h3>{this.category}</h3>
                <Grid centered columns={3}>
                    {this.options.map(
                    option => 
                        <Grid.Row>
                            <Grid.Column>
                                <Button floated='right' color={this.context["Review of Systems"][this.category][option] === 'n' ? 'green' : null} radio value='n' active={this.context["Review of Systems"][this.category][option] === 'n'} onClick={(e, {value}) => this.handleChange(option, value)}>NO</Button>
                            </Grid.Column>
                            <Grid.Column width={4} verticalAlign='middle'>
                                {option}
                            </Grid.Column>
                            <Grid.Column>
                                <Button floated='left' color={this.context["Review of Systems"][this.category][option] === 'y' ? 'red' : null} radio value='y' active={this.context["Review of Systems"][this.category][option] === 'y'} onClick={(e, {value}) => this.handleChange(option, value)}>YES</Button>
                            </Grid.Column>
                        </Grid.Row>
                    )}
                </Grid>
            </Grid.Row>
        );
    }

    
}

ReviewOfSystemsCategory.propTypes = {
    category: PropTypes.string.isRequired, //Heading that goes over the divider
    options: PropTypes.array.isRequired, //Options to choose from the category
}