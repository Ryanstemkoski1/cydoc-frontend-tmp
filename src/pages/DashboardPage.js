import React, {Component, Fragment} from 'react';
import NavMenu from "../components/NavMenu";
import VerticalMenu from "../components/VerticalMenu";
import {Grid, Segment} from "semantic-ui-react";
import Records from "../js/components/Records";

//Component that manages the layout of the dashboard page
export default class DashboardPage extends Component {
    render(){
        return (
            <Fragment>
                <div style={{position: "relative", top:"70px", boxShadow: "0 3px 4px -6px gray"}}>
                    <Grid columns={2} fluid>
                        <Grid.Column width={4}>
                            <VerticalMenu />
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <Segment basic padded>
                                <Records/>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </div>
                <div style={{position: "fixed", top: "0", right: "0", left: "0"}}>
                    <NavMenu />
                </div>
            </Fragment>
        )
    }

}