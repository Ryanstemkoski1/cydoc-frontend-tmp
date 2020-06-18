import React, {Component, Fragment} from 'react';
import NavMenu from "../../components/navigation/NavMenu";
import VerticalMenu from "./VerticalMenu";
import {Container, Grid, Menu, Segment} from "semantic-ui-react";
import Records from "./Records";
import NotesContext from "../../contexts/NotesContext";

//Component that manages the layout of the dashboard page
export default class LandingPage extends Component {

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
            <>
                <div>
                    <NavMenu className="landing-page-nav-menu"/>
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
            </>
        )
    }

}