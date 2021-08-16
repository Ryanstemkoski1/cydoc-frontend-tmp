import React from 'react';
import { YesNoResponse } from 'constants/enums';
import { CurrentNoteState } from 'redux/reducers';
import { HpiStateProps } from 'constants/hpiEnums';
import { connect } from 'react-redux';
import {
    yesNoToggleOption,
    YesNoToggleOptionAction,
} from 'redux/actions/hpiActions';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ToggleButton from 'components/tools/ToggleButton';

interface YesNoProps {
    node: string;
}

class YesNo extends React.Component<Props> {
    render() {
        const { hpi, node, yesNoToggleOption } = this.props;
        const answer = hpi.nodes[node].response;
        return (
            <div>
                <ToggleButton
                    className='button_yesno'
                    active={answer == YesNoResponse.Yes}
                    condition='Yes'
                    title='Yes'
                    onToggleButtonClick={(_e): YesNoToggleOptionAction =>
                        yesNoToggleOption(node, YesNoResponse.Yes)
                    }
                />
                <ToggleButton
                    className='button_yesno'
                    active={answer == YesNoResponse.No}
                    condition='No'
                    title='No'
                    onToggleButtonClick={(_e): YesNoToggleOptionAction =>
                        yesNoToggleOption(node, YesNoResponse.No)
                    }
                />
            </div>
        );
    }
}

interface DispatchProps {
    yesNoToggleOption: (
        medId: string,
        optionSelected: YesNoResponse
    ) => YesNoToggleOptionAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & YesNoProps;

const mapDispatchToProps = {
    yesNoToggleOption,
};

export default connect(mapStateToProps, mapDispatchToProps)(YesNo);
