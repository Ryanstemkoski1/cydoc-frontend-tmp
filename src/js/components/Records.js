import React, {Component, Fragment} from "react";
import { Redirect } from "react-router"
import {Grid, Segment, Button} from "semantic-ui-react";

import HPIContext from '../contexts/HPIContext'

class ConnectedRecords extends Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    handleClick = (e, f) => {
        if (this.props.activeNote) {
            this.context.loadNote(this.props.activeNote)
            this.setState({redirect: true})
        }
    }

    render() {

        if (this.state.redirect === true) {
            return (
                <Redirect push to= "/editnote" />
            )
        }

        return (
            <Fragment>
                <Segment style={{overflow: 'auto', maxHeight: "50vh" }}>
                    <pre>{this.props.activeNote ? JSON.stringify(this.props.activeNote, null, 2) : "Select a Note!"}</pre>
                </Segment>
                <Button disabled={!this.props.activeNote} onClick={this.handleClick} floated>
                    Load
                </Button>
            </Fragment>
        );
    }
}

const Records = ConnectedRecords
export default Records;