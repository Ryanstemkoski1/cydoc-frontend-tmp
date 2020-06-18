import React, {Component} from 'react';
import {Grid, Button, Card, Container, Segment, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import HPIContext from 'contexts/HPIContext.js';
import './ReviewOfSystems.css';

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
            <Segment raised>
                <Header>{this.category}</Header>
                    <Grid>
                    {this.options.map((option) => 
                        <Grid.Row key={option}>
                            <Grid.Column width={4} className="no-padding">
                                <Button
                                    compact
                                    floated='right'
                                    color={this.context["Review of Systems"][this.category][option] === 'n' ? 'green' : null}
                                    value='n'
                                    active={this.context["Review of Systems"][this.category][option] === 'n'}
                                    onClick={(e, {value}) => this.handleChange(option, value)}
                                >
                                    NO
                                </Button>
                            </Grid.Column>
                            <Grid.Column
                                width={7}
                                verticalAlign='middle'
                                className="ros-symptom no-padding"
                            >
                                {option}
                            </Grid.Column>
                            <Grid.Column width={4} className="no-padding">
                                <Button
                                    compact
                                    floated='left'
                                    color={this.context["Review of Systems"][this.category][option] === 'y' ? 'red' : null}
                                    value='y' active={this.context["Review of Systems"][this.category][option] === 'y'}
                                    onClick={(e, {value}) => this.handleChange(option, value)} 
                                >
                                    YES
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    )}
                    </Grid>
            </Segment>
        );
    }
}

ReviewOfSystemsCategory.propTypes = {
    category: PropTypes.string.isRequired, //Heading that goes over the divider
    options: PropTypes.array.isRequired, //Options to choose from the category
}