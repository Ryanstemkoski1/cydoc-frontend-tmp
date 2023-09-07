import Input from 'components/Input/Input';
import AddRowButton from 'components/tools/AddRowButton/AddRowButton';
import RemoveButton from 'components/tools/RemoveButton/RemoveButton';
import { HpiStateProps } from 'constants/hpiEnums';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';
import React from 'react';
import { connect } from 'react-redux';
import {
    AddListInputAction,
    ListTextHandleChangeAction,
    RemoveListInputAction,
    addListInput,
    listTextHandleChange,
    removeListInput,
} from 'redux/actions/hpiActions';
import { CurrentNoteState } from 'redux/reducers';
import { isListTextDictionary } from 'redux/reducers/hpiReducer';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import '../../css/listText.css';
import style from './ListText.module.scss';

interface ListTextProps {
    node: string;
}

class ListText extends React.Component<Props> {
    render() {
        const {
            node,
            hpi,
            listTextHandleChange,
            addListInput,
            removeListInput,
        } = this.props;
        const listInputValues = hpi.nodes[node].response;
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
                                onChange={(
                                    e: any
                                ): ListTextHandleChangeAction =>
                                    listTextHandleChange(
                                        id,
                                        node,
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <RemoveButton
                            onClick={(): RemoveListInputAction =>
                                removeListInput(id, node)
                            }
                        />
                    </div>
                )
            );
        }

        return (
            <div>
                {listInputsArray}

                <AddRowButton
                    onClick={(): AddListInputAction => addListInput(node)}
                />
            </div>
        );
    }
}

interface DispatchProps {
    listTextHandleChange: (
        uuid: string,
        medId: string,
        textInput: string
    ) => ListTextHandleChangeAction;
    removeListInput: (uuid: string, medId: string) => RemoveListInputAction;
    addListInput: (medId: string) => AddListInputAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & ListTextProps;

const mapDispatchToProps = {
    listTextHandleChange,
    removeListInput,
    addListInput,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListText);
