import React from 'react';
import {Input} from 'semantic-ui-react';
import HPIContext from 'contexts/HPIContext.js';

export default class PlanInput extends React.Component {
    static contextType = HPIContext;
    constructor(props) {
        super(props);
        this.state = {
            textInput: this.props.name,
            isTitleFocused: false,
        };
    }

    handleInputChange = (event) => { 
        this.setState({
            textInput: event.target.value
        });

        const plan = {...this.context.plan};
        plan.conditions[this.props.index]['name'] = event.target.value;
        this.context.onContextChange('plan', plan);
    }

    render() {
        console.log(this.props.name);
        console.log(this.state.textInput);
        return(
            <Input
                fluid={this.props.fluid}
                className={this.state.isTitleFocused === true ? 'ui input focus' : 'ui input transparent'}
                type='text'
                placeholder='Condition Name'
                onChange={this.handleInputChange}
                onFocus={()=>{this.setState({isTitleFocused: true})}}
                onBlur={()=>{this.setState({isTitleFocused: false})}}
                value={this.state.textInput} 
            />
        )
    }
}