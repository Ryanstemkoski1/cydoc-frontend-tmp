import Input from 'components/Input/Input';
import ToggleButton from 'components/tools/ToggleButton/ToggleButton';
import { HpiStateProps, NumberInput, TimeOption } from 'constants/hpiEnums';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import React from 'react';
import { connect } from 'react-redux';
import {
    HandleTimeInputChangeAction,
    HandleTimeOptionChangeAction,
    handleTimeInputChange,
    handleTimeOptionChange,
} from 'redux/actions/hpiActions';
import { CurrentNoteState } from 'redux/reducers';
import { isTimeInputDictionary } from 'redux/reducers/hpiReducer';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import '../../css/TimeInput.css';
import style from './TimeInput.module.scss';

interface TimeInputProps {
    node: string;
}

class TimeInput extends React.Component<Props> {
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
                    <div
                        className={style.symptomsHistory__timeItem}
                        key={timeItem}
                    >
                        <ToggleButton<TimeOption>
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
                    </div>
                ));
            return (
                <div
                    className={`${style.symptomsHistory__timeGrid} flex-wrap`}
                    key={i}
                >
                    {timeButtons}
                </div>
            );
        });
        return (
            <div className={`${style.symptomsHistory} flex-wrap align-center`}>
                <div className={style.symptomsHistory__input}>
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
                        onChange={(e: any): HandleTimeInputChangeAction => {
                            return handleTimeInputChange(
                                node,
                                parseInt(e.target.value)
                            );
                        }}
                    />
                </div>
                <div className={`${style.symptomsHistory__time} flex-wrap`}>
                    {gridButtons[0]}
                    {gridButtons[1]}
                </div>
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
