import React from 'react';
import './ButtonItem';
import HPIContext from 'contexts/HPIContext.js';
import { CONDITION_DEFAULT } from '../../../../discussionplan/DiscussionPlanDefaults';

class DiseaseTag extends React.Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { name } = this.props;
        let values = this.context['positivediseases'];
        const plan = { ...this.context['plan'] };
        let nameIndex = values.indexOf(name);
        if (nameIndex > -1) {
            values.splice(nameIndex, 1);
            plan['conditions'].splice(
                plan['conditions'].findIndex(
                    (disease) => disease.name === name
                ),
                1
            );
        } else {
            values = values.concat(name);
            plan['conditions'].unshift({
                ...JSON.parse(JSON.stringify(CONDITION_DEFAULT)),
                name: name,
            });
        }
        this.context.onContextChange('positivediseases', values);
        this.context.onContextChange('activeHPI', values[0]);
        this.context.onContextChange('plan', plan);
    }

    render() {
        const { name } = this.props;
        // change color of button and font based on whether the user chose this disease category or not
        let buttonColor =
            this.context['positivediseases'].indexOf(name) > -1
                ? 'violet'
                : 'basic';
        return (
            <button
                className={`ui compact ${buttonColor} button`}
                onClick={this.handleClick}
            >
                {name}
            </button>
        );
    }
}

export default DiseaseTag;
