import React, { Component, Fragment, createRef } from 'react';
import {Segment} from 'semantic-ui-react';
import {Container, Sticky} from "semantic-ui-react";

import MenuTabs from "./MenuTabs";
import NotePage from "./NotePage";
import NavMenu from "../../components/navigation/NavMenu";
import { TAB_NAMES } from 'constants/constants';
import HPIContext from '../../contexts/HPIContext'
import { Redirect } from 'react-router';

// Component that manages the active state of the create note editor
// and defines the layout of the editor
class EditNote extends Component {

    static contextType = HPIContext

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

    // Reference for the Sticky navigation bars
    noteContent = createRef()

    render() {
        // Redirects to LandingPage if there is no valid note in constext
        if (this.context._id === null) {
            return <Redirect push to="/dashboard" />
        }

        return (
            <>
                <div ref={this.noteContent}>
                    {/* Top NavMenu and MenuTabs stay on top regardless of scroll*/}
                    <Sticky context={this.noteContent}>
                        <NavMenu
                            className="edit-note-nav-menu"
                            displayNoteName={true}
                        />
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