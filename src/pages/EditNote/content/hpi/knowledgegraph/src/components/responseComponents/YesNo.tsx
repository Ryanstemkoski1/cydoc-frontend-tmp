import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import { HpiStateProps } from 'constants/hpiEnums';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import React from 'react';
import { connect } from 'react-redux';
import {
    yesNoToggleOption,
    YesNoToggleOptionAction,
} from 'redux/actions/hpiActions';
import { CurrentNoteState } from 'redux/reducers';
import { selectHpiState } from 'redux/selectors/hpiSelectors';

interface YesNoProps {
    node: string;
}

class YesNo extends React.Component<Props> {
    render() {
        const { hpi, node } = this.props;
        return (
            <>
                <YesAndNo
                    yesButtonActive={
                        hpi.nodes[node].response == YesNoResponse.Yes
                    }
                    yesButtonCondition={'Yes'}
                    handleYesButtonClick={() =>
                        this.props.yesNoToggleOption(node, YesNoResponse.Yes)
                    }
                    noButtonActive={
                        hpi.nodes[node].response == YesNoResponse.No
                    }
                    noButtonCondition={'No'}
                    handleNoButtonClick={() =>
                        this.props.yesNoToggleOption(node, YesNoResponse.No)
                    }
                />
            </>
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
