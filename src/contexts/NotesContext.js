import React from 'react'
import AuthContext from './AuthContext'
import { client } from 'constants/api'
import { noteBody } from 'constants/noteBody.js'

const Context = React.createContext('yasa')

export class NotesStore extends React.Component {

    static contextType = AuthContext

    state = {
        notes: new Map()
    }

    //Returns all the user's notes as an Iterable
    getNotes = () => {
        return this.state.notes.values()
    }

    //Retrieves the uer's notes using an API call
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

    //Adds a note to state and backend storage
    addNote = async () => {

        let note = {
            noteName: "Untitled Note",
            doctorID: this.context.user._id,
            clinicID: this.context.user.workplace,
            body: noteBody
        }


        let response = await client.post("/record/new", note)

        if (response == null) {
            alert("null response")
            return
        }

        if (response.status - 200 < 100) {
            let newNote = response.data
            this.setState({ notes: this.state.notes.set(newNote._id, newNote) })
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
                let prevNotes = state.notes
                prevNotes.delete(note._id)
                return { notes: prevNotes }
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
            this.setState({ notes: this.state.notes.set(note._id, note) })
            alert("Save Success")
        } else {
            alert(response.data.Message)
        }
    }

    render = () => {
        return (
            <Context.Provider value={{
                ...this.state,
                getNotes: this.getNotes,
                loadNotes: this.loadNotes,
                addNote: this.addNote,
                deleteNote: this.deleteNote,
                updateNote: this.updateNote
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }

}

export default Context;