import React, {Component, Fragment} from 'react';
import NavMenu from '../components/NavMenu';
import HomePageContent from "../content/home/HomePageContent";
import "../../css/components/navMenu.css";
import "../../css/content/homePageContent.css";

//Component that manages the layout of the landing page
class HomePage extends Component {
    render() {
        return (
            <Fragment>
                <div className="nav-menu-container">
                    <NavMenu/>
                </div>
                <div className="home-page-content-container">
                    <HomePageContent/>
                </div>

            </Fragment>
        );
    }
}

export default HomePage;