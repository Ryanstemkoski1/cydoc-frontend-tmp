import React from 'react'
import constants from '../constants/constants';
import {allergies, medications, surgicalHistory, reviewOfSystems} from '../constants/States'

const Context = React.createContext('yasa')

export class HPIStore extends React.Component {
    state = {
        "title": "",
        "Allergies": allergies.state,
        "Medications": medications.state,
        "Surgical History": surgicalHistory.state,
        "Medical History": constants.MEDICAL_HISTORY.STATE,
        "Family History": constants.FAMILY_HISTORY.STATE,
        "Social History": constants.SOCIAL_HISTORY.STATE,
        "Review of Systems": reviewOfSystems.state,
        hpi: {}
     }

    onContextChange = (name, values) => { 
        this.setState({[name]: values});
    }

    render = () => {
        return(
            <Context.Provider value = {{...this.state, onContextChange: this.onContextChange}}>
                {this.props.children}
            </Context.Provider>
        )
    }
    
}

export default Context;