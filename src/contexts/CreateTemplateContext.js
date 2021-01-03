import React, { Component } from 'react';

const CreateTemplateContext = React.createContext({});

export class CreateTemplateStore extends Component {
    // represents a knowledge graph
    state = {
        title: '',
        disease: '',
        bodySystem: '',
        numQuestions: 1,
        numEdges: 1,
        graph: {
            '0000': [],
        },
        nodes: {
            '0000': { id: 'root' },
        },
        edges: {},
    };

    onContextChange = (attribute, value) => {
        this.setState({
            [attribute]: value,
        });
    };

    render() {
        return (
            <CreateTemplateContext.Provider
                value={{
                    state: this.state,
                    onContextChange: this.onContextChange,
                }}
            >
                {this.props.children}
            </CreateTemplateContext.Provider>
        );
    }
}

export default CreateTemplateContext;
