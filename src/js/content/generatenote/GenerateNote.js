import  React, {Component} from 'react'
import HPIContext from "../../contexts/HPIContext"

export default class GenerateNote extends Component { 
    static contextType = HPIContext
    function() {
        let array = []
        for (var item in this.context) {
            array.push (<h3> {item} </h3>)
            array.push(<h5> {JSON.stringify(this.context[item])} </h5>)
            }
        return array
    }
    render() {
        return (
            <h5> {this.function()} </h5>
        )
    }
} 