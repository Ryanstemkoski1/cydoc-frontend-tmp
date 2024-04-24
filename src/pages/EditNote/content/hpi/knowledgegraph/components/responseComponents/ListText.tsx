import Input from 'components/Input/Input';
import AddRowButton from 'components/tools/AddRowButton/AddRowButton';
import RemoveButton from 'components/tools/RemoveButton/RemoveButton';
import 'pages/EditNote/content/hpi/knowledgegraph/css/Button.css';
import React from 'react';
import { isListTextDictionary } from 'redux/reducers/hpiReducer';
import '../../css/listText.css';
import style from './ListText.module.scss';

interface ListTextProps {
    nodeId: string;
    onChangeListItem: (...args: any[]) => void;
    onAddListItem: (...args: any[]) => void;
    onRemoveListItem: (...args: any[]) => void;
    response: any;
}

class ListText extends React.Component<ListTextProps> {
    render() {
        const {
            nodeId,
            onChangeListItem,
            onAddListItem,
            onRemoveListItem,
            response,
        } = this.props;
        const listInputValues = response;
        let listInputsArray: JSX.Element[] = [];
        if (listInputValues && isListTextDictionary(listInputValues)) {
            listInputsArray = Object.entries(listInputValues).map(
                ([id, input]) => (
                    <div
                        className={`${style.listText} flex-wrap align-center justify-between`}
                        key={id}
                    >
                        <div className={`${style.listText__input}`}>
                            <Input
                                id={'list-text-input'}
                                value={input}
                                onChange={(e: any) =>
                                    onChangeListItem(id, nodeId, e.target.value)
                                }
                            />
                        </div>

                        <RemoveButton
                            onClick={() => onRemoveListItem(id, nodeId)}
                        />
                    </div>
                )
            );
        }

        return (
            <div className={`${style.listText__addButton} isAddButton`}>
                {listInputsArray}
                <AddRowButton onClick={() => onAddListItem(nodeId)} />
            </div>
        );
    }
}

export default ListText;
