import React, {Component, Fragment} from 'react';
import NavMenu from "../components/NavMenu";
import VerticalMenu from "../components/VerticalMenu";
import {Grid, Segment} from "semantic-ui-react";
import NoteDashboardContent from "../content/NoteDashboardContent";

export default class DashboardPage extends Component {
    render(){
        return (
            <Fragment>
                <NavMenu/>
                <Grid columns={2} fluid>
                    <Grid.Column width={4}>
                        <VerticalMenu />
                    </Grid.Column>
                    <Grid.Column width={9}>
                        <Segment basic padded>
                            <NoteDashboardContent />
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Fragment>
        )
    }

}