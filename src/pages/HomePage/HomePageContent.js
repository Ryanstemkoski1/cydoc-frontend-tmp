import React from 'react';

import {Grid, Header} from "semantic-ui-react";

//Component that manages the content for the landing page
export default class HomePageContent extends React.Component{
    render() {
        return (
            <Grid textAlign='center' verticalAlign='middle' centered>
                <Grid.Column>
                    <Header as="h1" textAlign="center">
                        {this.props.mainText}
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
};



