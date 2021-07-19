import React from 'react';
import { Grid, TextArea } from 'semantic-ui-react';
import Dropdown from 'components/tools/OptimizedDropdown';
import { PlanAction } from '../util';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import {
    PlanPrescriptionFlat,
    selectPlanCondition,
} from 'redux/selectors/planSelectors';
import {
    addPrescription,
    updatePrescriptionComments,
    updatePrescriptionDose,
    updatePrescriptionType,
    updatePrescriptionSignature,
} from 'redux/actions/planActions';
import {
    CategoryFormProps,
    CategoryFormComponent,
    CategoryFormOwnProps,
    BaseCategoryForm,
} from './BaseCategoryForm';
import UpdateDimensions from './UpdateDimensions';

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
    const { mobile, categoryData, formatAction, ...actions } = props;
    const { width } = UpdateDimensions();

    const gridHeaders = () => (
        <Grid.Row>
            <Grid.Column> Rx </Grid.Column>
            <Grid.Column> Signature (Sig) </Grid.Column>
            <Grid.Column> Comments </Grid.Column>
        </Grid.Row>
    );

    const mainInput: ComponentFunction = (row, options, onAddItem) => (
        <div
            className='container'
            style={{
                width: width < 800 ? '90%' : '',
                marginTop: width < 800 ? '10px' : '0px',
                marginBottom: '15px',
            }}
        >
            <Dropdown
                fluid
                search
                selection
                allowAdditions
                clearable
                optiontype='main'
                transparent={mobile}
                uuid={row.id}
                value={row.type}
                options={options?.main || {}}
                onChange={formatAction(actions.updatePrescriptionType)}
                onAddItem={onAddItem}
                aria-label='Prescription-Dropdown'
                placeholder='medication name'
                className='main-input recipe'
            />
            <div className='container' style={{ height: '20px' }} />
            <label>Prescription Dose</label>
            <div className='container' style={{ height: '10px' }} />
            <div className='ui form'>
                <TextArea
                    fluid
                    type='text'
                    transparent={mobile}
                    uuid={row.id}
                    value={row.dose}
                    onChange={formatAction(actions.updatePrescriptionDose)}
                    aria-label='Prescription-Amount'
                    placeholder='e.g. 81 mg tablet'
                    className={`recipe-amount ${!mobile && 'lg'}`}
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

    const mobileTitle: ComponentFunction = (row, options, onAddItem) => (
        <div className='recipe'>
            <label> Rx </label>
            {mainInput(row, options, onAddItem)}
        </div>
    );

    const mobileContent: ComponentFunction = (row) => (
        <>
            <label style={{ marginLeft: '15px' }}> Signature (Sig) </label>
            <div className='container' style={{ height: '5px' }} />
            <div className='ui form' style={{ width: '90%', margin: 'auto' }}>
                <TextArea
                    fluid
                    transparent
                    type='text'
                    uuid={row.id}
                    value={row.signature}
                    onChange={formatAction(actions.updatePrescriptionSignature)}
                    placeholder='e.g. 1 tablet every 8 hours'
                    aria-label='Prescription-Signature'
                    className='expanded-input'
                />
            </div>
            <div className='container' style={{ height: '10px' }} />
            <label style={{ marginLeft: '15px' }}> Comments </label>
            <div className='container' style={{ height: '5px' }} />
            <div className='ui form' style={{ width: '90%', margin: 'auto' }}>
                <TextArea
                    fluid
                    transparent
                    type='text'
                    uuid={row.id}
                    value={row.comments}
                    onChange={formatAction(actions.updatePrescriptionComments)}
                    placeholder='e.g. take with food'
                    aria-label='Prescription-Comment'
                    className='expanded-input'
                />
            </div>
        </>
    );

    return (
        <BaseCategoryForm<PlanPrescriptionFlat>
            mobile={mobile}
            category='prescriptions'
            categoryData={categoryData}
            numColumns={3}
            addRowLabel='prescription'
            addRow={formatAction(actions.addPrescription)}
            components={{
                gridColumn,
                gridHeaders,
                mobileTitle,
                mobileContent,
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
