import React, {Component, Fragment} from 'react';
import NavMenu from "../../components/navigation/NavMenu";
import VerticalMenu from "./VerticalMenu";
import {Container, Grid, Menu, Segment} from "semantic-ui-react";
import Records from "./Records";
import NotesContext from "../../contexts/NotesContext";
import { LANDING_PAGE_MOBLE_BP } from "constants/breakpoints.js";

//Component that manages the layout of the dashboard page
export default class LandingPageOld extends Component {

    static contextType = NotesContext

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            activeNote: null
        }
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    setActive = (note) => {
        this.setState({activeNote: note})
    }

    componentDidMount = () => {
        this.context.loadNotes()
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    render(){

        const { windowWidth } = this.state;

        const stack = windowWidth < LANDING_PAGE_MOBLE_BP;
        
        return (
            <>
                <div>
                    <NavMenu className="landing-page-nav-menu"/>
                </div>
                {stack?
                    <>
                    <VerticalMenu setActive={this.setActive} stack/>

                    <Segment basic padded>
                        <Records activeNote={this.state.activeNote} setActive={this.setActive}/>
                    </Segment>
                    </>
                    :
                    <Grid columns={2}>
                        <Grid.Column width={4} style={{minWidth: "340px"}}>
                            <VerticalMenu setActive={this.setActive} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment basic padded>
                                <Records activeNote={this.state.activeNote} setActive={this.setActive}/>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                }

            </>
        )
    }

}