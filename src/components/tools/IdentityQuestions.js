import React, { Component } from 'react';
import { Form, Radio } from 'semantic-ui-react';
import './IdentityQuestions.css';
import { race, ethnicity, gender, asian, otherRace, otherEthnicity } from '../../constants/identity-constants.json';

class IdentityQuestions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            race: this.props.race,
            asian: this.props.asian,
            otherRace: this.props.otherRace,
            ethnicity: this.props.ethnicity,
            otherEthnicity: this.props.otherEthnicity,
            gender: this.props.gender,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }


    handleChange(e, {name, value}) {
        let newState = this.state;
        newState[name] = value;
        this.setState(newState);
        console.log(newState);
    }

    handleSelect(e, {name, checked, value}) {
        let newState = this.state;
        if (checked && !newState[name].includes(value)) {
            newState[name].push(value);
        } else {
            var index = newState[name].indexOf(value);
            newState[name].splice(index, 1);
        }
        console.log(newState);
    }

    additionalAsianFields() {
        const additionalFields = asian
        if (this.state.race === 'Asian') {
            return (
                additionalFields.map(asian => (
                    <Form.Group grouped >
                    <Form.Checkbox 
                        className='identity-fields additional' 
                        name='asian'
                        key={asian}
                        label={asian}
                        value={asian}
                        checked={this.state.asian[asian]}
                        onChange={this.handleSelect}
                    />
                    </Form.Group>
                ))
            )
        }
    };

    additionalOtherRaceFields() {
        const additionalFields = otherRace;

        if (this.state.race === 'Native Hawaiian or Other Pacific Islander') {
            return (
                additionalFields.map(other => (
                <Form.Group grouped >
                    <Form.Checkbox 
                        className='identity-fields additional'
                        name='otherRace'
                        key={other}
                        label={other}
                        value={other}
                        checked={this.state.otherRace[other]}
                        onChange={this.handleSelect}
                    />
                </Form.Group>
                ))
            )
        }
    }

    additionalEthnicityFields() {
        let additionalFields = otherEthnicity;
        if (this.state.ethnicity === 'Yes, not of Hispanic, Latino/a, or Spanish origin') {
            return (
                additionalFields.map(other => (
                    <Form.Group grouped>
                        <Form.Checkbox 
                            className='identity-fields additional'
                            name='otherEthnicity'
                            key={other}
                            label={other}
                            value={other}
                            checked={this.state.otherEthnicity[other]}
                            onChange={this.handleSelect}
                        />
                        </Form.Group>
                ))
            )
        }
    }

    render() {

        return (

            <Form>
                <Form.Group grouped className='identity-groups'>
                    <label>Race</label>
                    <Form.Radio 
                        className='identity-fields' 
                        name='race' 
                        label='Prefer Not To Say' 
                        value='Prefer Not To Say' 
                        checked={this.state.race === 'Prefer Not To Say'}
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='race' 
                        label='White' 
                        value='White' 
                        checked={this.state.race === 'White'}
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='race' 
                        label='Black or African American' 
                        value='Black or African American'
                        checked={this.state.race === 'Black or African American'} 
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='race' 
                        label='Asian' 
                        value='Asian'
                        checked={this.state.race === 'Asian'}
                        onChange={this.handleChange} 
                    />
                    {this.additionalAsianFields()}
                    <Form.Radio 
                        className='identity-fields' 
                        name='race' 
                        label='Native Hawaiian or Other Pacific Islander' 
                        value='Native Hawaiian or Other Pacific Islander'
                        checked={this.state.race === 'Native Hawaiian or Other Pacific Islander'} 
                        onChange={this.handleChange} 
                    />
                    {this.additionalOtherRaceFields()}
                </Form.Group>

                <Form.Group grouped className='identity-groups'>
                    <label>Ethnicity</label>
                    <Form.Radio 
                        className='identity-fields' 
                        name='ethnicity' 
                        label='Prefer Not To Say' 
                        value='Prefer Not To Say' 
                        checked={this.state.ethnicity === 'Prefer Not To Say'}
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='ethnicity' 
                        label='No, not of Hispanic, Latino/a, or Spanish origin' 
                        value='No, not of Hispanic, Latino/a, or Spanish origin'
                        checked={this.state.ethnicity === 'No, not of Hispanic, Latino/a, or Spanish origin'} 
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='ethnicity' 
                        label='Yes, not of Hispanic, Latino/a, or Spanish origin' 
                        value='Yes, not of Hispanic, Latino/a, or Spanish origin'
                        checked={this.state.ethnicity === 'Yes, not of Hispanic, Latino/a, or Spanish origin'}  
                        onChange={this.handleChange} 
                    />
                    {this.additionalEthnicityFields()}
                </Form.Group>

                <Form.Group grouped className='identity-groups'>
                    <label>Gender</label>
                    <Form.Radio 
                        className='identity-fields' 
                        name='gender' 
                        label='Prefer Not To Say' 
                        value='Prefer Not To Say'
                        checked={this.state.gender === 'Prefer Not To Say'} 
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='gender' 
                        label='Male' 
                        value='Male' 
                        checked={this.state.gender === 'Male'} 
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='gender' 
                        label='Female' 
                        value='Female' 
                        checked={this.state.gender === 'Female'} 
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='gender' 
                        label='Transgender Woman' 
                        value='Transgender Woman' 
                        checked={this.state.gender === 'Transgender Woman'} 
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='gender' 
                        label='Transgender Man' 
                        value='Transgender Man' 
                        checked={this.state.gender === 'Transgender Man'} 
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='gender' 
                        label='Gender Queer' 
                        value='Gender Queer' 
                        checked={this.state.gender === 'Gender Queer'} 
                        onChange={this.handleChange} 
                    />
                    <Form.Radio 
                        className='identity-fields' 
                        name='gender' 
                        label='Open-ended' 
                        value='Open-ended' 
                        checked={this.state.gender === 'Open-ended'} 
                        onChange={this.handleChange} 
                    />

                </Form.Group>
            </Form>

        )
    }

}

export default IdentityQuestions;