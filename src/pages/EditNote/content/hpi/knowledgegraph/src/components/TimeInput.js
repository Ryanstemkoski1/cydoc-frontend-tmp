import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import NumericInput from 'react-numeric-input';
import HPIContext from 'contexts/HPIContext.js';
import '../css/TimeInput.css';

class TimeInput extends Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this);
    }

    handleToggleButtonClick = (event) => {
        const values = this.context['hpi'];
        values['nodes'][this.props.node]['response'][1] = event.target.title;
        this.context.onContextChange('hpi', values);
    };

    handleInputChange = (event) => {
        const values = this.context['hpi'];
        values['nodes'][this.props.node]['response'][0] = event;
        this.context.onContextChange('hpi', values);
    };

    render() {
        const values = this.context['hpi']['nodes'][this.props.node];
        let value = values['response'][0];
        let timeValue = values['response'][1];
        let question = values['text'];
        const timeOptions = [
            'minutes',
            'hours',
            'days',
            'weeks',
            'months',
            'years',
        ];
        let buttonMap = [];
        for (
            let timeIndex = 0;
            timeIndex < timeOptions.length;
            timeIndex += 3
        ) {
            buttonMap.push(
                <Grid.Row columns='equal' className='time-grid-row'>
                    {timeOptions
                        .slice(timeIndex, timeIndex + 3)
                        .map((timeItem, index) => (
                            <Grid.Column
                                className='time-grid-column'
                                key={index}
                            >
                                <Button
                                    color={
                                        timeValue === timeItem
                                            ? 'violet'
                                            : 'basic'
                                    }
                                    title={timeItem}
                                    onClick={this.handleToggleButtonClick}
                                    className='time-grid-button'
                                >
                                    {' '}
                                    {timeItem}{' '}
                                </Button>
                            </Grid.Column>
                        ))}
                </Grid.Row>
            );
        }
        return (
            <div className='time-div'>
                <Grid container doubling columns={2}>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <div className='time-input'>
                                <NumericInput
                                    size={10}
                                    key={question}
                                    value={value}
                                    min={0}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Grid>{buttonMap}</Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default TimeInput;
