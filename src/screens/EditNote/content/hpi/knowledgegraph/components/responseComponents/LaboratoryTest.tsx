import Input from 'components/Input/Input';
import ToggleButton from 'components/tools/ToggleButton/ToggleButton';
import { HpiStateProps, LabTestType, TimeOption } from 'constants/hpiEnums';
import React from 'react';
import { connect } from 'react-redux';
import {
    LabTestHandleClickAction,
    LabTestInputChangeAction,
    labTestHandleClick,
    labTestInputChange,
} from '@redux/actions/hpiActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectHpiState } from '@redux/selectors/hpiSelectors';
import '../../css/TimeInput.css';

interface LabTestInputProps {
    node: string;
}

class LabTestInput extends React.Component<Props> {
    render() {
        const { node, hpi } = this.props,
            response = hpi.nodes[node].response as LabTestType,
            components = response.components;
        return (
            <div>
                {Object.keys(components).map((comp) => (
                    <div key={node + comp}>
                        <div> {comp} </div>
                        <div>
                            <Input
                                id={'lab-test'}
                                onChange={(_e: any, data: any) =>
                                    this.props.labTestInputChange(
                                        node,
                                        comp,
                                        data.value
                                    )
                                }
                                value={components[comp].value}
                            />
                        </div>
                        <div>
                            {components[comp].unitOptions.length == 1 ? (
                                <label>
                                    {components[comp].unit != 'nounits' &&
                                        components[comp].unit}
                                </label>
                            ) : (
                                components[comp].unitOptions.map((u) => (
                                    <ToggleButton<TimeOption>
                                        key={node + u}
                                        className='unit-option'
                                        condition={u}
                                        title={u}
                                        active={components[comp].unit == u}
                                        onToggleButtonClick={(_e, data) =>
                                            this.props.labTestHandleClick(
                                                node,
                                                comp,
                                                (data?.condition ||
                                                    '') as TimeOption
                                            )
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

interface DispatchProps {
    labTestHandleClick: (
        medId: string,
        component: string,
        unit: string
    ) => LabTestHandleClickAction;
    labTestInputChange: (
        medId: string,
        component: string,
        value: string | number
    ) => LabTestInputChangeAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & LabTestInputProps;

const mapDispatchToProps = {
    labTestHandleClick,
    labTestInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(LabTestInput);
