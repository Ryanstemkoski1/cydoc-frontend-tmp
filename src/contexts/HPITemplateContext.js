import React, { Component } from 'react';
import AuthContext from './AuthContext';
import { getNewTemplate } from '../pages/CreateTemplate/util';

const HPITemplateContext = React.createContext({});

export class HPITemplateStore extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.state = {
            createdTemplates: {},
            template: getNewTemplate(),
        };
    }

    // Update a single key value pair in the template
    onTemplateChange = (attribute, value) => {
        this.setState({
            template: {
                ...this.state.template,
                [attribute]: value,
            },
        });
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

    render() {
        return (
            <HPITemplateContext.Provider
                value={{
                    ...this.state,
                    doctorID: this.context?.user?._id,
                    setCreatedTemplates: this.setCreatedTemplates,
                    onTemplateChange: this.onTemplateChange,
                    updateTemplate: this.updateTemplate,
                }}
            >
                {this.props.children}
            </HPITemplateContext.Provider>
        );
    }
}

export default HPITemplateContext;
