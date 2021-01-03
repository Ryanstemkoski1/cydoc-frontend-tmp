import React from 'react';
import {Grid, Header} from 'semantic-ui-react';
import "./HomePageContent.css";

//Component that manages the content for the landing page
export default class HomePageContent extends React.Component{
    render() {
        return (
            <Grid textAlign='center' verticalAlign='middle' centered>
                <Grid.Column>
                    <Header as='h1' textAlign='center' className='home-page-text'>
                        {this.props.mainText}
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
};
