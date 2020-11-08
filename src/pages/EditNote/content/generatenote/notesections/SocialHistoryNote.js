import React from 'react';

class SocialHistoryNote extends React.Component {

    alcoholProductsUsed(socialHistory) {
        const productsUsed = [];
        const alcohol = socialHistory.Alcohol['fields'];
        Object.keys(alcohol).map(key => {
            const product = `${alcohol[key]['Drink Type']} (${alcohol[key]['# Per Week']} ${alcohol[key]['Drink Size']}${parseInt(alcohol[key]['# Per Week']) !== 1 ? 's' : ''} per week)`;
            productsUsed.push(product);
        });
        return productsUsed.join(', ');
    }

    recreationalDrugsProductsUsed(socialHistory) {
        const productsUsed = [];
        const recreationalDrugs = socialHistory['Recreational Drugs']['fields'];
        Object.keys(recreationalDrugs).map(key => {
            const product = `${recreationalDrugs[key]['Drug Name']} (${recreationalDrugs[key]['# Per Week']} per week, ${recreationalDrugs[key]['Mode of Delivery'].join(', ')})`;
            productsUsed.push(product);
        });
        return productsUsed.join(', ');
    }

    interestedInQuitting(socialHistorySection) {
        let str;
        socialHistorySection['InterestedInQuitting']['Yes'] === true ? str = 'Interested in quitting? Yes' :
            socialHistorySection['InterestedInQuitting']['Maybe'] === true ? str = 'Interested in quitting? Maybe' :
            socialHistorySection['InterestedInQuitting']['No'] === true ? str = 'Interested in quitting? No' : str = null;
        return str;
    }

    triedToQuit(socialHistorySection) {
        let str;
        if (socialHistorySection['TriedToQuit']['Yes'] === true) {
            str = 'Tried to quit? Yes';
        } else if (socialHistorySection['TriedToQuit']['No'] === true) {
            str = 'Tried to quit? No';
        }
        return str;
    }

    render() {
        const socialHistory = this.props.socialHistory;

        return (
            <div>
                <div>
                    <b>Tobacco</b>
                    <ul>
                        {socialHistory.Tobacco['Yes'] === true ? <li>Currently uses tobacco</li> : null}
                        {socialHistory.Tobacco['In the Past'] === true ? <li>Used to use tobacco but does not anymore</li> : null}
                        {socialHistory.Tobacco['Quit Year'] ? <li>Quit Year: {socialHistory.Tobacco['Quit Year']}</li> : null}
                        {socialHistory.Tobacco['Never Used'] === true ? <li>Never used</li> : null}
                        {socialHistory.Tobacco['Packs/Day'] && socialHistory.Tobacco['Number of Years'] ? <li>{socialHistory.Tobacco['Number of Years']*socialHistory.Tobacco['Packs/Day']} pack years</li> : null}
                        {socialHistory.Tobacco['Products Used'] ? <li>Products used: {socialHistory.Tobacco['Products Used'].join(', ')}</li> : null}
                        {socialHistory.Tobacco['Yes'] === true || socialHistory.Tobacco['In the Past'] === true ? <li>{this.interestedInQuitting(socialHistory.Tobacco)}</li> : null}
                        {socialHistory.Tobacco['Yes'] === true || socialHistory.Tobacco['In the Past'] === true ? <li>{this.triedToQuit(socialHistory.Tobacco)}</li> : null}
                        {socialHistory.Tobacco['Comments'] ? <li>Comments: {socialHistory.Tobacco['Comments']}</li> : null}
                    </ul>
                </div>
                
                <div>
                    <b>Alcohol</b>
                    <ul>
                        {socialHistory.Alcohol['Yes'] === true ? <li>Currently uses alcohol</li> : null}
                        {socialHistory.Alcohol['In the Past'] === true ? <li>Used to use alcohol but does not anymore</li> : null}
                        {socialHistory.Alcohol['Quit Year'] ? <li>Quit Year: {socialHistory.Alcohol['Quit Year']}</li> : null}
                        {socialHistory.Alcohol['Never Used'] === true ? <li>Never used</li> : null}
                        {socialHistory.Alcohol['fields'][0]['Drink Type'] !== "" ? <li>Products used: {this.alcoholProductsUsed(socialHistory)}</li> : null}
                        {socialHistory.Alcohol['Yes'] === true || socialHistory.Alcohol['In the Past'] === true ? <li>{this.interestedInQuitting(socialHistory.Alcohol)}</li> : null}
                        {socialHistory.Alcohol['Yes'] === true || socialHistory.Alcohol['In the Past'] === true ? <li>{this.triedToQuit(socialHistory.Alcohol)}</li> : null}
                        {socialHistory.Alcohol['Comments'] ? <li>Comments: {socialHistory.Alcohol['Comments']}</li> : null}
                    </ul>
                </div>
                
                <div>
                    <b>Recreational Drugs</b>
                    <ul>
                        {socialHistory['Recreational Drugs']['Yes'] === true ? <li>Currently uses substances</li> : null}
                        {socialHistory['Recreational Drugs']['In the Past'] === true ? <li>Used to use substances but does not anymore</li> : null}
                        {socialHistory['Recreational Drugs']['Quit Year'] ? <li>Quit Year: {socialHistory['Recreational Drugs']['Quit Year']}</li> : null}
                        {socialHistory['Recreational Drugs']['Never'] === true ? <li>Never used</li> : null}
                        {socialHistory['Recreational Drugs']['fields'][0]['Drug Name'] !== "" ? <li>Products used: {this.recreationalDrugsProductsUsed(socialHistory)}</li> : null}
                        {socialHistory['Recreational Drugs']['Yes'] === true || socialHistory['Recreational Drugs']['In the Past'] === true ? <li>{this.interestedInQuitting(socialHistory['Recreational Drugs'])}</li> : null}
                        {socialHistory['Recreational Drugs']['Yes'] === true || socialHistory['Recreational Drugs']['In the Past'] === true ? <li>{this.triedToQuit(socialHistory['Recreational Drugs'])}</li> : null}
                        {socialHistory['Recreational Drugs']['Comments'] ? <li>Comments: {socialHistory['Recreational Drugs']['Comments']}</li> : null}
                    </ul>
                </div> 
                
                <div> <b>Living Situation: </b> {socialHistory['Living Situation']} </div>
                <div> <b>Employment: </b> {socialHistory.Employment} </div>
                <div> <b>Diet: </b> {socialHistory.Diet} </div>
                <div> <b> Exercise: </b> {socialHistory.Exercise} </div>
            </div>
        )
    }
}

export default SocialHistoryNote;