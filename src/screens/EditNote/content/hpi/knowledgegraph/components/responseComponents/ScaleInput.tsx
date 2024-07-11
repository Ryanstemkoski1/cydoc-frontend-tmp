import Input from '@components/Input/Input';
import { HpiStateProps } from '@constants/hpiEnums';
import 'screens/EditNote/content/hpi/knowledgegraph/css/Button.css';
import React from 'react';
import { connect } from 'react-redux';
import {
    ScaleHandleClearAction,
    ScaleHandleValueAction,
    scaleHandleClear,
    scaleHandleValue,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import style from './ScaleInput.module.scss';
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
            <div
                className={`${style.scaleInput} flex-wrap align-center justify-between`}
            >
                <div className={`${style.scaleInput__range} flex align-center`}>
                    <label> 0 </label>
                    <input
                        type='range'
                        min={0}
                        max={10}
                        step={0}
                        id='scale-slider'
                        value={value === '' ? 0 : value}
                        onChange={(e): ScaleHandleValueAction =>
                            scaleHandleValue(node, parseInt(e.target.value))
                        }
                    />
                    <label> 10 </label>
                </div>
                <div className={`${style.scaleInput__input} flex align-center`}>
                    <Input
                        min={0}
                        max={10}
                        step={0}
                        type='number'
                        id='scale-value'
                        value={value === 0 ? '' : value}
                        onChange={(e: any): ScaleHandleValueAction => {
                            const value = e.target.value;
                            return scaleHandleValue(
                                node,
                                parseInt(value === '' ? '0' : value)
                            );
                        }}
                    />
                    <button
                        className='button sm pill'
                        onClick={(_e): void => {
                            scaleHandleClear(node);
                        }}
                    >
                        Clear
                    </button>
                </div>
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
