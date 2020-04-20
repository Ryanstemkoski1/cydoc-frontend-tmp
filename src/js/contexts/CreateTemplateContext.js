import React, { Component } from 'react';

const CreateTemplateContext = React.createContext({});

export class CreateTemplateStore extends Component {
    // represents a knowledge graph
    state = {
        title: '',
        disease: '',
        bodySystem: '',
        questions: [],
    }

    onContextChange = (attribute, value) => { 
        this.setState({
            [attribute]: value
        });
    }

    render() {
        return(
            <CreateTemplateContext.Provider
                value={{
                    state: this.state,
                    onContextChange: this.onContextChange}}
            >
                {this.props.children}
            </CreateTemplateContext.Provider>
        )
    }
}

export default CreateTemplateContext;