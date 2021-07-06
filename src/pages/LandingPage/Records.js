import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router';
import { Segment, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { deleteNote } from 'redux/actions/currentNoteActions';

import NotesContext from 'contexts/NotesContext';
import './LandingPage.css';

class ConnectedRecords extends Component {
    static contextType = NotesContext;

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        };
    }

    handleLoad = () => {
        if (this.props.activeNote) {
            // TODO: Account for unsaved changes
            const { _id, noteName: title, ...note } = this.props.activeNote;
            this.context.loadNote({ _id, title, ...note.body });
            this.setState({ redirect: true });
        }
    };

    handleDelete = () => {
        if (this.props.activeNote) {
            this.props.deleteNote();
            this.context.deleteNote(this.props.activeNote);
            this.props.setActive(null);
        }
    };

    render() {
        if (this.state.redirect === true) {
            return <Redirect push to='/editnote' />;
        }

        return (
            <Fragment>
                <Button
                    disabled={!this.props.activeNote}
                    onClick={this.handleLoad}
                    floated
                >
                    Load
                </Button>
                <Button
                    disabled={!this.props.activeNote}
                    onClick={this.handleDelete}
                    floated
                >
                    Delete
                </Button>
                <Segment className='note-preview'>
                    <pre>
                        {this.props.activeNote
                            ? JSON.stringify(this.props.activeNote, null, 2)
                            : 'Select a Note!'}
                    </pre>
                </Segment>
            </Fragment>
        );
    }
}

export default connect(null, { deleteNote })(ConnectedRecords);
