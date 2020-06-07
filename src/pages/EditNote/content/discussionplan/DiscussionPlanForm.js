import React, { Component } from 'react'
import { 
    Grid, 
    Header, 
    Dropdown,
} from 'semantic-ui-react';
import AddRowButton from 'components/tools/AddRowButton';
import HPIContext from 'contexts/HPIContext.js'

// General form containing search dropdown, when, and comment
export default class GeneralForm extends Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            mainOptions: this.props.options,
            whenOptions: this.generateOptions(['today', 'this week', 'this month', 'this year']),
        }
    }

    generateOptions = (values) => {
        return values.map((value) => 
            ({key: value, text: value, value})
        )    
    }

    addRow = () => {
        const plan = {...this.context.plan};
        plan['conditions'][this.props.index][this.props.type].push({...this.props.default});
        this.context.onContextChange('plan', plan);
    }

    handleOnChange = (index, type, value) => {
        const plan = {...this.context.plan};
        const procedures = plan['conditions'][this.props.index][this.props.type];
        procedures[index][type] = value;
        this.context.onContextChange('plan', plan);
    }

    handleAddition = (e, type, value) => {
        this.setState((prevState) => ({
            [type]: [
                {key: value, text:value, value},
                ...prevState[type],
            ],
        }));
    }

    render() {
        const {index, type} = this.props;
        const data = this.context.plan['conditions'][index][type];
        return (
            <React.Fragment>
                <Header as='h4' dividing> {this.props.header} </Header>
                <Grid columns={3} stackable>
                    <Grid.Row>
                        <Grid.Column>{this.props.subheader}</Grid.Column>
                        <Grid.Column>When</Grid.Column>
                        <Grid.Column>Comments</Grid.Column>
                    </Grid.Row>
                    { data.map((datum, i) => (
                        <Grid.Row key={i}>
                            <Grid.Column>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    allowAdditions
                                    type='text'
                                    icon=''
                                    options={this.state.mainOptions}
                                    value={datum[type]}
                                    onAddItem={(e, data) => this.handleAddition(e, 'mainOptions', data.value)}
                                    onChange={(e, data) => this.handleOnChange(i, type, data.value)}
                                    placeholder={this.props.placeholder}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    allowAdditions
                                    type='text'
                                    icon=''
                                    options={this.state.whenOptions}
                                    value={datum['when']}
                                    onChange={(e, data) => this.handleOnChange(i, 'when', data.value)}
                                    onAddItem={(e, data) => this.handleAddition(i, 'whenOptions', data.value)}
                                    placeholder='When'
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <div className='ui form'>
                                    <textarea 
                                        placeholder='Comments'
                                        value={datum['comment']} 
                                        onChange={(e) => this.handleOnChange(i, 'comment', e.target.value)}
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        ))
                    }
                </Grid>
                <AddRowButton 
                    name={this.props.addRowName}
                    onClick={this.addRow}
                />
            </React.Fragment>
        );
    }

}