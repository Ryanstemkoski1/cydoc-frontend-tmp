import { PatientPronouns } from 'constants/patientInformation';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import './DemographicsForm.css';

class IdentityQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pronouns: this.props.pronouns,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleChange(e, { value }) {
        this.setState({ pronouns: value });
        this.props.onChange(e, { value });
    }

    handleSelect(e, { name, checked, value }) {
        e.preventDefault();
        let newState = this.state;
        if (checked && !newState[name].includes(value)) {
            newState[name].push(value);
        } else {
            let index = newState[name].indexOf(value);
            newState[name].splice(index, 1);
        }
    }

    render() {
        return (
            <Form>
                <Form.Group grouped className='identity-groups field'>
                    <label>Pronouns</label>
                    <Form.Radio
                        className='identity-fields'
                        name='pronouns'
                        label='They/them'
                        value={PatientPronouns.They}
                        checked={this.state.pronouns === PatientPronouns.They}
                        onChange={this.handleChange}
                    />
                    <Form.Radio
                        className='identity-fields'
                        name='pronouns'
                        label='She/her'
                        value={PatientPronouns.She}
                        checked={this.state.pronouns === PatientPronouns.She}
                        onChange={this.handleChange}
                    />
                    <Form.Radio
                        className='identity-fields'
                        name='pronouns'
                        label='He/him'
                        value={PatientPronouns.He}
                        checked={this.state.pronouns === PatientPronouns.He}
                        onChange={this.handleChange}
                    />
                </Form.Group>
            </Form>
        );
    }
}

export default IdentityQuestions;
