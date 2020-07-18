import React from 'react'
import AuthContext from './AuthContext'
import { client } from 'constants/api'
import { noteBody } from 'constants/noteBody.js'

const Context = React.createContext('yasa')

export class NotesStore extends React.Component {

    static contextType = AuthContext

    state = {
        notes: new Map(),
        activeNotes: new Map()
    }

    //Returns all the user's notes as an Iterable
    getNotes = () => {
        return this.state.notes.values()
    }

    //Returns all the user's active notes as an Iterable
    getActiveNotes = () => {
        return this.state.activeNotes.values()
    }

    //Retrieves the user's notes using an API call
    loadNotes = async (_id = this.context.user._id) => {

        let response = await client.get("/records")

        if (response == null) {
            alert("null response")
            return
        }

        let notes = new Map()
        response.data.forEach((note) => {
            if (note.doctorID === _id) {
                notes.set(note._id, note)
            }
        })

        this.setState({ notes: notes });
    }

    //Adds the provided note into activeNotes
    loadNote = (note) => {
        let prevActiveNotes = this.state.activeNotes
        this.setState({ activeNotes: prevActiveNotes.set(note._id, note) })
    }

    //Removes the provided note from activeNotes using the note's id
    unloadNote = (note) => {
        this.setState((state, props) => {
            let prevActiveNotes = new Map(state.activeNotes)
            prevActiveNotes.delete(note._id)
            return { activeNotes: prevActiveNotes }
        })
    }

    //Adds a note to state and backend storage
    addNote = async () => {

        let note = {
            noteName: "Untitled Note",
            doctorID: this.context.user._id,
            clinicID: this.context.user.workplace,
            body: noteBody
        }

        //If notes map is not empty, takes most recent entry and autoloads static sections into new note
        if(this.state.notes.size) {
            let lastNote = Array.from(this.state.notes)[this.state.notes.size-1]
            let staticSections = ["Family History", "Medical History", "Surgical History", "Medications", "Allergies", "Social History"];
            staticSections.forEach(entry => {
                note.body[entry] = lastNote[1].body[entry]
            })
        }

        let response = await client.post("/record/new", note)

        if (response == null) {
            alert("null response")
            return
        }

        if (response.status - 200 < 100) {
            let newNote = response.data
            let prevNotes = new Map(this.state.notes)
            this.setState({ notes: prevNotes.set(newNote._id, newNote) })
            alert("Create Success")
        } else {
            alert(response.data.Message)
        }
    }

    //Deletes a note from state and backend storage
    deleteNote = async (note) => {

        note.doctorID = this.context.user._id
        note.clinicID = this.context.user.workplace

        let response = await client.delete(`/record/${note._id}`, note)

        if (response == null) {
            alert("null response")
            return
        }

        console.log(response)

        if (response.status - 200 < 100) {
            this.setState((state, props) => {
                let prevNotes = new Map(state.notes)
                let prevActiveNotes = new Map(state.activeNotes)
                prevNotes.delete(note._id)
                prevActiveNotes.delete(note._id)
                return { notes: prevNotes, activeNotes: prevActiveNotes }
            })
            alert("Delete Success")
        } else {
            alert(response.data.Message)
        }
    }

    //Updates a note in state and backend storage
    updateNote = async (note) => {

        note.doctorID = this.context.user._id
        note.clinicID = this.context.user.workplace

        let response = await client.put(`/record/${note._id}`, note)

        if (response == null) {
            alert("null response")
            return
        }

        console.log(response)

        if (response.status - 200 < 100) {
            this.setState((state, props) => {
                let prevNotes = new Map(state.notes)
                Object.assign(prevNotes.get(note._id), { ...note, unsavedChanges: false })
                return { notes: prevNotes }
            })
            alert("Save Success")
        } else {
            alert(response.data.Message)
        }
    }

    //Updates a note in state ONLY
    updateNoteLocally = (note) => {
        this.setState((state, props) => {
            let prevNotes = new Map(state.notes)
            Object.assign(prevNotes.get(note._id), note)
            return { notes: prevNotes }
        })
    }

    render = () => {
        return (
            <Context.Provider value={{
                ...this.state,
                getNotes: this.getNotes,
                getActiveNotes: this.getActiveNotes,
                loadNotes: this.loadNotes,
                loadNote: this.loadNote,
                unloadNote: this.unloadNote,
                addNote: this.addNote,
                deleteNote: this.deleteNote,
                updateNote: this.updateNote,
                updateNoteLocally: this.updateNoteLocally
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }

}

export default Context;