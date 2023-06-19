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
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';

interface YesNoProps {
    node: string;
}

class YesNo extends React.Component<Props> {
    render() {
        const { hpi, node } = this.props;
        return (
            <div>
                <ToggleButton
                    className='button_yesno'
                    active={hpi.nodes[node].response == YesNoResponse.Yes}
                    condition='Yes'
                    title='Yes'
                    onToggleButtonClick={(_e) =>
                        this.props.yesNoToggleOption(node, YesNoResponse.Yes)
                    }
                />
                <ToggleButton
                    className='button_yesno'
                    active={hpi.nodes[node].response == YesNoResponse.No}
                    condition='No'
                    title='No'
                    onToggleButtonClick={(_e) =>
                        this.props.yesNoToggleOption(node, YesNoResponse.No)
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
