import React, { useState, useContext } from 'react';
import {
    Menu,
    Button,
    Input,
    Modal,
    Form,
    Header,
    InputOnChangeData,
} from 'semantic-ui-react';
import NotesContext from '../../contexts/NotesContext';
import states from 'constants/stateAbbreviations.json';
import DemographicsForm from '../tools/DemographicsForm';
import { connect } from 'react-redux';
import { CurrentNoteState } from 'redux/reducers';
import { initialNoteTitle } from 'redux/reducers/currentNoteReducer';
import {
    updateNoteTitle,
    UpdateNoteTitleAction,
} from 'redux/actions/currentNoteActions';
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
}

type NoteNameMenuItemProps = StateProps & DispatchProps & NavProps;
type FieldError = false | { content: string };
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
    //eslint-disable-next-line
    updateNote: (note: any) => string;
}

const stateOptions = states.map((state) => ({
    key: state,
    value: state,
    text: state,
}));

// TODO: Connect to backend
// Component that displays and changes note name shown only if parent is EditNote.
const NoteNameMenuItem: React.FunctionComponent<NoteNameMenuItemProps> = (
    props: NoteNameMenuItemProps
) => {
    const { title, note, updateNoteTitle, mobile } = props;
    const context = useContext(NotesContext) as Context;

    // Form fields
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [pronouns, setPronouns] = useState('');
    // Field error messages
    const [invalidFirstName, setInvalidFirstName] = useState<FieldError>(false);
    const [invalidLastName, setInvalidLastName] = useState<FieldError>(false);
    const [saveButton, setSaveButton] = useState('');
    const [buttonIcon, setButtonIcon] = useState<undefined | string>(undefined);

    // Update note in backend
    /* eslint-disable */
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
    };

    // Modal event handlers
    const openModal = (): void => setOpen(true);
    const closeModal = (): void => setOpen(false);

    // Patient Info form event handlers

    const savePatientInfo = () => {
        if (
            invalidFirstName ||
            invalidLastName
        ) {
            alert('Please your name field is valid');
            return;
        }
        closeModal();
    };

    const formatOnChange = function (
        action: (val: any) => void
    ): FormChangeHandler {
        return (_e, { value }) => action(value);
    };

    // Form validators
    const validateFirstName = (e: React.FocusEvent) => {
        const target = e.target as HTMLInputElement;
        if (!target.value) {
            setInvalidFirstName({ content: 'First name must be valid' });
        } else {
            setInvalidFirstName(false);
        }
    };

    const validateLastName = (e: React.FocusEvent) => {
        const target = e.target as HTMLInputElement;
        if (!target.value) {
            setInvalidLastName({ content: 'Last name must be valid' });
        } else {
            setInvalidLastName(false);
        }
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
                onBlur={() => title === '' && updateNoteTitle(initialNoteTitle)}
                value={title}
            />
            {!mobile && <div className='patient-info'>
                {(lastName != '' || firstName != '') && (
                    <h4>
                        {`${firstName} ${lastName}`}
                    </h4>
                )}
            </div>}
            </>
            <Modal
                className='patient-modal'
                onClose={closeModal}
                onOpen={openModal}
                open={open}
                size='tiny'
                dimmer='inverted'
                trigger={
                    mobile ? 
                    <Button
                        basic
                        color='teal'
                        name='home'
                        icon='info circle'
                    />   :
                    <Button className='patient-modal-button' size='tiny' basic>
                        Add/Edit Patient Info
                    </Button> 
                }
            >
                <Header>Patient Information</Header>
                <Modal.Content>
                    <Form>
                        <DemographicsForm
                            pronouns={pronouns}
                            onChange={formatOnChange(setPronouns)}
                        />
                        <Form.Group widths='equal' className='error-div'>
                            <Form.Field
                                fluid
                                id='firstName'
                                type='text'
                                label='First Name'
                                className='patient-info-input'
                                placeholder='First Name'
                                control={Input}
                                value={firstName}
                                error={invalidFirstName}
                                onBlur={validateFirstName}
                                onChange={formatOnChange(setFirstName)}
                            />
                            <Form.Field
                                fluid
                                type='text'
                                label='Last Name'
                                id='lastName'
                                className='patient-info-input'
                                placeholder='Last Name'
                                control={Input}
                                value={lastName}
                                error={invalidLastName}
                                onBlur={validateLastName}
                                onChange={formatOnChange(setLastName)}
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
    { updateNoteTitle }
)(NoteNameMenuItem);
