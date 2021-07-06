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

interface YesNoProps {
    node: string;
}

class YesNo extends React.Component<Props> {
    render() {
        const { hpi, node, yesNoToggleOption } = this.props;
        const answer = hpi.nodes[node].response;
        return (
            <div>
                <button
                    className='button_yesno'
                    style={{
                        backgroundColor:
                            answer === YesNoResponse.Yes
                                ? 'lightslategrey'
                                : 'whitesmoke',
                        color: answer === YesNoResponse.Yes ? 'white' : 'black',
                    }}
                    onClick={(_e): YesNoToggleOptionAction =>
                        yesNoToggleOption(node, YesNoResponse.Yes)
                    }
                >
                    {' '}
                    Yes{' '}
                </button>
                <button
                    className='button_yesno'
                    style={{
                        backgroundColor:
                            answer === YesNoResponse.No
                                ? 'lightslategrey'
                                : 'whitesmoke',
                        color: answer === YesNoResponse.No ? 'white' : 'black',
                    }}
                    onClick={(): YesNoToggleOptionAction =>
                        yesNoToggleOption(node, YesNoResponse.No)
                    }
                >
                    {' '}
                    No{' '}
                </button>
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
