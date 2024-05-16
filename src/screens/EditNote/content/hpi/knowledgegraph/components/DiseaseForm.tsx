import Loader from 'components/tools/Loader/Loader';
import { HpiStateProps } from 'constants/hpiEnums';
import React from 'react';
import { connect } from 'react-redux';
import { CurrentNoteState } from '@redux/reducers';
import { nodesToDisplayInOrder } from '@redux/selectors/displayedNodesSelectors';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import '../HPI.css';
import { HpiHeadersProps } from '../HPIContent';
import '../css/App.css';
import CreateResponse from './CreateResponse';
import style from './DiseaseForm.module.scss';

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
