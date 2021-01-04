import React from 'react';

class FamilyHistoryNote extends React.Component {
    checkEmpty() {
        for (const key in this.props.familyHistory) {
            if (!(this.props.familyHistory[key].Yes === false && this.props.familyHistory[key].No === false)) {
                return false;
            }
        }
        return true;
    }

    render() {
        const familyHistory = this.props.familyHistory;

        let components = [];
        for (var condition in familyHistory) {
            let familyMembers = [];
            if (familyHistory[condition].Yes === true) {
                if (familyHistory[condition]['Family Member']) {
                    for (var member in familyHistory[condition]['Family Member']) {
                        if (familyHistory[condition]['Cause of Death'][member]) {
                            familyMembers.push(`${familyHistory[condition]['Family Member'][member]} (cause of death)`);
                        }
                        else {
                            familyMembers.push(familyHistory[condition]['Family Member'][member]);
                        }
                    }
                }
                components[condition] = {
                    condition: familyHistory[condition]['Condition'],
                    family: familyMembers,
                    comments: familyHistory[condition]['Comments']
                }
            }
        }

        if (this.checkEmpty()) {
            return (
                <div>No family history reported.</div>
            );
        }

        return (
            <ul>
                {Object.keys(components).map(key => (
                    <li>
                        <b>{components[key].condition}: </b>
                        {components[key].family.length > 0 ? `${components[key].family.join(', ')}. ` : null} 
                        {components[key].comments}
                    </li>
                ))}
            </ul>
        )
    }
}

export default FamilyHistoryNote;