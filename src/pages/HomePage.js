import React, {Component, Fragment} from 'react';
import NavMenu from '../components/NavMenu';
import HomePageContent from "../content/HomePageContent";
import {Grid, Header} from "semantic-ui-react";


class HomePage extends Component {
    render() {
        return (
            <Fragment>
                <NavMenu/>
                <HomePageContent/>
            </Fragment>
        );
    }
}

export default HomePage;