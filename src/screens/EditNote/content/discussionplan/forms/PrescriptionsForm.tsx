import { OptionMapping } from '../../../../../_processOptions';
import Dropdown from '@components/tools/OptimizedDropdown';
import React from 'react';
import { connect } from 'react-redux';
import {
    addPrescription,
    updatePrescriptionComments,
    updatePrescriptionDose,
    updatePrescriptionSignature,
    updatePrescriptionType,
} from '@redux/actions/planActions';
import { CurrentNoteState } from '@redux/reducers';
import {
    PlanPrescriptionFlat,
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
import './DiscussionPlanForms.css';
import useUpdateDimensions from './useUpdateDimensions';
import './planSections.css';

interface PrescriptionsDispatchProps {
    addPrescription: PlanAction;
    updatePrescriptionComments: PlanAction;
    updatePrescriptionDose: PlanAction;
    updatePrescriptionType: PlanAction;
    updatePrescriptionSignature: PlanAction;
}

type ComponentFunction = CategoryFormComponent<PlanPrescriptionFlat>;

const PrescriptionsForm = (
    props: CategoryFormProps<PlanPrescriptionFlat> & PrescriptionsDispatchProps
) => {
    const { categoryData, formatAction, ...actions } = props;
    useUpdateDimensions();

    const gridHeaders = () => (
        <Grid.Row>
            <Grid.Column> Rx </Grid.Column>
            <Grid.Column> Signature (Sig) </Grid.Column>
            <Grid.Column> Comments </Grid.Column>
        </Grid.Row>
    );

    const mainInput: ComponentFunction = (row, options, onAddItem) => (
        <div className='container' id='prescriptions-main-input-container'>
            <Dropdown
                fluid
                search
                selection
                allowAdditions
                clearable
                optiontype='main'
                transparent={false}
                uuid={row.id}
                value={row.type}
                options={(options?.main as OptionMapping) || {}}
                onChange={formatAction(actions.updatePrescriptionType)}
                onAddItem={onAddItem}
                aria-label='Prescription-Dropdown'
                placeholder='medication name'
                className='main-input recipe'
            />
            <div className='container' id='prescriptions-container3' />
            <label>Prescription Dose</label>
            <div className='container' id='prescriptions-container2' />
            <div className='ui form'>
                <TextArea
                    type='text'
                    uuid={row.id}
                    value={row.dose}
                    onChange={formatAction(actions.updatePrescriptionDose)}
                    aria-label='Prescription-Amount'
                    placeholder='e.g. 81 mg tablet'
                    className={`recipe-amount lg`}
                />
            </div>
        </div>
    );

    const gridColumn: ComponentFunction = (row, options, onAddItem) => (
        <React.Fragment key={row.id}>
            <Grid.Column>{mainInput(row, options, onAddItem)}</Grid.Column>
            <Grid.Column>
                <div className='ui form'>
                    <TextArea
                        uuid={row.id}
                        onChange={formatAction(
                            actions.updatePrescriptionSignature
                        )}
                        value={row.signature}
                        aria-label='Prescription-Signature'
                        placeholder='e.g. 1 tablet every 8 hours'
                    />
                </div>
            </Grid.Column>
            <Grid.Column>
                <div className='ui form'>
                    <TextArea
                        uuid={row.id}
                        onChange={formatAction(
                            actions.updatePrescriptionComments
                        )}
                        value={row.comments}
                        aria-label='Prescription-Comment'
                        placeholder='e.g. take with food'
                    />
                </div>
            </Grid.Column>
        </React.Fragment>
    );

    return (
        <BaseCategoryForm<PlanPrescriptionFlat>
            category='prescriptions'
            categoryData={categoryData}
            numColumns={3}
            addRowLabel='prescription'
            // addRow={formatAction(actions.addPrescription)}
            addRow={() => actions.addPrescription(actions.conditionId)}
            components={{
                gridColumn,
                gridHeaders,
            }}
        />
    );
};

export default connect(
    (state: CurrentNoteState, ownProps: CategoryFormOwnProps) => ({
        categoryData: selectPlanCondition(state, ownProps.conditionId)
            .prescriptions,
    }),
    {
        addPrescription,
        updatePrescriptionComments,
        updatePrescriptionDose,
        updatePrescriptionType,
        updatePrescriptionSignature,
    }
)(PrescriptionsForm);
