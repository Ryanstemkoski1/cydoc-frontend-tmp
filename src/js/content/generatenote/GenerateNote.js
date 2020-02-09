import  React, {Component} from 'react'
import HPIContext from "../../contexts/HPIContext"

export default class GenerateNote extends Component { 
    static contextType = HPIContext
    generate_table(item) {
        var table = "<table style='width:100%'> <tr>"
        var headers = Object.keys(this.context[item][0])
        for (var header_index in headers) {
            var header = headers[header_index]
            table += (" <th> " + header + " </th> ")
        }
        table += " </tr> <tr> "
        for (var index in this.context[item]) {
            var values = Object.values(this.context[item][index])
            for (var value_index in values) {
                table += (" <td> " + values[value_index] + "</td> ")
            }
            table += " </tr> <tr> "
        }
        table += "</tr> </table>"
        if (document.getElementById(item) !== null) {
            document.getElementById(item).innerHTML = table 
        }
    }
    generate_grid(item) {
        var grid = "<table style='width:100%'> <tr> <th> Condition </th>"
        var headers = Object.keys(Object.values(this.context[item])[0])
        for (var header_index in headers) {
            var header = headers[header_index]
            grid += (" <th> " + header + "</th> ")
        }
        grid += " </tr> <tr> "
        for (var key in this.context[item]) {
            grid += (" <td> " + key + "</td> ")
            var values = this.context[item][key]
            for (var value in values) {
                grid += (" <td> " + values[value] + "</td> ")
            }
            grid += " </tr> <tr>"
        }
        grid += "</tr> </table>"
        if (document.getElementById(item) !== null) {
            document.getElementById(item).innerHTML = grid 
        }
    }

    render() {
        return (
            <div>
                <div></div>
                <h3> Note Title: {this.context['title'] || 'Untitled'} </h3>
                <h3> Allergies: </h3>
                <h5 id="Allergies"> {this.generate_table('Allergies')} </h5>
                <h3> Medications: </h3>
                <h5 id="Medications"> {this.generate_table('Medications')} </h5>
                <h3> Surgical History: </h3>
                <h5 id="Surgical History"> {this.generate_table('Surgical History')} </h5>
                <h3> Medical History: </h3>
                <h5 id="Medical History"> {this.generate_grid('Medical History')} </h5>
                <h3> Family History: </h3>
                <h5 id="Family History"> {this.generate_grid('Family History')} </h5>
                <h3> Social History: </h3>
                <h5 id="Social History"> {this.generate_grid('Social History')} </h5>
                <h3> hpi: </h3>
                <h6> {JSON.stringify(this.context['hpi'])} </h6>
            </div>
        )
    }
} 