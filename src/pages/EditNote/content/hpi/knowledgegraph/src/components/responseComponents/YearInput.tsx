import React from 'react';
import { Input } from 'semantic-ui-react';
import { CurrentNoteState } from 'redux/reducers';
import { HpiStateProps, NumberInput } from 'constants/hpiEnums';
import {
    handleYearInputChange,
    HandleYearInputChangeAction,
} from 'redux/actions/hpiActions';
import { connect } from 'react-redux';
import { selectHpiState } from 'redux/selectors/hpiSelectors';

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
            !isNaN(value) && value >= 1900 && value <= currentYear;

        this.state = {
            currentYear: currentYear,
            year: value,
            valid: isValidYear,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (value: number) => {
        const { node, handleYearInputChange } = this.props;
        if (isNaN(value) || value < 1900 || value > 2023) {
            // reset year value if input is invalid
            this.setState({ valid: false, year: value });
            if (this.state.valid) {
                handleYearInputChange(node, undefined);
            }
        } else {
            this.setState({ valid: true, year: value });
            // only set year value if input is valid
            handleYearInputChange(node, value);
        }
    };

    render() {
        const { hpi, node } = this.props;
        const values = hpi.nodes[node];
        const question = values.text;
        return (
            <div style={{ width: 'fit-content', position: 'relative' }}>
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
                    onChange={(_e, data) =>
                        this.handleInputChange(parseInt(data.value))
                    }
                />
                {!this.state.valid && this.state.year !== undefined && (
                    <p className='year-validation-mobile-error'>
                        Please enter a year between 1900 and 2023
                    </p>
                )}
            </div>
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
