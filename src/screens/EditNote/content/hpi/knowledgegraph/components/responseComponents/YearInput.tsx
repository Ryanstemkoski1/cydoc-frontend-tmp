import Input from 'components/Input/Input';
import ToolTip from 'components/tools/ToolTip/Tooltip';
import { HpiStateProps, NumberInput } from 'constants/hpiEnums';
import React from 'react';
import { connect } from 'react-redux';
import {
    HandleYearInputChangeAction,
    handleYearInputChange,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';

interface YearInputProps {
    node: string;
}

class YearInput extends React.Component<Props, OwnState> {
    constructor(props: Props) {
        super(props);
        const currentYear = new Date(Date.now()).getFullYear();

        const { hpi, node } = this.props;
        const values = hpi.nodes[node];
        const value = values.response as number;
        const isValidYear =
            value == undefined ||
            (!isNaN(value) && value >= 1900 && value <= currentYear);

        this.state = {
            currentYear: currentYear,
            year: value,
            valid: isValidYear,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
    }

    handleInputChange = (value: number) => {
        const { node, handleYearInputChange } = this.props;
        if (isNaN(value) || value < 1900 || value > this.state.currentYear) {
            this.setState({ year: value });
            // reset year value if input is invalid
            if (this.state.valid) {
                handleYearInputChange(node, undefined);
            }
        } else {
            this.setState({ valid: true, year: value });
            // only set year value if input is valid
            handleYearInputChange(node, value);
        }
    };

    handleInputBlur = () => {
        const { node, handleYearInputChange } = this.props;
        const { year } = this.state;
        if (isNaN(year) || year < 1900 || year > this.state.currentYear) {
            this.setState({ valid: false });
            handleYearInputChange(node, undefined);
        }
    };

    render() {
        const { hpi, node } = this.props;
        const values = hpi.nodes[node];
        const question = values.text;
        return (
            <ToolTip
                messageContent={`Please enter a year between 1900 and ${this.state.currentYear}`}
                messageShow={!this.state.valid && this.state.year !== undefined}
            >
                <Input
                    key={question}
                    id={'year-input'}
                    type={'number'}
                    pattern={'[0-9]*'} // for numeric keypad on iOS
                    min={1900}
                    max={this.state.currentYear}
                    value={
                        typeof this.state.year == 'number'
                            ? this.state.year
                            : undefined
                    }
                    onChange={(e: any) =>
                        this.handleInputChange(parseInt(e.target.value))
                    }
                    onBlur={this.handleInputBlur}
                ></Input>
            </ToolTip>
        );
    }
}

type OwnState = {
    currentYear: number;
    year: number;
    valid: boolean;
};

interface DispatchProps {
    handleYearInputChange: (
        medId: string,
        input: NumberInput
    ) => HandleYearInputChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & YearInputProps;

const mapDispatchToProps = {
    handleYearInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(YearInput);
