import React from 'react'
import {Input} from "semantic-ui-react";
import DatePicker from 'react-date-picker';
import "./Button.css"
import ButtonTag from "./ButtonTag";
import YesNo from "./YesNo";
import HandleInput from "./HandleInput"
import { Dropdown } from 'semantic-ui-react'
import NumericInput from 'react-numeric-input';

class QuestionAnswer extends React.Component {
    constructor() {
        super()
        this.state = {
            response_array: [],
            startDate: new Date(),
            scale: 0
        }
        this.handler = this.handler.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handler(value, id) {
        return this.props.handler(value, id)
    }

    onChange = date => this.setState({ date })

    handleOnChange = (value) => {
        this.setState({
            volume: value
        })
    }

    render() {
        let button_map = []
        if (this.props.responseType === "YES-NO") {
            button_map.push(
                <YesNo
                    key={this.props.question}
                    handler={this.handler}
                />
            )
        }
        else if (this.props.responseType === "SHORT-TEXT") {
            button_map.push(<Input key={this.props.question}/>)
            // button_map.push(
            //     <HandleInput
            //         key={this.props.question}
            //         handler={this.handler}
            //     />
            // )
        }
        else if (this.props.responseType === 'TIME') {
            button_map.push(<DatePicker
                onChange={this.onChange}
                value={this.state.date} />)
        }

        else if (this.props.responseType === 'CLICK-BOXES') {
            button_map = this.props.response.map(item =>
                <ButtonTag
                    key={item}
                    name={item}
                    handler={this.handler}
                />
            )
        }
        else if (this.props.responseType === 'AGE') {
            button_map.push(<NumericInput min={0} max={120} />)
        }
        else if (this.props.responseType === "NUMBER") {
            button_map.push(<NumericInput min={0} max={10} />)
        }
        return (
            <div style={{marginBottom: 20}}>
                <svg style={{position: 'absolute'}}
                             width="153.9000380516052" height="200" pointerEvents="none"
                             position="absolute" version="1.1" xmlns="http://www.w3.org/1999/xhtml">
                    <path d="M 60 11 L 117.45002903938291 11 "
                          pointerEvents="all" version="1.1" xmlns="http://www.w3.org/1999/xhtml" style={{}}
                          fill="none" stroke="#005583" strokeWidth="1"> </path>
                    <path pointerEvents="all" version="1.1" xmlns="http://www.w3.org/1999/xhtml"
                          d="M117.45002903938291,11 L107.54511611972075,7 L111.95191532242617,11 L107.36180117011148,14
                            L117.45002903938291,11"
                          className="" stroke="#005583" fill="#005583"> </path>
                    {this.props.notLast ? (<path
                        d="M 60 11 L 60 200 "
                        pointerEvents="all" version="1.1" xmlns="http://www.w3.org/1999/xhtml" style={{}}
                        fill="none" stroke="#005583" strokeWidth="1"> </path>) : (<path
                        d="M 60 11 L 60 100 "
                        pointerEvents="all" version="1.1" xmlns="http://www.w3.org/1999/xhtml" style={{}}
                        fill="none" stroke="white" strokeWidth="2"> </path>)}
                        </svg>
                <div style={{marginLeft: 123}}> {this.props.question} <div style={{marginTop: 7}}>{button_map}</div> </div>
                </div>
        )
    }
}
export default QuestionAnswer