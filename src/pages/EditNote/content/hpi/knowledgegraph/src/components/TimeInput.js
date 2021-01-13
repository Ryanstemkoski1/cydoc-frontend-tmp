import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import NumericInput from 'react-numeric-input';
import HPIContext from 'contexts/HPIContext.js';
import '../css/TimeInput.css';

class TimeInput extends React.Component {
    static contextType = HPIContext;

    handleTimeButtonClick = (_e, data) => {
        let values = this.context.hpi;
        let input = values[this.props.node].response[0];
        values[this.props.node].response = [input, data.title];
        this.context.onContextChange('hpi', values);
    };

    handleInputChange = (value) => {
        const values = this.context.hpi;
        let timeOption = values[this.props.node].response[1];
        values[this.props.node].response = [value, timeOption];
        this.context.onContextChange('hpi', values);
    };

    render() {
        const currNodeInfo = this.context.hpi[this.props.node];
        const timeOptions = [
            'minutes',
            'hours',
            'days',
            'weeks',
            'months',
            'years',
        ];
        return (
            <div className='time-div'>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <div className='time-input'>
                                <NumericInput
                                    size={10}
                                    key={this.props.node}
                                    value={currNodeInfo.response[0]}
                                    min={0}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Grid>
                                {' '}
                                {/* Two of these allows the two rows of timeOptions */}
                                <Grid.Row
                                    columns='equal'
                                    className='time-grid-row'
                                >
                                    {timeOptions.slice(0, 3).map((timeItem) => (
                                        <Grid.Column
                                            className='time-grid-column'
                                            key={timeItem}
                                        >
                                            <Button
                                                color={
                                                    currNodeInfo.response[1] ===
                                                    timeItem
                                                        ? 'grey'
                                                        : undefined
                                                }
                                                title={timeItem}
                                                onClick={
                                                    this.handleTimeButtonClick
                                                }
                                                className='time-grid-button'
                                            >
                                                {' '}
                                                {timeItem}
                                            </Button>
                                        </Grid.Column>
                                    ))}
                                </Grid.Row>
                                <Grid.Row
                                    columns='equal'
                                    className='time-grid-row'
                                >
                                    {timeOptions.slice(3).map((timeItem) => (
                                        <Grid.Column
                                            className='time-grid-column'
                                            key={timeItem}
                                        >
                                            <Button
                                                color={
                                                    currNodeInfo.response[1] ===
                                                    timeItem
                                                        ? 'grey'
                                                        : undefined
                                                }
                                                title={timeItem}
                                                onClick={
                                                    this.handleTimeButtonClick
                                                }
                                                className='time-grid-button'
                                            >
                                                {' '}
                                                {timeItem}
                                            </Button>
                                        </Grid.Column>
                                    ))}
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default TimeInput;
