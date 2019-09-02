import React, { Fragment } from 'react';
import NavMenu from '../components/Menu';
import HomePageContent from "../content/HomePageContent";
import {Grid, Header} from "semantic-ui-react";
import VerticalMenu from "../components/VerticalMenu"

const Dashboard = () => (
    <Fragment>
        <NavMenu />
        <VerticalMenu />
    </Fragment>
);
export default Dashboard;