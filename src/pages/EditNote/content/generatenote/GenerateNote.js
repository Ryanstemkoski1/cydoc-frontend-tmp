import  React from 'react';
import HPIContext from '../../../../contexts/HPIContext';

class GenerateNote extends React.Component {

    static contextType = HPIContext

    reviewOfSystems() {
        const review = this.context["Review of Systems"];

        // ACCOMPLISHED: renders a list of systems with nested lists for their questions
        // TODO: sort questions by positive and negative and render that information instead
        
        // EXAMPLE:
        // Review of Systems
        //   - General
        //      - Positive: ..., ..., ..., ...
        //      - Negative: ..., ..., ..., ...

        let components = [];
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

        return (
            <div>
                {Object.keys(components).map(key => (
                    <li className="temp" key={key}>
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

    render() {
        return (
            <div>
                <h1> {this.context.title} </h1>
                <h3> History of Present Illness </h3>
                <h3> Patient History </h3>
                <h3> Review of Systems </h3>
                {this.reviewOfSystems()}
                <h3> Physical Exam </h3>
                <h3> Plan </h3>
            </div>
        )
    }
}

export default GenerateNote;