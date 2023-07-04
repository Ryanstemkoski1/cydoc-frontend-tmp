import React from 'react';
import { Grid, Input } from 'semantic-ui-react';
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
import ToggleButton from 'components/tools/ToggleButton';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import { ROS_SMALL_BP } from 'constants/breakpoints';

interface TimeInputProps {
    node: string;
}

interface TimeInputState {
    windowWidth: number;
    windowHeight: number;
}

class TimeInput extends React.Component<Props, TimeInputState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    updateDimensions() {
        const windowWidth =
            typeof window !== 'undefined' ? window.innerWidth : 0;
        const windowHeight =
            typeof window !== 'undefined' ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
    }

    render() {
        const { node, hpi, handleTimeInputChange, handleTimeOptionChange } =
            this.props;
        const currResponse = hpi.nodes[node].response;
        const timeDict: { [key in TimeOption]: string } = {
            minutes: 'min',
            hours: 'hr',
            days: 'day',
            weeks: 'wk',
            months: 'mth',
            years: 'yr',
        };
        const gridButtons = [0, 3].map((i) => {
            const timeButtons = (Object.keys(timeDict) as TimeOption[])
                .slice(i, i + 3)
                .map((timeItem) => (
                    <Grid.Row className='time-grid-row' key={timeItem}>
                        <ToggleButton<TimeOption>
                            className='time-grid-button'
                            active={
                                isTimeInputDictionary(currResponse)
                                    ? currResponse.timeOption == timeItem
                                    : false
                            }
                            condition={timeItem}
                            title={
                                this.state.windowWidth > ROS_SMALL_BP
                                    ? timeItem
                                    : timeDict[timeItem]
                            }
                            onToggleButtonClick={(
                                _e,
                                data
                            ): HandleTimeOptionChangeAction =>
                                handleTimeOptionChange(node, data.condition)
                            }
                        />
                    </Grid.Row>
                ));
            return <Grid.Column key={i}>{timeButtons}</Grid.Column>;
        });
        return (
            <div className='time-div'>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <div className='time-input'>
                                <Input
                                    className={'time-input'}
                                    id={'numeric-input'}
                                    key={this.props.node}
                                    type={'number'}
                                    value={
                                        isTimeInputDictionary(currResponse) &&
                                        currResponse.numInput != 0
                                            ? currResponse.numInput
                                            : null
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
                        <Grid.Column width={1}></Grid.Column>
                        <Grid.Column
                            width={
                                this.state.windowWidth > ROS_SMALL_BP ? 6 : 8
                            }
                        >
                            <Grid columns={2}>
                                {gridButtons[0]}
                                {gridButtons[1]}
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
