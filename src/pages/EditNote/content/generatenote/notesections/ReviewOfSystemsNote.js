import React from 'react';

class ReviewOfSystemsNote extends React.Component {
    render() {
        const review = this.props.reviewOfSystems;

        let components = [];
        for (var key in review) {
            let positives = [];
            let negatives = [];
            for (var question in review[key]) {
                if (review[key][question] === 'y') {
                    positives.push(question.toLowerCase());
                } else if (review[key][question] === 'n') {
                    negatives.push(question.toLowerCase());
                }
            }
            components[key] = {
                positives: positives,
                negatives: negatives
            }
        }
        return (
            <ul>
                {Object.keys(components).map(key => (
                    components[key].positives.length > 0 || components[key].negatives.length > 0 ?
                        <li>
                            <b>{key}: </b>
                            {components[key].positives.length > 0 ? `Positive for ${components[key].positives.join(', ')}. `: null}
                            {components[key].negatives.length > 0 ? `Negative for ${components[key].negatives.join(', ')}. ` : null}
                        </li>
                    : null
                ))}
            </ul>
        )
    }
}

export default ReviewOfSystemsNote;