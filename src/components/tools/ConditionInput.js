import React from 'react';
import {Input, Icon} from 'semantic-ui-react';
import HPIContext from 'contexts/HPIContext.js';
import {adjustValue} from 'pages/EditNote/content/medicalhistory/util';
import {medicalMapping} from 'constants/word-mappings';

class ConditionInput extends React.Component {
    static contextType = HPIContext;

    constructor(props, context) {
        super(props, context);
        let answer;
        let isTitleFocused = false;
        if (!this.props.isPreview) {
            const condition = this.context[this.props.category][this.props.index]['Condition'];
            answer = condition.length === 0 ? '' : condition;
            isTitleFocused = condition.length === 0;
        }
        this.state = {
            textInput: answer,
            isRepeat: false,
            isTitleFocused,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }

    handleInputChange = (event) => { 
        this.setState({
            textInput: event.target.value
        });

        const values = this.context[this.props.category];
        values[this.props.index]['Condition'] = event.target.value;
        this.context.onContextChange(this.props.category, values);
    }

    handleOnBlur = (e) => {
        this.setState({isTitleFocused: false});
        const val = adjustValue(e.target.value, medicalMapping);
        console.log(val, this.props.seenConditions.has(val), this.props.seenConditions);
        if (this.props.seenConditions.has(val)) {
            this.setState({ isRepeat: true });
        } else {
            this.setState({ isRepeat: false });
            this.props.addSeenCondition(val);
        }
    }

    render() {
        return(
            <React.Fragment>
                <Input
                    disabled={this.props.isPreview}
                    className={this.state.isTitleFocused === true ? 'ui input focus' : 'ui input transparent'}
                    type='text'
                    placeholder='Condition'
                    onChange={this.handleInputChange}
                    onFocus={()=>{this.setState({isTitleFocused: true})}}
                    onBlur={this.handleOnBlur}
                    value={this.props.isPreview ? this.props.condition : this.state.textInput} 
                />
                {this.state.isRepeat && (
                    <div className='condition-error'>
                        <Icon color='red' name='warning circle'/>
                        Condition already included
                    </div>
                )}
            </React.Fragment>
        )
        }
    }

export default ConditionInput;