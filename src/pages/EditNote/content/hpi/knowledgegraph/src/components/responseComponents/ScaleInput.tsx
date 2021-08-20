import React from 'react';
import { CurrentNoteState } from 'redux/reducers';
import { HpiStateProps } from 'constants/hpiEnums';
import {
    scaleHandleValue,
    scaleHandleClear,
    ScaleHandleValueAction,
    ScaleHandleClearAction,
} from 'redux/actions/hpiActions';
import { connect } from 'react-redux';
import { selectHpiState } from 'redux/selectors/hpiSelectors';

/*
TODO:
Make custom labels besides healthy and sick
Can that be passed down from props?
The props are key and pop
*/

interface ScaleInputProps {
    node: string;
}

class ScaleInput extends React.Component<Props> {
    render() {
        const { node, scaleHandleValue, scaleHandleClear, hpi } = this.props;
        const response = hpi.nodes[node].response;
        const value = typeof response == 'number' ? response : '';
        return (
            <div className='scale-input'>
                <label> 1 </label>
                <input
                    type='range'
                    min={1}
                    max={10}
                    step={1}
                    id='scale-slider'
                    value={value}
                    onChange={(e): ScaleHandleValueAction =>
                        scaleHandleValue(node, parseInt(e.target.value))
                    }
                />
                <label> 10 </label>
                <input
                    min={1}
                    max={10}
                    step={1}
                    type='number'
                    id='scale-value'
                    value={value}
                    onChange={(e): ScaleHandleValueAction =>
                        scaleHandleValue(node, parseInt(e.target.value))
                    }
                />
                <button
                    className='ui compact basic button scale-clear'
                    style={{ marginLeft: 10 }}
                    onClick={(_e): void => {
                        scaleHandleClear(node);
                    }}
                >
                    Clear
                </button>
            </div>
        );
    }
}

interface DispatchProps {
    scaleHandleValue: (medId: string, value: number) => ScaleHandleValueAction;
    scaleHandleClear: (medId: string) => ScaleHandleClearAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & ScaleInputProps;

const mapDispatchToProps = {
    scaleHandleValue,
    scaleHandleClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScaleInput);
