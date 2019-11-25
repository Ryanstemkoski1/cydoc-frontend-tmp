import React, {Component, Fragment} from 'react'
import {Grid, Button, Checkbox} from 'semantic-ui-react'
import PropTypes from 'prop-types'

//Sub-Component that represents the individual categories for the Review of Systems section of the note
export default class ReviewOfSystemsCategory extends Component{

    constructor(props) {
        super(props)

        this.category = this.props.category
        this.
        this.state = {
            
        }
    }

    render() {
        return (
            <Grid.Column>
                <h3>{label}</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>Y</Grid.Column>
                        <Grid.Column>N</Grid.Column>
                    </Grid.Row>
                    {systemsCategories[label].map(
                    value => <Grid.Row>
                        <Grid.Column><Checkbox/></Grid.Column>
                        <Grid.Column><Checkbox/></Grid.Column>
                        <Grid.Column width={9}>{value}</Grid.Column>
                    </Grid.Row>
                    )}
                </Grid>
            </Grid.Column>
        );
    }

    
}

ReviewOfSystemsCategory.propTypes = {
    category: PropTypes.string.isRequired, //Heading that goes over the divider
    options: PropTypes.array.isRequired, //Options to choose from the category
}