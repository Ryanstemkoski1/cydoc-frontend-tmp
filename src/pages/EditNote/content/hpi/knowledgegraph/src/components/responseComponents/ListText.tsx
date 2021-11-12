import React from 'react';
import { Input } from 'semantic-ui-react';
import '../../css/listText.css';
import { CurrentNoteState } from 'redux/reducers';
import { HpiStateProps } from 'constants/hpiEnums';
import { connect } from 'react-redux';
import {
    listTextHandleChange,
    removeListInput,
    addListInput,
    ListTextHandleChangeAction,
    RemoveListInputAction,
    AddListInputAction,
} from 'redux/actions/hpiActions';
import { isListTextDictionary } from 'redux/reducers/hpiReducer';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ToggleButton from 'components/tools/ToggleButton';
import 'pages/EditNote/content/hpi/knowledgegraph/src/css/Button.css';

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
                    <div key={id}>
                        <Input
                            id={'list-text-input'}
                            value={input}
                            onChange={(_e, data): ListTextHandleChangeAction =>
                                listTextHandleChange(id, node, data.value)
                            }
                        />
                        <ToggleButton
                            className='remove-list-text'
                            condition='-'
                            title='-'
                            onToggleButtonClick={(): RemoveListInputAction =>
                                removeListInput(id, node)
                            }
                        />
                    </div>
                )
            );
        }

        return (
            <div>
                {' '}
                {listInputsArray}
                <ToggleButton
                    className='button-plus-click'
                    condition='+'
                    title='+'
                    onToggleButtonClick={(): AddListInputAction =>
                        addListInput(node)
                    }
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
