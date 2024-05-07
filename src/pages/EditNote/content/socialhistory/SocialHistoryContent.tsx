/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
    updateDiet,
    updateEmployment,
    updateExercise,
    updateLivingSituation,
} from '@redux/actions/socialHistoryActions';
import { CurrentNoteState } from '@redux/reducers';
import { selectSecondaryFieldsState } from '@redux/selectors/socialHistorySelectors';
import { Form, Grid, TextArea } from 'semantic-ui-react';
import '../hpi/knowledgegraph/css/Button.css';
import Alcohol from './Alcohol';
import RecreationalDrugs from './RecreationalDrugs';
import Tobacco from './Tobacco';

/* eslint-disable-next-line */
type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps;

export class SocialHistoryContent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    //generates a collection for the living situation, diet, exercise portion
    generateSecondaryFieldRows() {
        return (
            <>
                <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>Living Situation</label>
                        <TextArea
                            onChange={(_, { value }) => {
                                this.props.updateLivingSituation(
                                    value as string
                                );
                            }}
                            value={this.props.secondaryFields.livingSituation}
                            field='Living Situation'
                            rows={2}
                            style={{ height: 'auto' }} // height needs to be set as 'auto' to make rows prop work because the height is supposed to be 3em in css
                        />
                    </Form>
                </Grid.Column>
                <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>Employment</label>
                        <TextArea
                            onChange={(_, { value }) => {
                                this.props.updateEmployment(value as string);
                            }}
                            value={this.props.secondaryFields.employment}
                            field='Employment'
                            rows={2}
                            style={{ height: 'auto' }}
                        />
                    </Form>
                </Grid.Column>
                <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>Diet</label>
                        <TextArea
                            onChange={(_, { value }) => {
                                this.props.updateDiet(value as string);
                            }}
                            value={this.props.secondaryFields.diet}
                            field='Diet'
                            rows={2}
                            style={{ height: 'auto' }}
                        />
                    </Form>
                </Grid.Column>
                <Grid.Column computer={4} tablet={8} mobile={16}>
                    <Form>
                        <label>Exercise</label>
                        <TextArea
                            onChange={(_, { value }) => {
                                this.props.updateExercise(value as string);
                            }}
                            value={this.props.secondaryFields.exercise}
                            field='Exercise'
                            rows={2}
                            style={{ height: 'auto' }}
                        />
                    </Form>
                </Grid.Column>
            </>
        );
    }

    // renders Tobacco, Alcohol, and RecreationalDrugs components
    render() {
        const secondaryFieldRows = this.generateSecondaryFieldRows();

        return (
            <div className='social-history-content'>
                <Tobacco />
                <Alcohol />
                <RecreationalDrugs />
                <Grid columns={2} stackable>
                    {secondaryFieldRows}
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state: CurrentNoteState) => ({
    secondaryFields: selectSecondaryFieldsState(state),
});

const mapDispatchToProps = {
    updateLivingSituation,
    updateEmployment,
    updateDiet,
    updateExercise,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(SocialHistoryContent);
