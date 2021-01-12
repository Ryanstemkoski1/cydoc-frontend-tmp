import React, { Component } from 'react';
import AuthContext from './AuthContext';
import { createNodeId } from '../pages/CreateTemplate/util';

const CreateTemplateContext = React.createContext({});

export class CreateTemplateStore extends Component {
    static contextType = AuthContext;

    // represents a knowledge graph
    rootId = createNodeId('000', 0);
    state = {
        title: '',
        disease: '',
        bodySystem: '',
        numQuestions: 1,
        nextEdgeID: 0,
        root: this.rootId,
        graph: {
            [this.rootId]: [],
        },
        nodes: {
            [this.rootId]: {
                id: this.rootId,
                responseType: 'YES-NO',
                text: 'nan',
            },
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
                    doctorID: this.context?.user?._id,
                    onContextChange: this.onContextChange,
                }}
            >
                {this.props.children}
            </CreateTemplateContext.Provider>
        );
    }
}

export default CreateTemplateContext;
