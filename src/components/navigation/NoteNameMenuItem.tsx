import React, { useState } from 'react';
import {
    Menu,
    Button,
    Input,
    Modal,
    Form,
    Header,
    InputOnChangeData,
} from 'semantic-ui-react';
import { PatientPronouns } from 'constants/patientInformation';
import DemographicsForm from '../tools/DemographicsForm';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { initialNoteTitle } from 'redux/reducers/currentNoteReducer';
import {
    updateNoteTitle,
    UpdateNoteTitleAction,
} from 'redux/actions/currentNoteActions';
import {
    UpdatePatientInformationAction,
    updatePatientInformation,
} from 'redux/actions/patientInformationActions';
import { selectNoteTitle } from 'redux/selectors/currentNoteSelectors';
import './NoteNameMenuItem.css';

interface StateProps {
    note: CurrentNoteState;
    title: string;
}

interface NavProps {
    mobile: boolean;
}

interface DispatchProps {
    updateNoteTitle: (title: string) => UpdateNoteTitleAction;
    updatePatientInformation: (
        patientName: string,
        pronouns: PatientPronouns
    ) => UpdatePatientInformationAction;
}

type NoteNameMenuItemProps = StateProps & DispatchProps & NavProps;
type FormChangeHandler = (
    e: React.ChangeEvent,
    data: InputOnChangeData
) => void;

interface User {
    username: string;
    [key: string]: string;
}

export interface Context {
    user: User | null;
    token: string | null;
    storeLoginInfo: (user: string, token: string) => void;
    logOut: () => void;
}

// TODO: Connect to backend
// Component that displays and changes note name shown only if parent is EditNote.
const NoteNameMenuItem: React.FunctionComponent<NoteNameMenuItemProps> = (
    props: NoteNameMenuItemProps
) => {
    const { title, updateNoteTitle, updatePatientInformation, mobile } = props;

    // Form fields
    const [open, setOpen] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [pronouns, setPronouns] = useState(PatientPronouns.They);

    /** Updates note in backend
    const [saveButton, setSaveButton] = useState('');
    const [buttonIcon, setButtonIcon] = useState<undefined | string>(undefined);
    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        setSaveButton('loading');
        const updatedNote = {
            ...note,
            modifiedTime: Date.now(),
        };

        try {
            const message = await context.updateNote(updatedNote);
            let resSaveButton = '',
                resButtonIcon = '';
            switch (message) {
                case 'Save Success':
                    resSaveButton = 'positive icon';
                    resButtonIcon = 'check';
                    break;
                case 'Save Failure':
                    resSaveButton = 'negative icon';
                    resButtonIcon = 'close';
                    break;
                default:
                    alert('No message');
            }
            setSaveButton(resSaveButton);
            setButtonIcon(resButtonIcon);
        } catch (e) {
            setSaveButton('negative icon');
            setButtonIcon('close');
        } finally {
            setTimeout(() => {
                setSaveButton('');
                setButtonIcon(undefined);
            }, 2000);
        }
    }; */

    // Modal event handlers
    const openModal = (): void => setOpen(true);
    const closeModal = (): void => setOpen(false);

    // Patient Info form event handlers
    const savePatientInfo = () => {
        updatePatientInformation(patientName, pronouns);
        closeModal();
    };

    const formatOnChange = function (
        action: (val: any) => void
    ): FormChangeHandler {
        return (_e, { value }) => action(value);
    };

    return (
        <Menu.Item className='note-name-menu-item' fitted>
            <>
                <Input
                    aria-label='Note-Title'
                    className='note-title'
                    transparent
                    size='huge'
                    placeholder={initialNoteTitle}
                    onChange={formatOnChange(updateNoteTitle)}
                    onFocus={() =>
                        title === initialNoteTitle && updateNoteTitle('')
                    }
                    onBlur={() =>
                        title === '' && updateNoteTitle(initialNoteTitle)
                    }
                    value={title}
                />
                {!mobile && (
                    <div className='patient-info'>
                        {patientName != '' && <h4>{patientName}</h4>}
                    </div>
                )}
            </>
            <Modal
                className='patient-modal'
                onClose={closeModal}
                onOpen={openModal}
                open={open}
                size='tiny'
                dimmer='inverted'
                trigger={
                    mobile ? (
                        <Button
                            basic
                            color='teal'
                            name='home'
                            icon='info circle'
                        />
                    ) : (
                        <Button
                            className='patient-modal-button'
                            size='tiny'
                            basic
                        >
                            Add/Edit Patient Info
                        </Button>
                    )
                }
            >
                <Header>Patient Information</Header>
                <Modal.Content>
                    <Form>
                        <DemographicsForm
                            pronouns={pronouns}
                            onChange={formatOnChange(setPronouns)}
                        />
                        <Form.Group className='error-div'>
                            <Form.Field
                                fluid
                                id='patientName'
                                type='text'
                                label="Patient's Full Name"
                                className='patient-info-input'
                                placeholder="Enter the patient's name, e.g. Ms. Lee (optional)"
                                control={Input}
                                value={patientName}
                                onChange={formatOnChange(setPatientName)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color='blue'
                        type='submit'
                        onClick={savePatientInfo}
                        content='Save'
                    />
                </Modal.Actions>
            </Modal>
        </Menu.Item>
    );
};

export default connect(
    (state: CurrentNoteState) => ({
        note: state,
        title: selectNoteTitle(state),
    }),
    { updateNoteTitle, updatePatientInformation }
)(NoteNameMenuItem);
