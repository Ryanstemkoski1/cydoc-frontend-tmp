import React, { Component, Fragment } from 'react';
import NavMenu from "../../components/navigation/NavMenu";
import HomePageContent from "./HomePageContent";
import 'stylesheets/custom-styling.css';
import "./HomePageContent.css";

// Component that manages the layout of the landing page
class HomePage extends Component {
    render() {
        return (
            <Fragment>
                <div className="nav-menu-container">
                    <NavMenu />
                </div>
                <div className="home-page-content-container">
                    <HomePageContent />
                </div>

            </Fragment>
        );
    }
}

export default HomePage;