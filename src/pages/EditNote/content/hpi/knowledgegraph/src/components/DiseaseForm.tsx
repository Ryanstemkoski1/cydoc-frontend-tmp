import React from 'react';
import '../css/App.css';
import '../../HPI.css';
import { Loader } from 'semantic-ui-react';
import { HpiStateProps, ResponseTypes } from 'constants/hpiEnums';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { YesNoResponse } from 'constants/enums';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import CreateResponse from './CreateResponse';

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
            const childEdges =
                (nodes[currNode].responseType == ResponseTypes.YES_NO &&
                    nodes[currNode].response == YesNoResponse.Yes) ||
                (nodes[currNode].responseType == ResponseTypes.NO_YES &&
                    nodes[currNode].response == YesNoResponse.No) ||
                nodes[currNode].text == 'nan'
                    ? graph[currNode].slice().reverse()
                    : [];
            stack = [...stack, ...childEdges];
        }
        return questionArr;
    }

    render() {
        const { hpi, CCInfo } = this.props,
            category = Object.keys(this.props.CCInfo)[0];
        return Object.values(CCInfo[category])[0] in hpi.graph ? (
            <div> {this.traverseChildNodes()} </div>
        ) : (
            <Loader active> </Loader>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DiseaseFormProps;

export default connect(mapStateToProps)(DiseaseForm);
