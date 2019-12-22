import React from 'react'
import {allergies, medications, surgicalHistory} from '../constants/States'

const Context = React.createContext('yasa')

export class HPIStore extends React.Component {
    state = {
        "Allergies": allergies.state,
        "Medications": medications.state,
        "Surgical History": surgicalHistory.state
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