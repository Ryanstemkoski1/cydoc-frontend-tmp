import React, { Fragment } from 'react';
import NavMenu from '../components/NavMenu';
import HomePageContent from "../content/HomePageContent";
import {Grid, Header} from "semantic-ui-react";


const HomePage = () => (
    <Fragment>
        <NavMenu />
        <HomePageContent />
    </Fragment>
);
export default HomePage;