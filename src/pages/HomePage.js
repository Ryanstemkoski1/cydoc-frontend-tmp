import React, {Component, Fragment} from 'react';
import NavMenu from '../components/NavMenu';
import HomePageContent from "../content/HomePageContent";


class HomePage extends Component {
    render() {
        return (
            <Fragment>
                <div style={{position: "relative", top:"70px"}}>
                    <HomePageContent/>
                </div>
                <div style={{position: "fixed", top: "0", right: "0", left: "0"}}>
                    <NavMenu/>
                </div>

            </Fragment>
        );
    }
}

export default HomePage;