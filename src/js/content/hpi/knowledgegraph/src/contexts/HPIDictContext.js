import React from 'react'

const Context = React.createContext('yasa')

export class HPIDictStore extends React.Component {
    state = {
        "Aortic Aneurysm": "Yes"
     }

    onContextChange = (name, values) => {
        if (!(name in this.state.hpi)) {
            let new_hpi = this.state.hpi
            new_hpi[name]['response'] = values
            this.setState({hpi: new_hpi})
        }
        else { this.setState({hpi: {[name]: values}}) }
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