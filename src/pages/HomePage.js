import React, {Component, Fragment} from 'react';
import NavMenu from '../components/NavMenu';
import HomePageContent from "../content/HomePageContent";

//Component that manages the layout of the landing page
class HomePage extends Component {
    render() {
        return (
            <Fragment>
                <div style={{position: "relative", top:"70px"}}>
                    <HomePageContent/>
                </div>
                <div style={{position: "fixed", top: "0", right: "0", left: "0", boxShadow: "0 3px 4px -6px gray"}}>
                    <NavMenu/>
                </div>

            </Fragment>
        );
    }
}

export default HomePage;