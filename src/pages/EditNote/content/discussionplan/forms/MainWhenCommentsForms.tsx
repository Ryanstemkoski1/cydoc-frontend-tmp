/**
 * @fileoverview Components that utilizes [main: string], when, comments fields
 * in the discussion and plan page
 */
import React from 'react';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import {
    selectPlanCondition,
    PlanProceduresAndServicesFlat,
    PlanReferralsFlat,
} from 'redux/selectors/planSelectors';
import {
    addProcedureOrService,
    updateProcedureOrService,
    updateProcedureOrServiceComments,
    updateProcedureOrServiceWhen,
    addReferral,
    updateReferralDepartment,
    updateReferralComments,
    updateReferralWhen,
} from 'redux/actions/planActions';
import {
    CategoryFormProps,
    CategoryFormOwnProps,
    CategoryFormComponent,
    BaseCategoryForm,
} from './BaseCategoryForm';
import { PlanAction, ConditionCategoryKey } from '../util';
import { Grid, TextArea } from 'semantic-ui-react';
import Dropdown from 'components/tools/OptimizedDropdown';
import { WhenResponse } from 'constants/enums';
import _ from 'lodash';
import UpdateDimensions from './UpdateDimensions';
import './DiscussionPlanForms.css';
import './planSections.css';

export const ProceduresAndServicesForm = connect(
    (state: CurrentNoteState, ownProps: CategoryFormOwnProps) => ({
        categoryData: selectPlanCondition(state, ownProps.conditionId)
            .proceduresAndServices,
    }),
    {
        mainOnChange: updateProcedureOrService,
        whenOnChange: updateProcedureOrServiceWhen,
        commentsOnChange: updateProcedureOrServiceComments,
        addRow: addProcedureOrService,
    }
)(
    (
        props: CategoryFormProps<PlanProceduresAndServicesFlat> &
            MainWhenCommentsDispatchProps
    ) => (
        <MainWhenCommentsForm<PlanProceduresAndServicesFlat>
            {...props}
            categoryProps={{
                category: 'proceduresAndServices',
                mainValueName: 'procedure',
                addRowLabel: 'procedure or service',
                getMainValue: (row) => row.procedure,
            }}
        />
    )
);

export const ReferralsForm = connect(
    (state: CurrentNoteState, ownProps: CategoryFormOwnProps) => ({
        categoryData: selectPlanCondition(state, ownProps.conditionId)
            .referrals,
    }),
    {
        mainOnChange: updateReferralDepartment,
        whenOnChange: updateReferralWhen,
        commentsOnChange: updateReferralComments,
        addRow: addReferral,
    }
)(
    (
        props: CategoryFormProps<PlanReferralsFlat> &
            MainWhenCommentsDispatchProps
    ) => (
        <MainWhenCommentsForm<PlanReferralsFlat>
            {...props}
            categoryProps={{
                category: 'referrals',
                mainValueName: 'department',
                addRowLabel: 'department',
                getMainValue: (row) => row.department,
            }}
        />
    )
);

interface MainWhenCommentsDispatchProps {
    addRow: PlanAction;
    mainOnChange: PlanAction;
    whenOnChange: PlanAction;
    commentsOnChange: PlanAction;
}

type MainWhenCommentsOwnProps<T> = CategoryFormProps<T> & {
    categoryProps: {
        category: ConditionCategoryKey;
        mainValueName:
            | keyof PlanProceduresAndServicesFlat
            | keyof PlanReferralsFlat;
        addRowLabel: string;
        getMainValue: (row: T) => string;
    };
};

type MainWhenCommentsFormProps<T> = MainWhenCommentsDispatchProps &
    MainWhenCommentsOwnProps<T>;

/**
 * Base component for forms with {[main: string], when, comments} fields
 */
export const MainWhenCommentsForm = <
    T extends { id: string; when: WhenResponse; comments: string }
>(
    props: MainWhenCommentsFormProps<T>
) => {
    const { mobile, categoryData, categoryProps, formatAction, ...actions } =
        props;
    const { width } = UpdateDimensions();

    const gridHeaders = () => (
        <Grid.Row>
            <Grid.Column>
                {' '}
                {_.upperFirst(categoryProps.mainValueName as string)}{' '}
            </Grid.Column>
            <Grid.Column> When </Grid.Column>
            <Grid.Column> Comments </Grid.Column>
        </Grid.Row>
    );

    const mobileTitle: CategoryFormComponent<T> = (row, options, onAddItem) => (
        <div className='container' id='main-when-mobile-title'>
            {width < 800 ? <label>{categoryProps.mainValueName}</label> : <></>}
            <div className='container' id='main-when-mobile-title-inner' />
            <Dropdown
                fluid
                search
                selection
                allowAdditions
                clearable
                transparent={mobile}
                optiontype='main'
                uuid={row.id}
                options={options?.main || {}}
                onChange={formatAction(actions.mainOnChange)}
                onAddItem={onAddItem}
                value={categoryProps.getMainValue(row)}
                placeholder={categoryProps.mainValueName}
                aria-label={`${categoryProps.mainValueName}-Dropdown`}
                className='main-input'
            />
        </div>
    );

    const whenInput: CategoryFormComponent<T> = (row, options, onAddItem) => (
        <>
            {width < 800 ? (
                <div className='container'>
                    <label>When</label>
                </div>
            ) : (
                <></>
            )}
            <div className='container' id='main-when-mobile-title-inner' />
            <div id='near-width'>
                <Dropdown
                    fluid
                    search
                    selection
                    allowAdditions
                    clearable
                    transparent={mobile}
                    optiontype='when'
                    uuid={row.id}
                    options={options?.when || {}}
                    onChange={formatAction(actions.whenOnChange)}
                    onAddItem={onAddItem}
                    value={row.when}
                    aria-label={`${categoryProps.mainValueName}-When`}
                    placeholder='when'
                    className='expanded-input'
                />
            </div>
        </>
    );

    const gridColumn: CategoryFormComponent<T> = (row, options, onAddItem) => (
        <React.Fragment key={row.id}>
            <Grid.Column>{mobileTitle(row, options, onAddItem)}</Grid.Column>
            <Grid.Column>{whenInput(row, options, onAddItem)}</Grid.Column>
            <Grid.Column>
                <div className='ui form'>
                    <TextArea
                        name='comment'
                        uuid={row.id}
                        value={row.comments}
                        onChange={formatAction(actions.commentsOnChange)}
                        aria-label={`${
                            categoryProps.mainValueName as string
                        }-Comment`}
                        placeholder='comments'
                    />
                </div>
            </Grid.Column>
        </React.Fragment>
    );

    const mobileContent: CategoryFormComponent<T> = (
        row,
        options,
        onAddItem
    ) => (
        <>
            {whenInput(row, options, onAddItem)}
            <div className='container' id='main-when-mobile-content' />
            <label>Comments</label>
            <div className='container' id='main-when-mobile-title-inner' />
            <div className='ui form' id='near-width'>
                <TextArea
                    fluid
                    type='text'
                    transparent
                    uuid={row.id}
                    value={row.comments}
                    onChange={formatAction(actions.commentsOnChange)}
                    placeholder='comments'
                    aria-label={`${
                        categoryProps.mainValueName as string
                    }-Comment`}
                    className='expanded-input'
                />
            </div>
        </>
    );

    return (
        <BaseCategoryForm
            mobile={mobile}
            category={categoryProps.category}
            categoryData={categoryData}
            numColumns={3}
            addRowLabel={categoryProps.addRowLabel}
            addRow={formatAction(actions.addRow)}
            components={{
                gridColumn,
                gridHeaders,
                mobileTitle,
                mobileContent,
            }}
        />
    );
};
