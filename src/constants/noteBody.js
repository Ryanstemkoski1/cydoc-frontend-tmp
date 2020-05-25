import constants from 'constants/constants';
import { allergies, medications, surgicalHistory, reviewOfSystems} from 'constants/States'
import peConstants from 'constants/physical-exam-constants'

let peState = {
    "Vitals": {
        "Systolic Blood Pressure": 0,
        "Diastolic Blood Pressure": 0,
        "Heart Rate": 0,
        "RR": 0,
        "Temperature": 0,
        "Oxygen Saturation": 0
    },
    widgets: peConstants.widgets
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


export const noteBody = {
    "Allergies": allergies.state,
    "Medications": medications.state,
    "Surgical History": surgicalHistory.state,
    "Medical History": constants.MEDICAL_HISTORY.STATE,
    "Family History": constants.FAMILY_HISTORY.STATE,
    "Social History": constants.SOCIAL_HISTORY.STATE,
    "Review of Systems": reviewOfSystems.state,
    "Physical Exam": peState,
    positivediseases: [],
    activeHPI: "",
    positivecategories: [],
    hpi: {},
    plan: {},
    step: 1
}