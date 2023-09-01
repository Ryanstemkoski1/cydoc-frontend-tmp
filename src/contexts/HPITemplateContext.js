import React, { Component } from 'react';
import { getNewTemplate } from '../pages/CreateTemplate/util';

const HPITemplateContext = React.createContext({});

export class HPITemplateStore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            createdTemplates: {},
            template: getNewTemplate(),
        };
    }

    // Update a single key value pair in the template
    onTemplateChange = (attribute, value) => {
        this.setState((prevState) => ({
            template: {
                ...prevState.template,
                [attribute]: value,
            },
        }));
    };

    // Update multiple key, value pairs in the template
    updateTemplate = (values) => {
        this.setState((prevState) => ({
            ...prevState,
            template: {
                ...prevState.template,
                ...values,
            },
        }));
    };

    setCreatedTemplates = (createdTemplates) => {
        this.setState({ createdTemplates });
    };

    addCydocGraphs = ({ graph, edges, nodes }) => {
        this.setState((prevState) => {
            const { cydocGraphs } = prevState.template;
            return {
                template: {
                    ...prevState.template,
                    cydocGraphs: {
                        graph: { ...cydocGraphs.graph, ...graph },
                        edges: { ...cydocGraphs.edges, ...edges },
                        nodes: { ...cydocGraphs.nodes, ...nodes },
                    },
                },
            };
        });
    };

    render() {
        return (
            <HPITemplateContext.Provider
                value={{
                    ...this.state,
                    doctorID: this.context?.user?.doctorUUID,
                    setCreatedTemplates: this.setCreatedTemplates,
                    onTemplateChange: this.onTemplateChange,
                    updateTemplate: this.updateTemplate,
                    addCydocGraphs: this.addCydocGraphs,
                }}
            >
                {this.props.children}
            </HPITemplateContext.Provider>
        );
    }
}

export default HPITemplateContext;
