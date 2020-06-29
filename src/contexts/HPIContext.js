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
            ...noteBody
        }
    }


    //Sets context[name] equal to values
    onContextChange = (name, values) => {
        this.setState({ [name]: values });
    }

    //Saves the current note, which updates the NotesContext's state
    saveNote = () => {
        let {title: noteName, _id, ...body} = this.state
        let note = {
            noteName,
            _id,
            body
        }
        this.context.updateNote(note)
    }

    //Converts the schema of the provided note and updates the HPIContext's state
    loadNote = (note) => {
        this.context.loadNote(note)
        this.setState({
            "title": note.noteName,
            _id: note._id,
            ...note.body
        })
    }

    //Saves the current note, then loads the provided note.
    swapNote = (note) => {
        this.saveNote()
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
                deleteNote: this.deleteNote
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }

}

export default Context;