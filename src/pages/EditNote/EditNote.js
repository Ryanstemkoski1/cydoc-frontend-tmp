import React, { Component, Fragment, Ref, createRef } from 'react';
import {Sticky} from "semantic-ui-react";
import MenuTabs from "./MenuTabs";
import NotePage from "./NotePage";
import NavMenu from "../../components/navigation/NavMenu";
import { TAB_NAMES } from 'constants/constants';


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

    noteContent = createRef()

    render() {

        return (
            <>
            <div ref={this.noteContent}>

                {/* style to ensure nav-menu is seamless */}
                    <NavMenu className="edit-note-nav-menu" />
                <Sticky context={this.noteContent}>
                    <MenuTabs
                        activeItem={this.state.activeItem}
                        onTabChange={this.onTabChange}
                        activeTabIndex={this.state.activeTabIndex}
                        attached
                    />
                </Sticky>
                    <NotePage activeItem={this.state.activeItem} />
            </div>
            </>
        );
    }
}

export default EditNote;