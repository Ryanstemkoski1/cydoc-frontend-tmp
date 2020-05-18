import React from 'react'
import AuthContext from './AuthContext'
import { client } from '../constants/api'

const Context = React.createContext('yasa')

export class NotesStore extends React.Component {

    static contextType = AuthContext

    state = {
        notes: []
    }

    loadNotes = async (_id = this.context.user._id) => {

        let response = await client.get("/records")

        if (response == null) {
            alert("null response")
            return
        }

        let notes = []
        response.data.forEach((note) => {
            if (note.doctorID === _id) {
                notes.push(note)
            }
        })

        this.setState({ notes: notes });
    }

    addNote = async () => {

        let note = {
            noteName: "Untitled Note",
            doctorID: this.context.user._id,
            clinicID: this.context.user.workplace,
            body: null
        }


        let response = await client.post("/record/new", note)

        if (response == null) {
            alert("null response")
            return
        }

        if (response.status - 200 < 100) {
            this.setState({ notes: [...this.state.notes, response.data] })
            alert("Create Success")
        } else {
            alert(response.data.Message)
        }
    }

    deleteNote = async (note) => {

        note.doctorID = this.context.user._id
        note.clinicID = this.context.user.workplace

        this.setState({ notes: this.state.notes.filter((prevNote) => prevNote._id !== note._id) })
        let response = await client.delete(`/record/${note._id}`, note)

        if (response == null) {
            alert("null response")
            return
        }

        console.log(response)

        if (response.status - 200 < 100) {
            alert("Delete Success")
        } else {
            alert(response.data.Message)
        }
    }

    updateNote = async (note) => {

        note.doctorID = this.context.user._id
        note.clinicID = this.context.user.workplace

        this.setState({ notes: this.state.notes.map((prevNote) => prevNote._id === note._id ? note : prevNote) })
        let response = await client.put(`/record/${note._id}`, note)

        if (response == null) {
            alert("null response")
            return
        }

        console.log(response)

        if (response.status - 200 < 100) {
            alert("Save Success")
        } else {
            alert(response.data.Message)
        }
    }

    render = () => {
        return (
            <Context.Provider value={{
                ...this.state,
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