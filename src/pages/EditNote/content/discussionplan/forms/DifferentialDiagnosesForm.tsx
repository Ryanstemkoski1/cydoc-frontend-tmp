import React from 'react';
import Dropdown from 'components/tools/OptimizedDropdown';
import { Grid, Input } from 'semantic-ui-react';
import { PlanAction } from '../util';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import {
    PlanDiagnosisFlat,
    selectPlanCondition,
} from 'redux/selectors/planSelectors';
import {
    addDifferentialDiagnosis,
    updateDifferentialDiagnosisComments,
    updateDifferentialDiagnosis,
} from 'redux/actions/planActions';
import {
    CategoryFormProps,
    CategoryFormComponent,
    CategoryFormOwnProps,
    BaseCategoryForm,
} from './BaseCategoryForm';

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
    const { mobile, categoryData, formatAction, ...actions } = props;

    const mobileTitle: ComponentFunction = (row, options, onAddItem) => (
        <Dropdown
            fluid
            search
            clearable
            allowAdditions
            transparent={mobile}
            value={row.diagnosis}
            options={options?.main || {}}
            uuid={row.id}
            onChange={formatAction(actions.updateDifferentialDiagnosis)}
            onAddItem={onAddItem}
            optiontype='main'
            aria-label='Diagnosis-Dropdown'
            placeholder='diagnosis'
            className='main-input'
        />
    );

    const mobileContent: ComponentFunction = (row) => (
        <Input
            fluid
            value={row.comments}
            uuid={row.id}
            transparent={mobile}
            onChange={formatAction(actions.updateDifferentialDiagnosisComments)}
            aria-label='Diagnosis-Comment'
            placeholder='comments'
            className='expanded-input'
        />
    );

    const gridColumn: ComponentFunction = (row, options, onAddItem) => {
        return (
            <React.Fragment key={row.id}>
                <Grid.Column width={6}>
                    {mobileTitle(row, options, onAddItem)}
                </Grid.Column>
                <Grid.Column width={10}>{mobileContent(row)}</Grid.Column>
            </React.Fragment>
        );
    };

    return (
        <BaseCategoryForm<PlanDiagnosisFlat>
            mobile={mobile}
            numColumns={2}
            addRowLabel='diagnosis'
            category='differentialDiagnoses'
            categoryData={categoryData}
            addRow={formatAction(actions.addDifferentialDiagnosis)}
            components={{
                mobileTitle,
                mobileContent,
                gridColumn,
                /* eslint-disable-next-line */
                gridHeaders: () => <></>,
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
