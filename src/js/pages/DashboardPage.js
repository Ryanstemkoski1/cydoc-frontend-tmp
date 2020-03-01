import React, {Component, Fragment} from 'react';
import {Redirect} from "react-router";
import NavMenu from "../components/NavMenu";
import VerticalMenu from "../components/VerticalMenu";
import {Grid, Segment} from "semantic-ui-react";
import Records from "../components/Records";
import NotesContext from "../contexts/NotesContext"

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
                
                <div style={{ top: "0", right: "0", left: "0"}}>
                    <NavMenu />
                </div>
                <div style={{position: "relative", boxShadow: "0 3px 4px -6px gray"}}>
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
                </div>
            </Fragment>
        )
    }

}