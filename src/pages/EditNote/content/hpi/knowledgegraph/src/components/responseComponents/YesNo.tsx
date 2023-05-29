import React from 'react';
import { YesNoResponse } from 'constants/enums';
import { CurrentNoteState } from 'redux/reducers';
import {
    HpiStateProps,
    NodeInterface,
    ResponseTypes,
} from 'constants/hpiEnums';
import { connect } from 'react-redux';
import {
    yesNoToggleOption,
    YesNoToggleOptionAction,
} from 'redux/actions/hpiActions';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ToggleButton from 'components/tools/ToggleButton';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import {
    AddDisplayedNodesAction,
    RemoveDisplayedNodesAction,
    addDisplayedNodes,
    removeDisplayedNodes,
} from 'redux/actions/displayedNodesActions';
import { displayedNodesProps } from 'redux/reducers/displayedNodesReducer';
import { selectDisplayedNodes } from 'redux/selectors/displayedNodesSelectors';
import { displayedNodesCutOff } from 'constants/displayedNodesCutOff';

interface YesNoProps {
    node: string;
}

class YesNo extends React.Component<Props> {
    yesNoResponse = (response: YesNoResponse) => {
        const {
                hpi,
                node,
                yesNoToggleOption,
                displayedNodes,
                addDisplayedNodes,
                removeDisplayedNodes,
            } = this.props,
            { graph, nodes } = hpi,
            sumTotalQuestions =
                displayedNodes.allNodes.length -
                displayedNodes.notDisplayed.length;
        yesNoToggleOption(node, response);
        const toggleChildQuestions =
            response !== '' &&
            ((nodes[node].responseType == ResponseTypes.YES_NO &&
                response == YesNoResponse.Yes) ||
                (nodes[node].responseType == ResponseTypes.NO_YES &&
                    response == YesNoResponse.No));
        const childEdges =
            sumTotalQuestions < displayedNodesCutOff && toggleChildQuestions
                ? graph[node]
                      .slice()
                      .reverse()
                      .slice(0, displayedNodesCutOff - sumTotalQuestions)
                : [];
        if (childEdges.length)
            addDisplayedNodes(nodes[node].category, childEdges, nodes);
        else if (!toggleChildQuestions)
            removeDisplayedNodes(nodes[node].category, graph[node]);
    };
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
                        this.yesNoResponse(YesNoResponse.Yes)
                    }
                />
                <ToggleButton
                    className='button_yesno'
                    active={hpi.nodes[node].response == YesNoResponse.No}
                    condition='No'
                    title='No'
                    onToggleButtonClick={(_e) =>
                        this.yesNoResponse(YesNoResponse.No)
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
    addDisplayedNodes: (
        category: string,
        nodesArr: string[],
        nodes: {
            [node: string]: NodeInterface;
        }
    ) => AddDisplayedNodesAction;
    removeDisplayedNodes: (
        category: string,
        nodes: string[]
    ) => RemoveDisplayedNodesAction;
}

const mapStateToProps = (
    state: CurrentNoteState
): HpiStateProps & displayedNodesProps => ({
    hpi: selectHpiState(state),
    displayedNodes: selectDisplayedNodes(state),
});

type Props = HpiStateProps & DispatchProps & YesNoProps & displayedNodesProps;

const mapDispatchToProps = {
    yesNoToggleOption,
    addDisplayedNodes,
    removeDisplayedNodes,
};

export default connect(mapStateToProps, mapDispatchToProps)(YesNo);
