import React from 'react';
import { Grid, Input } from 'semantic-ui-react';
import '../../css/TimeInput.css';
import {
    TimeOption,
    HpiStateProps,
    NumberInput,
    ResponseTypes,
} from 'constants/hpiEnums';
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
import ToggleButton from 'components/tools/ToggleButton';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';

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
        const gridButtons = [0, 2, 4].map((i) => {
            const timeButtons = timeOptions.slice(i, i + 2).map((timeItem) => (
                <Grid.Column className='time-grid-column' key={timeItem}>
                    <ToggleButton
                        className='time-grid-button'
                        active={
                            isTimeInputDictionary(currResponse)
                                ? currResponse.timeOption == timeItem
                                : false
                        }
                        condition={timeItem}
                        title={timeItem}
                        onToggleButtonClick={(
                            _e,
                            data
                        ): HandleTimeOptionChangeAction =>
                            handleTimeOptionChange(node, data.condition)
                        }
                    />
                </Grid.Column>
            ));
            return (
                <Grid.Row key={i} columns='equal' className='time-grid-row'>
                    {timeButtons}
                </Grid.Row>
            );
        });
        return (
            <div className='time-div'>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <div className='time-input'>
                                <Input
                                    className={'time-input'}
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
                            <Grid>{gridButtons}</Grid>
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
