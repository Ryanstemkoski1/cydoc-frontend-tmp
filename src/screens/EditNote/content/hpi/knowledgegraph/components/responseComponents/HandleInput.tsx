import Textarea from '@components/Input/Textarea';
import { HpiStateProps } from '@constants/hpiEnums';
import React from 'react';
import { connect } from 'react-redux';
import {
    handleInputChange,
    HandleInputChangeAction,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';

interface HandleInputProps {
    node: string;
}

class HandleInput extends React.Component<Props> {
    render() {
        const { hpi, node, handleInputChange } = this.props;
        return (
            <form>
                <Textarea
                    className='handle-input'
                    id='handle-input'
                    onChange={(_e: any, data: any) =>
                        handleInputChange(node, data.value as string)
                    }
                    value={hpi.nodes[node].response as string}
                />
            </form>
        );
    }
}

interface DispatchProps {
    handleInputChange: (
        medId: string,
        textInput: string
    ) => HandleInputChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & HandleInputProps;

const mapDispatchToProps = {
    handleInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleInput);
