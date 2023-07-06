import React, { useState } from 'react';
import { connect } from 'react-redux';
import { deleteCondition } from 'redux/actions/planActions';
import { Button, Icon, Modal } from 'semantic-ui-react';

interface DispatchProps {
    deleteCondition: (conditionIndex: string) => void;
}

interface DeleteCardProps {
    uuid: string;
    name: string;
    index: number;
    deleteCurrent: (idx: number) => void;
}

export const FILLER_NAME = 'the currently viewed condition';

/**
 * Component for confirmation and deletion of the currently displayed condition
 * of the discussion and plan
 */
const DeleteCard = (props: DeleteCardProps & DispatchProps) => {
    const { uuid, name, index, deleteCurrent, deleteCondition } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const confirmDelete = () => {
        deleteCondition(uuid);
        setIsOpen(false);
        deleteCurrent(index);
    };
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    return (
        <Modal
            size='mini'
            open={isOpen}
            onClose={onClose}
            className='plan-delete-modal'
            trigger={
                <Icon
                    onClick={onOpen}
                    name='trash alternate outline'
                    className='delete-btn'
                />
            }
        >
            <Modal.Content>
                {`Are you sure you want to delete the plan for ${
                    name || FILLER_NAME
                }?`}
            </Modal.Content>
            <Modal.Content className='btns'>
                <div className='modal-action'>
                    <Button
                        basic
                        color='grey'
                        content='Cancel'
                        onClick={onClose}
                    />
                    <Button
                        content='Delete'
                        onClick={confirmDelete}
                        floated='right'
                    />
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default connect(null, { deleteCondition })(DeleteCard);
