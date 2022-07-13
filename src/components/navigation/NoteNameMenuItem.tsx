import React from 'react';
import { Menu, Input, InputOnChangeData } from 'semantic-ui-react';
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
    const { title, updateNoteTitle } = props;

    const formatOnChange = function (
        action: (val: any) => void
    ): FormChangeHandler {
        return (_e, { value }) => action(value);
    };

    return (
        <Menu.Item className='note-name-menu-item' fitted>
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
