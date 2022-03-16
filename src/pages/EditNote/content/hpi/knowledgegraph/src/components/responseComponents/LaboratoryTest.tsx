import React from 'react';
import { Grid, Input } from 'semantic-ui-react';
import '../../css/TimeInput.css';
import { HpiStateProps, LabTestType } from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';
import { connect } from 'react-redux';
import {
    labTestHandleClick,
    LabTestHandleClickAction,
    labTestInputChange,
    LabTestInputChangeAction,
} from 'redux/actions/hpiActions';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ToggleButton from 'components/tools/ToggleButton';

interface LabTestInputProps {
    node: string;
}

class LabTestInput extends React.Component<Props> {
    render() {
        const { node, hpi } = this.props,
            response = hpi.nodes[node].response as LabTestType,
            components = response.components;
        return (
            <Grid columns='equal'>
                {Object.keys(components).map((comp) => (
                    <Grid.Row key={node + comp}>
                        <Grid.Column> {comp} </Grid.Column>
                        <Grid.Column>
                            {' '}
                            <Input
                                id={'lab-test'}
                                onChange={(_e, data) =>
                                    this.props.labTestInputChange(
                                        node,
                                        comp,
                                        data.value
                                    )
                                }
                                value={components[comp].value}
                            />{' '}
                        </Grid.Column>
                        <Grid.Column width={9}>
                            {components[comp].unitOptions.length == 1 ? (
                                <label>
                                    {components[comp].unit != 'nounits'
                                        ? components[comp].unit
                                        : ''}
                                </label>
                            ) : (
                                components[comp].unitOptions.map((u) => (
                                    <ToggleButton
                                        key={node + u}
                                        className='unit-option'
                                        condition={u}
                                        title={u}
                                        active={components[comp].unit == u}
                                        onToggleButtonClick={(_e, data) =>
                                            this.props.labTestHandleClick(
                                                node,
                                                comp,
                                                data.condition
                                            )
                                        }
                                    />
                                ))
                            )}
                        </Grid.Column>
                    </Grid.Row>
                ))}
            </Grid>
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
