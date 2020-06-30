import React from 'react'
import constants from 'constants/constants';
import { allergies, medications, surgicalHistory, reviewOfSystems } from 'constants/States'
import peConstants from 'constants/physical-exam-constants'
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
        let note = {
            noteName: this.state["title"],
            _id: this.state._id,
            body: {
                "Allergies": this.state["Allergies"],
                "Medications": this.state["Medications"],
                "Surgical History": this.state["Surgical History"],
                "Medical History": this.state["Medical History"],
                "Family History": this.state["Family History"],
                "Social History": this.state["Social History"],
                "Review of Systems": this.state["Review of Systems"],
                "Physical Exam": this.state["Physical Exam"],
                "positivediseases": this.state["positivediseases"],
                "activeHPI": this.state["activeHPI"],
                "positivecategories": this.state["positivecategories"],
                hpi: this.state.hpi,
                "plan": this.state["plan"],
                step: this.state.step
            }
        }
        this.context.updateNote(note)
    }

    //Converts the schema of the provided note and updates the HPIContext's state
    loadNote = (note) => {
        this.setState({
            "title": note.noteName,
            _id: note._id,
            ...note.body
        })
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