import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import {
    HpiStateProps,
    BodyLocationOptions,
    BodyLocationLRItemType,
    BodyLocationToggle,
    BodyLocationLRType,
    BodyLocationType,
    leftRightCenter,
} from 'constants/hpiEnums';
import { CurrentNoteState } from 'redux/reducers';
import {
    bodyLocationHandleToggle,
    BodyLocationHandleToggleAction,
    BodyLocationResponseAction,
    bodyLocationResponse,
} from 'redux/actions/hpiActions';
import { connect } from 'react-redux';
import { LRButtonState } from 'constants/enums';
import { selectHpiState } from 'redux/selectors/hpiSelectors';
import ToggleButton from 'components/tools/ToggleButton';

export const options: BodyLocationLRItemType[][] = [
    [
        { name: BodyLocationOptions.HEAD, needsRightLeft: false },
        { name: BodyLocationOptions.EYE, needsRightLeft: true },
        { name: BodyLocationOptions.EAR, needsRightLeft: true },
        { name: BodyLocationOptions.NOSE, needsRightLeft: false },
        { name: BodyLocationOptions.MOUTH, needsRightLeft: false },
        { name: BodyLocationOptions.THROAT, needsRightLeft: false },
        { name: BodyLocationOptions.NECK, needsRightLeft: false },
    ],
    [
        { name: BodyLocationOptions.CHEST, needsRightLeft: false },
        { name: BodyLocationOptions.STOMACH, needsRightLeft: false },
        { name: BodyLocationOptions.PELVIS, needsRightLeft: false },
        { name: BodyLocationOptions.GROIN, needsRightLeft: false },
    ],
    [
        { name: BodyLocationOptions.SHOULDER, needsRightLeft: true },
        { name: BodyLocationOptions.UPPER_ARM, needsRightLeft: true },
        { name: BodyLocationOptions.ELBOW, needsRightLeft: true },
        { name: BodyLocationOptions.LOWER_ARM, needsRightLeft: true },
    ],
    [
        { name: BodyLocationOptions.WRIST, needsRightLeft: true },
        { name: BodyLocationOptions.HAND, needsRightLeft: true },
        { name: BodyLocationOptions.FINGER, needsRightLeft: true },
    ],
    [
        { name: BodyLocationOptions.UPPER_BACK, needsRightLeft: false },
        { name: BodyLocationOptions.MID_BACK, needsRightLeft: false },
        { name: BodyLocationOptions.LOWER_BACK, needsRightLeft: false },
    ],
    [
        { name: BodyLocationOptions.HIP, needsRightLeft: true },
        { name: BodyLocationOptions.UPPER_LEG, needsRightLeft: true },
        { name: BodyLocationOptions.KNEE, needsRightLeft: true },
        { name: BodyLocationOptions.LOWER_LEG, needsRightLeft: true },
    ],
    [
        { name: BodyLocationOptions.ANKLE, needsRightLeft: true },
        { name: BodyLocationOptions.FOOT, needsRightLeft: true },
        { name: BodyLocationOptions.TOE, needsRightLeft: true },
    ],
];

export const bodyLocationDefaultState = () => {
    const sectionState: {
        [name: string]: LRButtonState | boolean;
    } = {};
    options.forEach((row) => {
        row.forEach((option) => {
            if (option.needsRightLeft) {
                sectionState[option.name] = {
                    left: false,
                    center: false,
                    right: false,
                };
            } else {
                sectionState[option.name] = false;
            }
        });
    });
    return sectionState;
};

interface BodyLocationProps {
    node: string;
}

interface BodyLocationState {
    isBodyLocationResponse: boolean;
}

class BodyLocation extends React.Component<Props, BodyLocationState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isBodyLocationResponse: false,
        };
    }

    componentDidMount() {
        this.props.bodyLocationResponse(this.props.node, options);
        const response = this.props.hpi.nodes[this.props.node];
        // isBodyLocationLRDict(response) && Object.keys(response).length;
        this.setState({ isBodyLocationResponse: true });
    }

    generateButtons = (
        row: { name: BodyLocationOptions; needsRightLeft: boolean }[]
    ) => {
        const { hpi, node, bodyLocationHandleToggle } = this.props;
        const buttons = row.map((option) => {
            if (option.needsRightLeft) {
                const response = hpi.nodes[node].response as BodyLocationLRType,
                    responseSide = response[option.name] as leftRightCenter;
                return (
                    <Button.Group
                        key={option.name}
                        className={'spaced-buttons'}
                    >
                        <ToggleButton
                            condition='L'
                            active={responseSide.left as boolean}
                            title='L'
                            onToggleButtonClick={() =>
                                bodyLocationHandleToggle(
                                    node,
                                    option.name,
                                    'left'
                                )
                            }
                        />
                        <ToggleButton
                            condition={option.name}
                            title={option.name}
                            active={false}
                            onToggleButtonClick={(): null => null}
                        />
                        <ToggleButton
                            condition='R'
                            active={responseSide.right as boolean}
                            title='R'
                            onToggleButtonClick={() =>
                                bodyLocationHandleToggle(
                                    node,
                                    option.name,
                                    'right'
                                )
                            }
                        />
                    </Button.Group>
                );
            } else {
                const value = hpi.nodes[node].response as BodyLocationType;
                return (
                    <ToggleButton
                        condition={option.name}
                        active={value[option.name]}
                        title={option.name}
                        onToggleButtonClick={(): BodyLocationHandleToggleAction =>
                            bodyLocationHandleToggle(node, option.name, null)
                        }
                    />
                );
            }
        });

        return buttons;
    };

    render() {
        return this.state.isBodyLocationResponse ? (
            <div>
                <Grid>
                    {options.map((row, index) => {
                        return (
                            <Grid.Row key={index}>
                                {this.generateButtons(row)}
                            </Grid.Row>
                        );
                    })}
                </Grid>
            </div>
        ) : (
            ''
        );
    }
}

interface DispatchProps {
    bodyLocationResponse: (
        medId: string,
        bodyOptions: BodyLocationLRItemType[][]
    ) => BodyLocationResponseAction;
    bodyLocationHandleToggle: (
        medId: string,
        bodyOption: BodyLocationOptions,
        toggle: BodyLocationToggle
    ) => BodyLocationHandleToggleAction;
}

const mapStateToProps = (state: CurrentNoteState): HpiStateProps => ({
    hpi: selectHpiState(state),
});

type Props = HpiStateProps & DispatchProps & BodyLocationProps;

const mapDispatchToProps = {
    bodyLocationHandleToggle,
    bodyLocationResponse,
};

export default connect(mapStateToProps, mapDispatchToProps)(BodyLocation);
