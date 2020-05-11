import React from 'react'
import constants from '../constants/constants';
import { allergies, medications, surgicalHistory, reviewOfSystems, physicalExam } from '../constants/States'
import peConstants from '../constants/physical-exam-constants'
import NotesContext from './NotesContext'

const Context = React.createContext('yasa')

export class HPIStore extends React.Component {

    static contextType = NotesContext

    constructor(props) {
        super(props)

        let peState = {
            "Vitals": {
                "Systolic Blood Pressure": 0,
                "Diastolic Blood Pressure": 0,
                "Heart Rate": 0,
                "RR": 0,
                "Temperature": 0,
                "Oxygen Saturation": 0
            },
        }
        peConstants.sections.forEach((section) => {
            let sectionState = {comments: ''}
            section.rows.forEach((row) => {
                if (row.needsRightLeft) {
                    row.findings.forEach((finding) => {
                        sectionState[finding] = { left: false, active: false, right: false }
                    })
                } else {
                    row.findings.forEach((finding) => {
                        sectionState[finding] = false
                    })
                }
            })
            peState[section.name] = sectionState
        })

        this.state = {
            "title": "Untitled Note",
            _id: "yasa",
            "Allergies": allergies.state,
            "Medications": medications.state,
            "Surgical History": surgicalHistory.state,
            "Medical History": constants.MEDICAL_HISTORY.STATE,
            "Family History": constants.FAMILY_HISTORY.STATE,
            "Social History": constants.SOCIAL_HISTORY.STATE,
            "Review of Systems": reviewOfSystems.state,
            "Physical Exam": physicalExam.state,
            "Physical Exam 2": peState,
            "positivediseases": [],
            "activeHPI": "",
            "positivecategories": [],
            hpi: {},
            "plan": {},
            step: 1
        }
    }



    onContextChange = (name, values) => {
        this.setState({ [name]: values });
    }

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

    loadNote = (note) => {
        this.setState({
            "title": note.noteName,
            _id: note._id,
            ...note.body
        })
    }

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