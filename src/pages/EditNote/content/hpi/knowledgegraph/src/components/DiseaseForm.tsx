import React from 'react';
import '../css/App.css';
import '../../HPI.css';
import { Loader } from 'semantic-ui-react';
import { HpiStateProps } from 'constants/hpiEnums';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import CreateResponse from './CreateResponse';
import { displayedNodesProps } from 'redux/reducers/displayedNodesReducer';
import { selectDisplayedNodes } from 'redux/selectors/displayedNodesSelectors';

//The order goes DiseaseForm -> CreateResponse -> ButtonTag

interface DiseaseFormProps {
    nextStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    prevStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    CCInfo: {
        [x: string]: {
            [diseaseCode: string]: string;
        };
    };
}

export class DiseaseForm extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    continue = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        this.props.nextStep(e);
    };

    back = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        this.props.prevStep(e);
    };

    traverseChildNodes(): JSX.Element[] {
        const { graph, nodes } = this.props.hpi,
            category = Object.keys(this.props.CCInfo)[0],
            parentNode = Object.values(this.props.CCInfo[category])[0],
            nodeToElementDict: { [node: string]: JSX.Element } = {};
        let questionArr: JSX.Element[] = [],
            stack = graph[parentNode].slice().reverse(); // add child nodes in reverse bc using stack
        while (stack.length) {
            const currNode = stack.pop();
            if (!currNode) continue;
            if (nodes[currNode].text != 'nan') {
                nodeToElementDict[currNode] = (
                    <CreateResponse
                        key={currNode}
                        node={currNode}
                        category={category}
                    />
                );
                questionArr = [...questionArr, nodeToElementDict[currNode]];
            }
            const { displayedNodes } = this.props,
                childEdges = graph[currNode]
                    .slice()
                    .reverse()
                    .filter((node) => displayedNodes.allNodes.includes(node));
            stack = [...stack, ...childEdges];
        }
        return questionArr;
    }

    render() {
        const { hpi, CCInfo } = this.props,
            category = Object.keys(this.props.CCInfo)[0];
        return Object.values(CCInfo[category])[0] in hpi.graph ? (
            <div>{this.traverseChildNodes()} </div>
        ) : (
            <Loader active> </Loader>
        );
    }
}

const mapStateToProps = (
    state: CurrentNoteState
): HpiStateProps & displayedNodesProps => ({
    hpi: selectHpiState(state),
    displayedNodes: selectDisplayedNodes(state),
});

type Props = HpiStateProps & DiseaseFormProps & displayedNodesProps;

export default connect(mapStateToProps)(DiseaseForm);
