import React, {Component, Fragment} from 'react';
import {Grid, Button, Checkbox} from 'semantic-ui-react'

//Component that manages the content for the Review of Systems section of the note
export default class ReviewOfSystemsContent extends Component{

    constructor(props) {
        super(props)
        this.state = {
            test: {
                "category1": ["thing1","quantity2","conceptuality3"],
                "category2": ["thing1","thing2","thing3"],
                "category3": ["thing1","thing2","thing3"],
                "category4": ["thing1","thing2","thing3"],
                "category5": ["thing1","thing2","thing3", "Bleeding Gums"],
                "category6": ["thing1","Abdominal Pain","JugemuJugemuGokonosurikire"],
                "category7": ["thing1","thing2","thing3"],
                "category8": ["thing1","thing2","thing3"],
                "category9": ["thing1","thing2","thing3"],
                "category10": ["thing1","thing2","thing3"],
                "category11": ["thing1","thing2","thing3"],
                "category12": ["thing1","thing2","thing3","thing5","thing6","thing4"],
                "category13": ["thing1","thing2","thing3"],
                "category14": ["thing1","thing2","thing3"]
            }
        }
    }


    generateList = (systemsCategories) => {
        return Object.keys(systemsCategories).map(
            (label) => 
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
            
        )
    }

    render() {
        return (
            <Fragment>
                <Grid columns={3}>
                    {this.generateList(this.state.test)}
                </Grid>
            </Fragment>
        );
    }
}