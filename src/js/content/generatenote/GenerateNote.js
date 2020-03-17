import  React, {Component} from 'react'
import HPIContext from "../../contexts/HPIContext"

export default class GenerateNote extends Component { 
    static contextType = HPIContext
    generate_table(item) {
        var none = true
        var table = "<h3>" + item + ": </h3><table style='width:100%'> <tr>"
        var headers = Object.keys(this.context[item][0])
        for (var header_index in headers) {
            var header = headers[header_index]
            table += (" <th> " + header + " </th> ")
        }
        table += " </tr> <tr> "
        for (var index in this.context[item]) {
            var values = Object.values(this.context[item][index])
            for (var value_index in values) {
                if (values[value_index].trim() !== "") none = false 
                table += (" <td> " + values[value_index] + "</td> ")
            }
            table += " </tr> <tr> "
        }
        table += "</tr> </table>"
        if (document.getElementById(item) !== null) {
            if (none) document.getElementById(item).innerHTML = ""
            else document.getElementById(item).innerHTML = table 
        }
    }
    generate_grid(item, display) { 
        var grid = "<h3>" + item + (display ? ":</h3><table style='width:100%'> <tr> <th> Condition </th>" : ":</h3><table style='width:100%'> <tr>") 
        var headers = Object.keys(Object.values(this.context[item])[0])
        for (var header_index in headers) {
            var header = headers[header_index]
            if (header !== "Yes" && header !== "No") grid += (" <th> " + header + "</th> ")
        }
        grid += " </tr> <tr> "
        var negatives = []
        var none = []
        for (var key in this.context[item]) {
            var yes = this.context[item][key]["Yes"] 
            var no = this.context[item][key]["No"] 
            if (yes) {
                if (display) grid += (" <td> " + key + "</td> ")
                var values = this.context[item][key]
                for (var header_index in headers) {
                    var header = headers[header_index]
                    if (header !== "Yes" && header !== "No") grid += (" <td> " + values[header] + "</td> ")}
                grid += " </tr> <tr>"
            }
            else if (no) negatives.push(key)
            else none.push(key)
        }
        grid += "</tr> </table>"
        if (negatives.length > 0) {
            grid += "<div> Negative for: " 
            for (var negative in negatives) grid += negatives[negative] + ", " 
            grid = grid.slice(0, grid.length-2)
            grid += "</div>"
        } 
        if (document.getElementById(item) !== null) {
            if (none.length === Object.keys(this.context[item]).length) document.getElementById(item).innerHTML = ""
            else document.getElementById(item).innerHTML = grid 
        }
    }

    review_of_systems() {
        // var ros = this.context["Review of Systems"]
        // var t_chart = "<table style='width:100%'> <tr> <th> Positive </th> <th> Negative </th> </tr>"
        // for (var key in ros) {
        //     if (ros[key] === 'y') {
        //         t_chart += ("<tr> <td>" + key + "</td> </tr>")
        //     }
        //     else if (ros[key] === 'n') {
        //         t_chart += ("<tr> <td>''</td> <td>" + key + "</td> </tr>")
        //     }
        // }
        // t_chart += "</table>"
        // console.log(t_chart)
        // if (document.getElementById("Review of Systems") !== null) {
        //     document.getElementById("Review of Systems").innerHTML = t_chart 
        // }
        var ros = this.context["Review of Systems"]
        var none = true 
        var positives = "<div> Positive for: "
        var negatives = "<div> Negative for: "
        for (var key in ros) {
            var answer = ros[key]
            if (answer === 'y' || answer === 'n') { 
                none = false 
                if (ros[key] === 'y') positives += (key + ", ")
                else if (ros[key] === 'n') negatives += (key + ", ") }}
        positives = positives.slice(0, positives.length-2)
        negatives = negatives.slice(0, negatives.length-2)
        positives += "</div>"
        negatives += "</div>" 
        if (document.getElementById("Review of Systems") !== null) {
            if (none) document.getElementById("Review of Systems").innerHTML = ""
            else document.getElementById("Review of Systems").innerHTML = ("<h3> Review of Systems: </h3>" + positives+negatives) 
        }
    }

    hpi() { 
        if (document.getElementById("hpi") !== null) {
            if (JSON.stringify(this.context['hpi']) === "{}") document.getElementById("hpi").innerHTML = ""
            else document.getElementById("hpi").innerHTML = JSON.stringify(this.context['hpi'])
        } 
    }

    physical_exam() {
        var none = true 
        var physical_exam = ""
        for (var item in this.context["Physical Exam"]) {
            var display = false 
            var display_string = ("<div>" + item + ": ")
            for (var value in this.context["Physical Exam"][item]) {
                if (item === 'Vitals') display_string += "</div> <div>"
                if (this.context["Physical Exam"][item][value] && this.context["Physical Exam"][item][value] !== 0 && this.context["Physical Exam"][item][value] !== '0') {
                    if (this.context["Physical Exam"][item][value] === true) display_string += (value + ", ") 
                    else display_string += (value + ": " + this.context["Physical Exam"][item][value] + ((value === 'Temperature') ? "&#176;" + "C" : "") + ((item === 'Vitals') ? "  " : ", "))
                    none = false 
                    display = true 
                }
            }
            display_string = display_string.slice(0, display_string.length-2)
            if (display) physical_exam += display_string + "</div>"
        }
        if (document.getElementById("Physical Exam") != null) {
            if (none) document.getElementById("Physical Exam").innerHTML = ""
            else document.getElementById("Physical Exam").innerHTML = ("<h5> Physical Exam: </h5>" + "<h5>" + physical_exam + "</h5>")
        }
    }

    render() {
        return (
            <div>
                <div></div>
                <h3> Note Title: {this.context['title'] || 'Untitled'} </h3>
                <h5 id="Allergies"> {this.generate_table('Allergies')} </h5>
                <h5 id="Medications"> {this.generate_table('Medications')} </h5>
                <h5 id="Surgical History"> {this.generate_table('Surgical History')} </h5>
                <h5 id="Medical History"> {this.generate_grid('Medical History')} </h5>
                <h5 id="Family History"> {this.generate_grid('Family History')} </h5>
                <h5 id="Social History"> {this.generate_grid('Social History', true)} </h5>
                <h5 id="hpi"> {this.hpi()} </h5>
                <h5 id="Review of Systems"> {this.review_of_systems()} </h5>
                <h5 id="Physical Exam"> {this.physical_exam()} </h5>
            </div>
        )
    }
} 