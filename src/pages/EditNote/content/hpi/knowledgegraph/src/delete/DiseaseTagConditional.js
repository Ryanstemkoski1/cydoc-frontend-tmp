import React, {Component} from 'react'
import PositiveDiseases from "../components/PositiveDiseases";

function DiseaseTagConditional(props) {

    if (props.id === 1) {

    }

    return (
            <div> {positiveDiseases} </div>
        )
}

// class DiseaseTagConditional extends Component {
//     constructor() {
//         super()
//         this.state = {
//             diseases_positive: []
//         }
//     }
//
//     handler(value, id) {
//         var new_array = this.state.diseases_positive
//         if (id === 1) {
//             new_array = new_array.concat(value)
//         }
//         else if (id===-1) {
//             new_array.splice(new_array.indexOf(value), 1)
//         }
//         this.setState({diseases_positive: new_array})
//     }
// }

export default DiseaseTagConditional