import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import HPIContext from 'contexts/HPIContext.js';
import '../PhysicalExam.css';

export default class AbdomenExamButtons extends Component {
    static contextType = HPIContext;
    constructor(props, context) {
        super(props, context);
        this.onClick = this.onClick.bind(this);
    }

    onClick(event, data) {
        let values = this.context['Physical Exam'];
        let prevState =
            values.widgets['Abdomen'][this.props.ab_quadrant][data.children];
        values.widgets['Abdomen'][this.props.ab_quadrant][
            data.children
        ] = !prevState;
        this.context.onContextChange('Physical Exam', values);
    }

    render() {
        let ab_quadrant_buttons = [];
        let ab_quadrant_dict = this.context['Physical Exam'].widgets['Abdomen'][
            this.props.ab_quadrant
        ];
        for (let ab_quadrant_button in ab_quadrant_dict) {
            ab_quadrant_buttons.push(
                <Button
                    size={'small'}
                    key={this.props.ab_quadrant + ' ' + ab_quadrant_button}
                    color={
                        this.context['Physical Exam'].widgets['Abdomen'][
                            this.props.ab_quadrant
                        ][ab_quadrant_button]
                            ? 'red'
                            : ''
                    }
                    onClick={this.onClick}
                    className={'spaced-buttons'}
                >
                    {ab_quadrant_button}
                </Button>
            );
        }
        return <div>{ab_quadrant_buttons}</div>;
    }
}
