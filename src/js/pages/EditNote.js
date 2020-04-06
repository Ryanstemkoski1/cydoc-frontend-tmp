import React, {Component, Fragment} from 'react';
import MenuTabs from "../components/MenuTabs";
import NotePage from "./NotePage";
import NavMenu from "../components/NavMenu";
import "../../css/components/navMenu.css";
import {TAB_NAMES} from '../constants/constants';

//Component that manages the active state of the create note editor
//and defines the layout of the editor
class EditNote extends Component {
    constructor(props) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
        this.state = {
            activeItem: 'HPI',
            activeTabIndex: 0,
        }
    }

    onTabChange(name) {
        let activeItem = name;
        let activeTabIndex = TAB_NAMES.indexOf(name);

        this.setState({ activeItem, activeTabIndex })
    }

    render() {
                return (
                    <Fragment>
                        <NavMenu class="nav-menu-container" />
                        <MenuTabs
                            activeItem={this.state.activeItem}
                            onTabChange={this.onTabChange}
                            activeTabIndex={this.state.activeTabIndex}
                            attached
                        />
                        <NotePage activeItem={this.state.activeItem} />
                    </Fragment>
                );
        }
}

export default EditNote;