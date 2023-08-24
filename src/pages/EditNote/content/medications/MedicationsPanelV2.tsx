import { OptionMapping } from '_processOptions';
import Dropdown from 'components/tools/OptimizedDropdown';
import YesAndNo from 'components/tools/YesAndNo/YesAndNo';
import { YesNoResponse } from 'constants/enums';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
    updateComments,
    updateCurrentlyTaking,
    updateDose,
    updateDrugName,
    updateEndYear,
    updateReasonForTaking,
    updateSchedule,
    updateSideEffects,
    updateStartYear,
} from 'redux/actions/medicationsActions';
import { CurrentNoteState } from 'redux/reducers';
import { MedicationsItem } from 'redux/reducers/medicationsReducer';
import {
    selectMedicationsEntries,
    selectMedicationsState,
} from 'redux/selectors/medicationsSelectors';
import {
    Accordion,
    Input,
    Label,
    TextArea,
    TextAreaProps,
} from 'semantic-ui-react';
import Delete from '../../../../assets/delete.svg';
import { DropdownType } from './MedicationsContent';
import style from './MedicationsPanel.module.scss';

interface OwnProps {
    isPreview: boolean;
    previewValue?: string;
    sideEffectsOptions: OptionMapping;
    medicationOptions: OptionMapping;
    diseaseOptions: OptionMapping;
    currentYear: number;
    handleAddition: (optionType: DropdownType, value: string) => void;
    deleteRow: (e: any, index: string) => void;
    medIndex: string;
    singleType?: boolean;
    isNote?: boolean;
    dimensions?: any;
}
/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & OwnProps;

interface State {
    active: boolean;
    invalidStartYear: boolean;
    invalidEndYear: boolean;
}

class MedicationsPanelV2 extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const values = props.medicationsState[props.medIndex];
        this.state = {
            active: false,
            invalidStartYear:
                !props.isPreview &&
                values.startYear != -1 &&
                (values.startYear < 1900 ||
                    values.startYear > props.currentYear),
            invalidEndYear:
                !props.isPreview &&
                values.endYear != -1 &&
                (values.endYear < 1900 || values.endYear > props.currentYear),
        };

        this.onTitleClick = this.onTitleClick.bind(this);
        this.makePanel = this.makePanel.bind(this);
    }

    onTitleClick = (event: React.MouseEvent) => {
        if (
            (event.target as HTMLAreaElement).className === 'three wide' ||
            (event.target as HTMLAreaElement).className === '' ||
            (event.target as HTMLAreaElement).className === 'for-text' ||
            (event.target as HTMLAreaElement).className === 'close icon' ||
            (event.target as HTMLAreaElement).className ===
                'ui input content-input content-dropdown medication drug-input padding-bottom'
        ) {
            this.setState({
                active: !this.state.active,
            });
        } else {
            this.setState({
                active: true,
            });
        }
    };

    handleYearChange(value: string, type: string) {
        // Year validation
        if (type === 'Start Year') {
            const onset = +value;
            this.setState({
                invalidStartYear:
                    value !== '' &&
                    (isNaN(onset) ||
                        onset < 1900 ||
                        onset > this.props.currentYear),
            });
        } else if (type === 'End Year') {
            const endYear = +value;
            this.setState({
                invalidEndYear:
                    value !== '' &&
                    (isNaN(endYear) ||
                        endYear < 1900 ||
                        endYear > this.props.currentYear),
            });
        }
    }

    onChangeFormatter = <T,>(action: (value: T) => void) => {
        return (_e: any, { value }: { value: T }) => {
            this.setState({
                active: true,
            });
            action(value);
        };
    };

    onDoseChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        _data: TextAreaProps
    ) => {
        const value = (event.target as HTMLTextAreaElement).value;
        this.props.updateDose(this.props.medIndex, value);
    };

    onScheduleChange = (
        event: React.FormEvent<HTMLTextAreaElement>,
        _data: TextAreaProps
    ) => {
        const value = (event.target as HTMLTextAreaElement).value;
        this.props.updateSchedule(this.props.medIndex, value);
    };

    onMedicationsBlur = (event: any) => {
        if (event.target.value !== '') {
            this.props.handleAddition(
                DropdownType.Medications,
                event.target.value
            );
            this.props.updateDrugName(this.props.medIndex, event.target.value);
        }
    };

    onAddItemFormatter = (
        action: (type: DropdownType, value: string) => void
    ) => {
        const medicationEntry =
            this.props.medicationsState[this.props.medIndex];
        if (!medicationEntry.isCurrentlyTaking.length)
            this.props.updateCurrentlyTaking(
                this.props.medIndex,
                YesNoResponse.Yes
            );
        return (
            _e: any,
            { optiontype, value }: { optiontype: DropdownType; value: string }
        ) => {
            action(optiontype, value as string);
        };
    };

    makePanel() {
        const { isPreview } = this.props;

        // TODO: Remove the preview logic from this component (and potentially others in Patient History)
        //       and make it an entirely separate component for more explicit typecasting and functional differences
        const medicationEntry =
            this.props.medicationsState[this.props.medIndex];

        const drugNameInput = (
            <div id='width-full' className='full-width full-view'>
                {!isPreview && (
                    <>
                        <Dropdown
                            fluid
                            search
                            selection
                            clearable
                            allowAdditions
                            icon=''
                            optiontype='medicationOptions'
                            type='Drug Name'
                            options={this.props.medicationOptions}
                            placeholder='Medication name'
                            onChange={this.onChangeFormatter((value) =>
                                this.props.updateDrugName(
                                    this.props.medIndex,
                                    value as string
                                )
                            )}
                            value={
                                (medicationEntry as MedicationsItem).drugName
                            }
                            onBlur={(event: any) =>
                                this.onMedicationsBlur(event)
                            }
                            onAddItem={this.onAddItemFormatter(
                                (optiontype, value) =>
                                    this.props.handleAddition(optiontype, value)
                            )}
                        />
                    </>
                )}
            </div>
        );

        const doseInput = (
            <div className='ui form' id='dose-input-div'>
                <div id='dose-input'>
                    {
                        <TextArea
                            fluid
                            transparent
                            disabled={isPreview}
                            type='Dose'
                            placeholder='e.g. 81 mg tablet'
                            onChange={this.onDoseChange}
                            value={
                                isPreview
                                    ? ''
                                    : (medicationEntry as MedicationsItem)[
                                          'dose'
                                      ]
                            }
                            aria-label='Dose-Input'
                            className='content-input'
                        />
                    }
                </div>
            </div>
        );

        const scheduleInput = (
            <>
                <div className='ui form' id='schedule-input-div'>
                    <div id='schedule-input'>
                        {
                            <TextArea
                                fluid
                                transparent
                                disabled={isPreview}
                                type='Schedule'
                                placeholder='e.g. once a day'
                                onChange={this.onScheduleChange}
                                value={
                                    isPreview
                                        ? ''
                                        : (medicationEntry as MedicationsItem)[
                                              'schedule'
                                          ]
                                }
                                aria-label='Schedule-Input'
                                className='content-input'
                            />
                        }
                    </div>
                </div>
            </>
        );

        const reasonForTakingInput = (
            <div id='reason-input-div'>
                <div id='reason-input'>
                    {!isPreview && (
                        <div>
                            <Dropdown
                                fluid
                                search
                                selection
                                allowAdditions
                                icon=''
                                optiontype='diseaseOptions'
                                type='Reason for Taking'
                                options={this.props.diseaseOptions}
                                placeholder='e.g. arthritis'
                                onChange={this.onChangeFormatter((value) =>
                                    this.props.updateReasonForTaking(
                                        this.props.medIndex,
                                        value as string
                                    )
                                )}
                                value={
                                    (medicationEntry as MedicationsItem)[
                                        'reasonForTaking'
                                    ]
                                }
                                onAddItem={this.onAddItemFormatter(
                                    (optiontype, value) =>
                                        this.props.handleAddition(
                                            optiontype,
                                            value
                                        )
                                )}
                                className='side-effects medication'
                                aria-label='Reason-For-Taking-Dropdown'
                                direction='left'
                            />
                        </div>
                    )}
                </div>
            </div>
        );

        const startYearInput = (
            <div className='margin' id='start-year-input'>
                <label
                    className='medications-content-input-label'
                    id='start-year-label'
                >
                    <b>Start Year:</b>
                </label>
                <div id='width-full'>
                    <Input
                        fluid
                        transparent
                        disabled={isPreview}
                        type='Start Year'
                        placeholder='e.g. 2020'
                        value={
                            isPreview ||
                            (medicationEntry as MedicationsItem).startYear == -1
                                ? ''
                                : (medicationEntry as MedicationsItem).startYear
                        }
                        onBlur={(e: Event) => {
                            this.handleYearChange(
                                (e.target as HTMLInputElement).value,
                                'Start Year'
                            );
                        }}
                        onChange={(_event, { value }) => {
                            const numberInput = parseInt(value);
                            if (!isNaN(numberInput)) {
                                this.props.updateStartYear(
                                    this.props.medIndex,
                                    numberInput
                                );
                            } else if (value == '') {
                                this.props.updateStartYear(
                                    this.props.medIndex,
                                    -1
                                );
                            }
                        }}
                        aria-label='Start-Year-Input'
                        className='content-input content-dropdown'
                    />
                    {this.state.invalidStartYear && (
                        <p className='year-validation-mobile-error'>
                            Please enter a valid year between 1900 and{' '}
                            {this.props.currentYear}
                        </p>
                    )}
                </div>
            </div>
        );

        const currentlyTakingInput = (
            <div id='currently-taking'>
                <Label
                    basic
                    className='ui input content-input medications-content-input-label'
                    content='Currently Taking: '
                />
                {
                    <>
                        <YesAndNo
                            yesButtonActive={
                                !isPreview &&
                                (medicationEntry as MedicationsItem)
                                    .isCurrentlyTaking === YesNoResponse.Yes
                            }
                            handleYesButtonClick={() => {
                                this.props.updateCurrentlyTaking(
                                    this.props.medIndex,
                                    YesNoResponse.No
                                );
                            }}
                            noButtonActive={
                                !isPreview &&
                                (medicationEntry as MedicationsItem)
                                    .isCurrentlyTaking === YesNoResponse.No
                            }
                            handleNoButtonClick={() => {
                                this.props.updateCurrentlyTaking(
                                    this.props.medIndex,
                                    YesNoResponse.No
                                );
                            }}
                        />
                    </>
                }
            </div>
        );

        const endYearInput = (
            <div className='margin' id='end-year-input'>
                {!isPreview &&
                    (medicationEntry as MedicationsItem).isCurrentlyTaking ===
                        'NO' && (
                        <>
                            <label
                                className='medications-content-input-label'
                                id='end-year-label'
                            >
                                <b>End Year:</b>
                            </label>
                            <div id='width-full'>
                                <Input
                                    fluid
                                    transparent
                                    disabled={isPreview}
                                    type='End Year'
                                    placeholder='e.g. 2020'
                                    value={
                                        isPreview ||
                                        (medicationEntry as MedicationsItem)
                                            .endYear == -1
                                            ? ''
                                            : (
                                                  medicationEntry as MedicationsItem
                                              ).endYear
                                    }
                                    onBlur={(e: Event) => {
                                        this.handleYearChange(
                                            (e.target as HTMLInputElement)
                                                .value,
                                            'End Year'
                                        );
                                    }}
                                    onChange={(_event, { value }) => {
                                        const numberInput = parseInt(value);
                                        if (!isNaN(numberInput)) {
                                            this.props.updateEndYear(
                                                this.props.medIndex,
                                                numberInput
                                            );
                                        } else if (value == '') {
                                            this.props.updateEndYear(
                                                this.props.medIndex,
                                                -1
                                            );
                                        }
                                    }}
                                    aria-label='End-Year-Input'
                                    className='content-input content-dropdown'
                                />
                                {this.state.invalidEndYear && (
                                    <p className='year-validation-mobile-error'>
                                        Please enter a valid year between 1900
                                        and {this.props.currentYear}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
            </div>
        );

        const sideEffectsInput = (
            <div className='margin'>
                <Label
                    basic
                    className={'medications-content-input-label'}
                    content={'Side Effects: '}
                />
                <div id='width-full reason-dropdown'>
                    {!isPreview && (
                        <Dropdown
                            fluid
                            search
                            selection
                            multiple
                            allowAdditions
                            icon=''
                            options={this.props.sideEffectsOptions}
                            optiontype='sideEffectsOptions'
                            type='Side Effects'
                            placeholder='Click here to select side effect(s)'
                            onChange={this.onChangeFormatter((value) =>
                                this.props.updateSideEffects(
                                    this.props.medIndex,
                                    value as string[]
                                )
                            )}
                            value={
                                (medicationEntry as MedicationsItem).sideEffects
                            }
                            onAddItem={this.onAddItemFormatter(
                                (optiontype, value) =>
                                    this.props.handleAddition(optiontype, value)
                            )}
                            aria-label='Side-Effects-Dropdown'
                            className='side-effects'
                        />
                    )}
                </div>
                {/* </Input> */}
            </div>
        );

        const commentsInput = (
            <div className='margin' id='comments-input'>
                <label
                    className='medications-content-input-label'
                    id='comments-label'
                >
                    <b>Comments:</b>
                </label>
                <div id='width-full'>
                    <Input
                        fluid
                        transparent
                        disabled={isPreview}
                        type='Comments'
                        placeholder='e.g. take with food'
                        onChange={(_event, data) => {
                            this.props.updateComments(
                                this.props.medIndex,
                                data.value
                            );
                        }}
                        value={
                            isPreview
                                ? ''
                                : (medicationEntry as MedicationsItem).comments
                        }
                        aria-label='Comments-Input'
                        className='content-input'
                    />
                </div>
            </div>
        );

        const titleContent = (
            <>
                {this.props.singleType ? (
                    <div
                        className={`${style.medication} flex align-center justify-between`}
                    >
                        <aside>{drugNameInput}</aside>
                        <button
                            onClick={(e) => {
                                this.props.deleteRow(e, this.props.medIndex);
                            }}
                        >
                            <img src={Delete} alt='Remove' />
                        </button>
                    </div>
                ) : (
                    <table>
                        <tbody>
                            <tr>
                                <td>{drugNameInput}</td>
                                <td>{doseInput}</td>
                                <td>{scheduleInput}</td>
                                <td>
                                    <h3 className='for-text'>for</h3>
                                </td>
                                <td>{reasonForTakingInput}</td>

                                <button
                                    onClick={(e) => {
                                        this.props.deleteRow(
                                            e,
                                            this.props.medIndex
                                        );
                                    }}
                                >
                                    <img src={Delete} alt='Remove' />
                                </button>
                            </tr>
                        </tbody>
                    </table>
                )}
            </>
        );

        const contentInputs = (
            <>
                {startYearInput}
                {currentlyTakingInput}
                {endYearInput}
                {sideEffectsInput}
                {commentsInput}
            </>
        );

        return {
            titleContent,
            contentInputs,
        };
    }

    render() {
        const { titleContent, contentInputs } = this.makePanel();
        return (
            <>
                {titleContent}
                {!this.props.isNote && (
                    <Accordion.Content active={this.state.active}>
                        {contentInputs}
                    </Accordion.Content>
                )}
            </>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    medicationsState: selectMedicationsState(state),
    medications: selectMedicationsEntries(state),
});

const mapDispatchToProps = {
    updateDrugName,
    updateStartYear,
    updateCurrentlyTaking,
    updateEndYear,
    updateSchedule,
    updateDose,
    updateReasonForTaking,
    updateSideEffects,
    updateComments,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connect(mapStateToProps, mapDispatchToProps)(MedicationsPanelV2);
