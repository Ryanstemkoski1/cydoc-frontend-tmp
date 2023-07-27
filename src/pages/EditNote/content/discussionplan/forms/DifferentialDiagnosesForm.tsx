import React from 'react';
import Dropdown from 'components/tools/RecursiveDropdown';
import { Grid, TextArea } from 'semantic-ui-react';
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
// import UpdateDimensions from './UpdateDimensions';
import './DiscussionPlanForms.css';
import './planSections.css';
import { DiagnosesOptionMapping } from '_processOptions';

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
    // const { width } = UpdateDimensions();

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
                transparent={mobile}
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

    const mobileTitle: ComponentFunction = (row, options, onAddItem) => (
        <div className='mobile-title'>
            <label>Diagnosis</label>
            <div className='container' id='container-div' />
            {mainInput(row, options, onAddItem)}
        </div>
    );

    const mobileContent: ComponentFunction = (row) => (
        <>
            <label>Comments</label>
            <div className='container' id='container-div' />
            <div className='ui form' id='mobile-content-form'>
                <TextArea
                    fluid
                    value={row.comments}
                    uuid={row.id}
                    type='text'
                    transparent={mobile}
                    onChange={formatAction(
                        actions.updateDifferentialDiagnosisComments
                    )}
                    aria-label='Diagnosis-Comment'
                    placeholder='e.g. this diagnosis is more likely because...'
                    className='expanded-input'
                />
            </div>
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
                {/* <Grid.Column width={10}>{mobileContent(row)}</Grid.Column> */}
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
