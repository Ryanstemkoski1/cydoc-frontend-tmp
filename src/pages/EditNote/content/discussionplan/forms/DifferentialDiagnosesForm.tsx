import Dropdown from 'components/tools/RecursiveDropdown';
import React from 'react';
import { connect } from 'react-redux';
import {
    addDifferentialDiagnosis,
    updateDifferentialDiagnosis,
    updateDifferentialDiagnosisComments,
} from '@redux/actions/planActions';
import { CurrentNoteState } from '@redux/reducers';
import {
    PlanDiagnosisFlat,
    selectPlanCondition,
} from '@redux/selectors/planSelectors';
import { Grid, TextArea } from 'semantic-ui-react';
import { PlanAction } from '../util';
import {
    BaseCategoryForm,
    CategoryFormComponent,
    CategoryFormOwnProps,
    CategoryFormProps,
} from './BaseCategoryForm';
// import UpdateDimensions from './UpdateDimensions';
import { DiagnosesOptionMapping } from '_processOptions';
import './DiscussionPlanForms.css';
import './planSections.css';

interface DifferentialDiagnosesDispatchProps {
    addDifferentialDiagnosis: PlanAction;
    updateDifferentialDiagnosisComments: PlanAction;
    updateDifferentialDiagnosis: PlanAction;
}

type ComponentFunction = CategoryFormComponent<PlanDiagnosisFlat>;

const DifferentialDiagnosesForm = (
    props: CategoryFormProps<PlanDiagnosisFlat> &
        DifferentialDiagnosesDispatchProps
) => {
    const { categoryData, formatAction, conditionId, ...actions } = props;

    const gridHeaders = () => (
        <Grid.Row>
            <Grid.Column>Diagnosis</Grid.Column>
            <Grid.Column>Comments</Grid.Column>
        </Grid.Row>
    );

    const mainInput: ComponentFunction = (row, options) => (
        <>
            <Dropdown
                fluid
                search
                selection
                clearable
                loading={options && Object.keys(options.main).length == 0}
                disabled={options && Object.keys(options.main).length == 0}
                transparent={false}
                value={row.diagnosis}
                code={row.code}
                options={(options?.main as DiagnosesOptionMapping) || {}}
                uuid={row.id}
                onChange={formatAction(actions.updateDifferentialDiagnosis)}
                optiontype='main'
                aria-label='Diagnosis-Dropdown'
                placeholder='diagnosis'
                className='main-input'
            />
            <div className='container' id='main-input-div' />
        </>
    );

    const gridColumn: ComponentFunction = (row, options, onAddItem) => {
        return (
            <React.Fragment key={row.id}>
                <Grid.Column width={8}>
                    {mainInput(row, options, onAddItem)}
                </Grid.Column>
                <Grid.Column>
                    <div className='ui form'>
                        <TextArea
                            uuid={row.id}
                            onChange={formatAction(
                                actions.updateDifferentialDiagnosisComments
                            )}
                            value={row.comments}
                            aria-label='Diagnosis-Comment'
                            placeholder='e.g. this diagnosis is more likely because...'
                        />
                    </div>
                </Grid.Column>
            </React.Fragment>
        );
    };

    return (
        <BaseCategoryForm<PlanDiagnosisFlat>
            numColumns={2}
            addRowLabel='diagnosis'
            category='differentialDiagnoses'
            categoryData={categoryData}
            addRow={() => actions.addDifferentialDiagnosis(conditionId)}
            // addRow={formatAction(actions.addDifferentialDiagnosis)}
            components={{
                gridColumn,
                gridHeaders,
                /* eslint-disable-next-line */
                // gridHeaders: () => <></>,
            }}
        />
    );
};

export default connect(
    (state: CurrentNoteState, ownProps: CategoryFormOwnProps) => ({
        categoryData: selectPlanCondition(state, ownProps.conditionId)
            .differentialDiagnoses,
    }),
    {
        addDifferentialDiagnosis,
        updateDifferentialDiagnosisComments,
        updateDifferentialDiagnosis,
    }
)(DifferentialDiagnosesForm);
