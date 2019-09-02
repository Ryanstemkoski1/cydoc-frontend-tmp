import React, { Fragment } from 'react';
import Menu from '../components/Menu';
import HomePageContent from "../content/HomePageContent";
import {Grid, Header} from "semantic-ui-react";


const HomePage = () => (
    <Fragment>
        <Menu />
        <HomePageContent />
    </Fragment>
);
export default HomePage;