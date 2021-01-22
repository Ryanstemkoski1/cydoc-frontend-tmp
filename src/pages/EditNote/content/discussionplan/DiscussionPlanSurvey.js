import React, { Component } from 'react';
import HPIContext from 'contexts/HPIContext.js';
import { Header, Segment, Grid, Label } from 'semantic-ui-react';

export default class DiscussionPlanSurvey extends Component {
    static contextType = HPIContext;
    constructor(context) {
        super(context);
        this.state = {
            yes_color: 'whitesmoke',
            no_color: 'whitesmoke',
            uncertain_color: 'whitesmoke',
        };
        this.active_color = 'lightslategrey';
        this.nonactive_color = 'whitesmoke';
    }

    handleInputChange = (title, value) => {
        const plan = { ...this.context['plan'] };
        plan['survey'][title] = value;
        this.context.onContextChange('plan', plan);
    };

    handleOnClick = (type, value) => {
        const values = this.context['plan'];
        values['survey'][type] = value;
        this.context.onContextChange('plan', values);
    };

    render() {
        const { plan } = this.props;
        return (
            <div className='plan-survey'>
                <Header as='h4' attached='top' content='Help Improve Cydoc' />
                <Segment attached>
                    <Grid stackable columns={2}>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <p> How sick is the patient? </p>
                            </Grid.Column>
                            <Grid.Column floated='right'>
                                <label> Healthy </label>
                                <input
                                    aria-label='range-for-sickness'
                                    type='range'
                                    min={0}
                                    max={10}
                                    step={1}
                                    value={plan['survey']['sickness']}
                                    onChange={(e) =>
                                        this.handleInputChange(
                                            'sickness',
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                                <label> Sick </label>
                                <Label circular>
                                    {plan['survey']['sickness']}
                                </Label>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <p>
                                    {' '}
                                    Will the patient be sent to the emergency
                                    department?{' '}
                                </p>
                            </Grid.Column>
                            <Grid.Column floated='right'>
                                <button
                                    className='button_yesno'
                                    style={{
                                        backgroundColor:
                                            plan['survey']['emergency'] ===
                                            'Yes'
                                                ? this.active_color
                                                : this.nonactive_color,
                                    }}
                                    onClick={() =>
                                        this.handleOnClick('emergency', 'Yes')
                                    }
                                >
                                    Yes
                                </button>
                                <button
                                    className='button_yesno'
                                    style={{
                                        backgroundColor:
                                            plan['survey']['emergency'] === 'No'
                                                ? this.active_color
                                                : this.nonactive_color,
                                    }}
                                    onClick={() =>
                                        this.handleOnClick('emergency', 'No')
                                    }
                                >
                                    No
                                </button>
                                <button
                                    className='button_yesno'
                                    style={{
                                        backgroundColor:
                                            plan['survey']['emergency'] ===
                                            'Uncertain'
                                                ? this.active_color
                                                : this.nonactive_color,
                                    }}
                                    onClick={() =>
                                        this.handleOnClick(
                                            'emergency',
                                            'Uncertain'
                                        )
                                    }
                                >
                                    Uncertain
                                </button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <p>
                                    {' '}
                                    Will the patient be admitted to the
                                    hospital?{' '}
                                </p>
                            </Grid.Column>
                            <Grid.Column floated='right'>
                                <button
                                    className='button_yesno'
                                    style={{
                                        backgroundColor:
                                            plan['survey'][
                                                'admit_to_hospital'
                                            ] === 'Yes'
                                                ? this.active_color
                                                : this.nonactive_color,
                                    }}
                                    onClick={() =>
                                        this.handleOnClick(
                                            'admit_to_hospital',
                                            'Yes'
                                        )
                                    }
                                >
                                    Yes
                                </button>
                                <button
                                    className='button_yesno'
                                    style={{
                                        backgroundColor:
                                            plan['survey'][
                                                'admit_to_hospital'
                                            ] === 'No'
                                                ? this.active_color
                                                : this.nonactive_color,
                                    }}
                                    onClick={() =>
                                        this.handleOnClick(
                                            'admit_to_hospital',
                                            'No'
                                        )
                                    }
                                >
                                    No
                                </button>
                                <button
                                    className='button_yesno'
                                    style={{
                                        backgroundColor:
                                            plan['survey'][
                                                'admit_to_hospital'
                                            ] === 'Uncertain'
                                                ? this.active_color
                                                : this.nonactive_color,
                                    }}
                                    onClick={() =>
                                        this.handleOnClick(
                                            'admit_to_hospital',
                                            'Uncertain'
                                        )
                                    }
                                >
                                    Uncertain
                                </button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}
