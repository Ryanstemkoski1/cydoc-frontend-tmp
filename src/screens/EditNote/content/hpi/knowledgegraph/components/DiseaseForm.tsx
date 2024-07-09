import Loader from '@components/tools/Loader/Loader';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { CurrentNoteState } from '@redux/reducers';
import { nodesToDisplayInOrder } from '@redux/selectors/displayedNodesSelectors';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import '../HPI.css';
import '../css/App.css';
import CreateResponse from './CreateResponse';
import style from './DiseaseForm.module.scss';

//The order goes DiseaseForm -> CreateResponse -> ButtonTag

interface OwnProps {
    nextStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    prevStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    category: string;
}

type ReduxProps = ConnectedProps<typeof connector>;

type Props = OwnProps & ReduxProps;

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
            <div className={style.diseaseForm} key={node}>
                <CreateResponse node={node} category={this.props.category} />
            </div>
        ));
    }

    render() {
        const { hpi, category, hpiHeaders } = this.props;
        return Object.values(hpiHeaders.parentNodes[category])[0] in
            hpi.graph ? (
            this.traverseChildNodes()
        ) : (
            <Loader />
        );
    }
}

const mapStateToProps = (state: CurrentNoteState, ownProps: OwnProps) => ({
    hpi: selectHpiState(state),
    nodesToDisplayInOrder: nodesToDisplayInOrder(ownProps.category, state),
    hpiHeaders: state.hpiHeaders,
});

const connector = connect(mapStateToProps);

export default connector(DiseaseForm);
