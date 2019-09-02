import React, {Component, Fragment} from 'react';
import MenuTabs from "../components/MenuTabs";
import NotePage from "../components/NotePage";
import NavMenu from "../components/NavMenu";

class CreateNote extends Component {
        render() {
                return (
                    <Fragment>
                            <div style={{backgroundColor: "white", position: "sticky", top: "0px"}}>
                                    <NavMenu/>
                                    <MenuTabs/>
                            </div>
                            <NotePage/>
                    </Fragment>
                );
        }
}

export default CreateNote;