import React, {Component, Fragment} from "react";
import { Redirect } from "react-router"
import {Grid, Segment, Button} from "semantic-ui-react";

import HPIContext from 'contexts/HPIContext.js'

class ConnectedRecords extends Component {

    static contextType = HPIContext

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    handleLoad = (e, f) => {
        if (this.props.activeNote) {
            this.context.loadNote(this.props.activeNote)
            this.setState({redirect: true})
        }
    }

    handleDelete = (e, f) => {
        if (this.props.activeNote) {
            this.context.deleteNote(this.props.activeNote)
            this.props.setActive(null)
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

                <Button disabled={!this.props.activeNote} onClick={this.handleLoad} floated>
                    Load
                </Button>
                <Button disabled={!this.props.activeNote} onClick={this.handleDelete} floated>
                    Delete
                </Button>
                <Segment style={{overflow: 'auto', maxHeight: "50vh" }}>
                    <pre>{this.props.activeNote ? JSON.stringify(this.props.activeNote, null, 2) : "Select a Note!"}</pre>
                </Segment>
            </Fragment>
        );
    }
}

const Records = ConnectedRecords
export default Records;