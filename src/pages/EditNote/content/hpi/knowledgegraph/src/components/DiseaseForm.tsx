import React from 'react';
import '../css/App.css';
import '../../HPI.css';
import { Loader } from 'semantic-ui-react';
import { HpiStateProps } from 'constants/hpiEnums';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import CreateResponse from './CreateResponse';
import { nodesToDisplayInOrder } from 'redux/selectors/displayedNodesSelectors';
import { HpiHeadersProps } from '../../HPIContent';

//The order goes DiseaseForm -> CreateResponse -> ButtonTag

interface DiseaseFormProps {
    nextStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    prevStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    category: string;
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
        return this.props.nodesToDisplayInOrder.map((node) => (
            <CreateResponse
                key={node}
                node={node}
                category={this.props.category}
            />
        ));
    }

    render() {
        const { hpi, category, hpiHeaders } = this.props;
        return Object.values(hpiHeaders.parentNodes[category])[0] in
            hpi.graph ? (
            <div>{this.traverseChildNodes()} </div>
        ) : (
            <Loader active> </Loader>
        );
    }
}

interface nodesToDisplayInOrderProps {
    nodesToDisplayInOrder: string[];
}

interface DiseaseFormProps {
    category: string;
}

const mapStateToProps = (
    state: CurrentNoteState,
    ownProps: DiseaseFormProps
): HpiStateProps & nodesToDisplayInOrderProps & HpiHeadersProps => ({
    hpi: selectHpiState(state),
    nodesToDisplayInOrder: nodesToDisplayInOrder(ownProps.category, state),
    hpiHeaders: state.hpiHeaders,
});

type Props = HpiStateProps &
    DiseaseFormProps &
    nodesToDisplayInOrderProps &
    HpiHeadersProps;

export default connect(mapStateToProps)(DiseaseForm);
