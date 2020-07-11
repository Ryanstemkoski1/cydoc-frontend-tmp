import React from 'react'
import NotesContext from './NotesContext'
import { noteBody } from 'constants/noteBody.js'

const Context = React.createContext('yasa')

export class HPIStore extends React.Component {

    static contextType = NotesContext

    constructor(props) {
        super(props)

        this.state = {
            title: "Untitled Note",
            _id: null,
            unsavedChanges: false,
            ...noteBody
        }
    }

    //Sets context[name] equal to values
    onContextChange = (name, values) => {
        this.setState(
            {
                [name]: values,
                unsavedChanges: true
            },
            () => this.saveNote(true)
        );
    }

    //Saves the current note, which updates the NotesContext's state
    saveNote = (localOnly = false) => {
        let { title: noteName, _id, unsavedChanges, ...body } = this.state
        let note = {
            noteName,
            _id,
            unsavedChanges,
            body
        }
        if (localOnly === true) {
            this.context.updateNoteLocally(note)
        } else {
            this.setState({ unsavedChanges: false })
            this.context.updateNote(note)
        }
    }

    //Converts the schema of the provided note and updates the HPIContext's state
    loadNote = (note) => {
        this.context.loadNote(note)
        this.setState({
            "title": note.noteName,
            _id: note._id,
            unsavedChanges: note.unsavedChanges,
            ...note.body
        })
    }

    //Saves the current note, then loads the provided note.
    swapNote = (note) => {
        this.saveNote(true)
        this.loadNote(note)
    }

    //Deletes a note from NotesContext based on the note's id
    deleteNote = (note) => {
        this.context.deleteNote(note)
    }

    render = () => {
        return (
            <Context.Provider value={{
                ...this.state,
                onContextChange: this.onContextChange,
                saveNote: this.saveNote,
                loadNote: this.loadNote,
                swapNote: this.swapNote,
                deleteNote: this.deleteNote
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }

}

export default Context;