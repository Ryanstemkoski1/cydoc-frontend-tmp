import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import HPIcontext from 'contexts/HPIContext.js';
import ExpandMurmurs from './ExpandMurmurs';
import '../PhysicalExam.css';

class HeartMurmurs extends Component {
    static contextType = HPIcontext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            pe_rows0: [['systolic', 'diastolic']],
            pe_rows1: [['crescendo', 'decrescendo', 'cresc-decresc']],
            pe_rows2: [['RUSB', 'LUSB', 'RLSB', 'LLSB', 'apex']],
            pe_rows3: [['1', '2', '3', '4', '5']],
            pe_rows4: [['low', 'medium', 'high']],
            pe_rows5: [
                ['blowing', 'harsh', 'rumbling'],
                ['whooshing', 'rasping', 'musical'],
            ],
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.addButton = this.addButton.bind(this);
        this.removeButton = this.removeButton.bind(this);
    }

    onButtonClick(event, data) {
        let values = this.context['Physical Exam'];

        if (this.state.pe_rows0[0].some((x) => x === data.condition)) {
            values.widgets[this.props.type][data.pe_index]['systdiast'] =
                data.condition;
        }

        if (this.state.pe_rows1[0].some((x) => x === data.condition)) {
            values.widgets[this.props.type][data.pe_index]['cresdecres'] =
                data.condition;
        }

        if (this.state.pe_rows2[0].some((x) => x === data.condition)) {
            values.widgets[this.props.type][data.pe_index]['heardbest'] =
                data.condition;
        }

        if (this.state.pe_rows3[0].some((x) => x === data.condition)) {
            values.widgets[this.props.type][data.pe_index]['intensity'] =
                data.condition;
        }

        if (this.state.pe_rows4[0].some((x) => x === data.condition)) {
            values.widgets[this.props.type][data.pe_index]['pitch'] =
                data.condition;
        }

        if (this.state.pe_rows5[0].some((x) => x === data.condition)) {
            values.widgets[this.props.type][data.pe_index]['quality'].push(
                data.condition
            );
        }

        if (this.state.pe_rows5[1].some((x) => x === data.condition)) {
            values.widgets[this.props.type][data.pe_index]['quality'].push(
                data.condition
            );
        }

        this.context.onContextChange('Physical Exam', values);
    }

    addButton() {
        let values = this.context['Physical Exam'];
        values.widgets[this.props.type].push({
            systdiast: '',
            cresdecres: '',
            heardbest: '',
            intensity: '',
            pitch: '',
            quality: [],
        });
        this.context.onContextChange('Physical Exam', values);
    }

    removeButton(event, data) {
        let values = this.context['Physical Exam'];
        values.widgets[this.props.type].splice(data.pe_index, 1);
        this.context.onContextChange('Physical Exam', values);
    }

    addMurmurG(pe_index, pe_rows, name) {
        let pe_show = [];

        for (let index = 0; index < pe_rows.length; index++) {
            pe_show.push(
                <div
                    style={{
                        marginTop: 10,
                        marginBottom: 10,
                        marginLeft: 10,
                        marginRight: 10,
                    }}
                >
                    {pe_rows[index].map((word) => (
                        <Button
                            color={
                                name === 'quality'
                                    ? this.context['Physical Exam'].widgets[
                                          this.props.type
                                      ][pe_index][name].some((x) => x === word)
                                        ? 'red'
                                        : ''
                                    : this.context['Physical Exam'].widgets[
                                          this.props.type
                                      ][pe_index][name] === word
                                    ? 'red'
                                    : ''
                            }
                            key={word}
                            pe_index={pe_index}
                            index={index}
                            condition={word}
                            onClick={this.onButtonClick}
                            className={'spaced-buttons'}
                        >
                            {word}
                        </Button>
                    ))}
                </div>
            );
        }
        return pe_show;
    }

    render = () => {
        //var values = this.context['Physical Exam'].widgets['Murmurs']
        const values = Object.keys(
            this.context['Physical Exam'].widgets['Murmurs']
        );
        //console.log(values)
        let arr = [];

        for (let pe_index = 0; pe_index < values.length; pe_index++) {
            let block0 = this.addMurmurG(
                pe_index,
                this.state.pe_rows0,
                'systdiast'
            );
            let block1 = this.addMurmurG(
                pe_index,
                this.state.pe_rows1,
                'cresdecres'
            );
            let block2 = this.addMurmurG(
                pe_index,
                this.state.pe_rows2,
                'heardbest'
            );
            let block3 = this.addMurmurG(
                pe_index,
                this.state.pe_rows3,
                'intensity'
            );
            let block4 = this.addMurmurG(
                pe_index,
                this.state.pe_rows4,
                'pitch'
            );
            let block5 = this.addMurmurG(
                pe_index,
                this.state.pe_rows5,
                'quality'
            );
            if (values.length > 0)
                arr.push(
                    <Table collapsing>
                        <Table.Header>
                            <div sle={{ float: 'right' }}>
                                <Button
                                    circular
                                    icon='x'
                                    size='mini'
                                    pe_index={pe_index}
                                    onClick={this.removeButton}
                                />
                            </div>
                        </Table.Header>
                        {block0}
                        {block1}
                        Heard best at: {block2}
                        Intensity: {block3}
                        Pitch: {block4}
                        Quality: {block5}
                        <ExpandMurmurs type='ExpandMurmurs' ind={pe_index} />
                        {/* TODO: figure out why expand murmurs is going on every murmur, i think it has to do with this line of code */}
                    </Table>
                );
        }

        return (
            <div style={{ marginTop: 20 }}>
                {arr}
                add {this.props.type.toLowerCase()}{' '}
                <Button
                    circular
                    icon='plus'
                    size='mini'
                    onClick={this.addButton}
                />
            </div>
        );
    };
}

export default HeartMurmurs;
