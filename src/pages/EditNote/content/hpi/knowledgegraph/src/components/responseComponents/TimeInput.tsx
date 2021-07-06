import React from 'react';
import { Grid, Button, Input } from 'semantic-ui-react';
import '../../css/TimeInput.css';
import { TimeOption, HpiStateProps, NumberInput } from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import {
    handleTimeInputChange,
    handleTimeOptionChange,
    HandleTimeInputChangeAction,
    HandleTimeOptionChangeAction,
} from 'redux/actions/hpiActions';
import { isTimeInputDictionary } from 'redux/reducers/hpiReducer';
import { selectHpiState } from 'redux/selectors/hpiSelectors';

interface TimeInputProps {
    node: string;
}

class TimeInput extends React.Component<Props> {
    render() {
        const {
            node,
            hpi,
            handleTimeInputChange,
            handleTimeOptionChange,
        } = this.props;
        const currResponse = hpi.nodes[node].response;
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
                                <Input
                                    id={'numeric-input'}
                                    key={this.props.node}
                                    type={'number'}
                                    value={
                                        isTimeInputDictionary(currResponse)
                                            ? currResponse.numInput
                                            : 0
                                    }
                                    min={0}
                                    onChange={(
                                        _e,
                                        data
                                    ): HandleTimeInputChangeAction =>
                                        handleTimeInputChange(
                                            node,
                                            parseInt(data.value)
                                        )
                                    }
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
                                                    isTimeInputDictionary(
                                                        currResponse
                                                    )
                                                        ? currResponse.timeOption ===
                                                          timeItem
                                                            ? 'grey'
                                                            : undefined
                                                        : undefined
                                                }
                                                title={timeItem}
                                                onClick={(
                                                    _e,
                                                    data
                                                ): HandleTimeOptionChangeAction =>
                                                    handleTimeOptionChange(
                                                        node,
                                                        data.value
                                                    )
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
                                                    isTimeInputDictionary(
                                                        currResponse
                                                    )
                                                        ? currResponse.timeOption ===
                                                          timeItem
                                                            ? 'grey'
                                                            : undefined
                                                        : undefined
                                                }
                                                title={timeItem}
                                                onClick={(
                                                    _e,
                                                    data
                                                ): HandleTimeOptionChangeAction =>
                                                    handleTimeOptionChange(
                                                        node,
                                                        data.value
                                                    )
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

interface DispatchProps {
    handleTimeInputChange: (
        medId: string,
        numInput: NumberInput
    ) => HandleTimeInputChangeAction;
    handleTimeOptionChange: (
        medId: string,
        timeOption: TimeOption
    ) => HandleTimeOptionChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & TimeInputProps;

const mapDispatchToProps = {
    handleTimeInputChange,
    handleTimeOptionChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeInput);
