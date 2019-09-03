import React, {Component, Fragment} from 'react';
import NavMenu from '../components/NavMenu';
import HomePageContent from "../content/HomePageContent";


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