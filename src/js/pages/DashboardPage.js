import React, {Component, Fragment} from 'react';
import NavMenu from "../components/NavMenu";
import VerticalMenu from "../components/VerticalMenu";
import {Grid, Segment} from "semantic-ui-react";
import Records from "../components/Records";
import NotesContext from "../contexts/NotesContext";
import "../../css/components/navMenu.css";

//Component that manages the layout of the dashboard page
export default class DashboardPage extends Component {

    static contextType = NotesContext

    constructor(props) {
        super(props);
        this.state = {
            activeNote: null
        }
    }

    setActive = (note) => {
        this.setState({activeNote: note})
    }

    componentDidMount = () => {
        this.context.loadNotes()
    }

    render(){
        
        return (
            <Fragment>
                
                <div class="nav-menu-container">
                    <NavMenu />
                </div>
                <Grid columns={2}>
                    <Grid.Column width={4} style={{minWidth: "340px"}}>
                        <VerticalMenu setActive={this.setActive}/>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Segment basic padded>
                            <Records activeNote={this.state.activeNote} setActive={this.setActive}/>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Fragment>
        )
    }

}