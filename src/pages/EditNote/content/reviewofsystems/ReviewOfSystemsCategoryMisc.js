import React, { Component } from 'react';
import {
    Input,
    Grid,
    Button,
    Divider,
    Segment,
    Header,
    Form,
    TextArea,
} from 'semantic-ui-react';
import HPIContext from 'contexts/HPIContext.js';
import './ReviewOfSystems.css';

export default class ReviewOfSystemsCategoryMisc extends Component {
    static contextType = HPIContext;

    constructor(props) {
        super(props);
        this.index = this.props.index;
    }

    handleChangeCategoryInput = (e) => {
        const values = this.context['Review of Systems'];
        values['Misc'][this.index]['name'] = e.target.value;
        this.context.onContextChange('Review of Systems', values);
    };

    handleChangeOptionInput = (e, index) => {
        const values = this.context['Review of Systems'];
        values['Misc'][this.index]['options'][index]['optionName'] =
            e.target.value;
        this.context.onContextChange('Review of Systems', values);
    };

    handleOptionChange = (index, value) => {
        const values = this.context['Review of Systems'];
        if (values['Misc'][this.index]['options'][index]['value'] === value) {
            values['Misc'][this.index]['options'][index]['value'] = '';
        } else if (
            values['Misc'][this.index]['options'][index]['value'] === '' ||
            values['Misc'][this.index]['options'][index]['value'] !== value
        ) {
            values['Misc'][this.index]['options'][index]['value'] = value;
        }
        this.context.onContextChange('Review of Systems', values);
    };

    addOption = () => {
        const values = this.context['Review of Systems'];
        values['Misc'][this.index]['options'].push({
            value: '',
            optionName: '',
        });
        this.context.onContextChange('Review of Systems', values);
    };

    render() {
        return (
            <Segment>
                <Header as={'h2'}>
                    <Input
                        onChange={this.handleChangeCategoryInput}
                        placeholder='New Disease Category'
                        className='ui input transparent misc'
                        value={
                            this.context['Review of Systems']['Misc'][
                                this.index
                            ]['name']
                        }
                    ></Input>
                </Header>
                <Divider />
                <Grid padded>
                    {Object.keys(
                        this.context['Review of Systems']['Misc'][this.index][
                            'options'
                        ]
                    ).map((ind) => (
                        <Grid.Row key={ind}>
                            <Grid.Column width={4} className='no-padding'>
                                <Button
                                    compact
                                    floated='right'
                                    color={
                                        this.context['Review of Systems'][
                                            'Misc'
                                        ][this.index]['options'][ind][
                                            'value'
                                        ] === 'n'
                                            ? 'green'
                                            : null
                                    }
                                    value='n'
                                    active={
                                        this.context['Review of Systems'][
                                            'Misc'
                                        ][this.index]['options'][ind][
                                            'value'
                                        ] === 'n'
                                    }
                                    onClick={(e, { value }) =>
                                        this.handleOptionChange(ind, value)
                                    }
                                >
                                    NO
                                </Button>
                            </Grid.Column>
                            <Grid.Column
                                width={7}
                                verticalAlign='middle'
                                className='no-padding'
                            >
                                <Form>
                                    <TextArea
                                        onChange={(e) =>
                                            this.handleChangeOptionInput(e, ind)
                                        }
                                        placeholder='option'
                                        className='ui input transparent misc'
                                        value={
                                            this.context['Review of Systems'][
                                                'Misc'
                                            ][this.index]['options'][ind][
                                                'optionName'
                                            ]
                                        }
                                    />
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={4} className='no-padding'>
                                <Button
                                    compact
                                    floated='left'
                                    color={
                                        this.context['Review of Systems'][
                                            'Misc'
                                        ][this.index]['options'][ind][
                                            'value'
                                        ] === 'y'
                                            ? 'red'
                                            : null
                                    }
                                    value='y'
                                    active={
                                        this.context['Review of Systems'][
                                            'Misc'
                                        ][this.index]['options'][ind][
                                            'value'
                                        ] === 'y'
                                    }
                                    onClick={(e, { value }) =>
                                        this.handleOptionChange(ind, value)
                                    }
                                >
                                    YES
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    ))}
                    <Button
                        className='add-option-button'
                        onClick={this.addOption}
                    >
                        Add option
                    </Button>
                </Grid>
            </Segment>
        );
    }
}
