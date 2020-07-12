import  React from 'react';
import HPIContext from '../../../../contexts/HPIContext';

class GenerateNote extends React.Component {

    static contextType = HPIContext

    reviewOfSystems() {
        const review = this.context["Review of Systems"];

        // EXAMPLE:
        // Review of Systems
        //   - General
        //      - Positive: ..., ..., ..., ...
        //      - Negative: ..., ..., ..., ...
        var components = [];
        for (var key in review) {
            var positives = "";
            var negatives = "";
            // console.log(key);
            // console.log(review[key]);
            for (var question in review[key]) {
                // console.log(question);
                // console.log(review[key][question])
                if (review[key][question] === 'y') {
                    positives += question + ", ";
                } else if (review[key][question] === 'n') {
                    negatives += question + ", ";
                }
            }
            positives = positives.slice(0, positives.length - 2)
            negatives = negatives.slice(0, negatives.length - 2)
            // console.log(positives);
            // console.log(negatives);
            components[key] = {
                positives: positives,
                negatives: negatives
            }
        }
        // console.log(components);

        return (
            <div>
                {Object.keys(components).map(key => (
                    <li key={key}>
                        {key}
                        <ul>
                            Positive for: {components[key].positives}
                        </ul>
                        <ul>
                            Negative for: {components[key].negatives}
                        </ul>
                    </li>
                ))}
            </div>
        )
    }

    physicalExam() {
        const physical = this.context["Physical Exam"];
        // console.log(physical);
        
        var components = [];
        for (var key in physical) {
            var active = "";
            for (var question in physical[key]) {
                // console.log(question);
                // console.log(physical[key][question]);
                if (typeof physical[key][question] === 'object') {
                    // console.log(question);
                    if (physical[key][question].active === true) {
                        if (physical[key][question].left === true) {
                            active += question + ' (left), '
                        }
                        if (physical[key][question].right === true) {
                            active += question + ' (right), '
                        }
                    }
                }
                else if (physical[key][question] === true) {
                    active += question + ', ';
                }
            }
            active = active.slice(0, active.length - 2);
            components[key] = {
                active: active
            }
        }

        return (
            <div>
                {Object.keys(components).map(key => (
                    <li key={key}>
                        {key}: {components[key].active}
                    </li>
                ))}
            </div>
        )
    }

    render() {
        return (
            <div>
                <h1> {this.context.title} </h1>
                <h3> History of Present Illness </h3>
                <h3> Patient History </h3>
                <h3> Review of Systems </h3>
                {this.reviewOfSystems()}
                <h3> Physical Exam </h3>
                {this.physicalExam()}
                <h3> Plan </h3>
            </div>
        )
    }
}

export default GenerateNote;