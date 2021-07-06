import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from 'constants/enums';
import React, { Component } from 'react';
import { SocialHistoryState } from 'redux/reducers/socialHistoryReducer';

interface SocialHistoryProps {
    socialHistory: SocialHistoryState;
}

interface SocialHistorySection {
    interestedInQuitting?: YesNoMaybeResponse;
    triedToQuit?: YesNoResponse;
}

type Props = SocialHistoryProps & SocialHistorySection;

export class SocialHistoryNote extends Component<Props> {
    checkEmptyAlcohol = () => {
        if (
            this.props.socialHistory.alcohol.usage ===
            SubstanceUsageResponse.None
        ) {
            return true;
        }
        return false;
    };

    checkEmptyTobacco = (): boolean => {
        if (
            this.props.socialHistory.tobacco.usage ===
            SubstanceUsageResponse.None
        ) {
            return true;
        }
        return false;
    };

    checkEmptyRecreationalDrugs = (): boolean => {
        if (
            this.props.socialHistory.recreationalDrugs.usage ===
            SubstanceUsageResponse.None
        ) {
            return true;
        }
        return false;
    };

    alcoholProductsUsed = (socialHistory: SocialHistoryState) => {
        const productsUsed: string[] = [];
        const alcohol = socialHistory.alcohol.drinksConsumed;
        Object.keys(alcohol).map((_key, index) => {
            const product = `${alcohol[index].type} (${
                alcohol[index].numberPerWeek
            } ${alcohol[index].size}${
                alcohol[index].numberPerWeek !== 1
                    ? alcohol[index].size.endsWith('s')
                        ? 'es'
                        : 's'
                    : ''
            } per week)`;
            productsUsed.push(product);
        });
        return productsUsed.join(', ');
    };

    recreationalDrugsProductsUsed = (socialHistory: SocialHistoryState) => {
        const productsUsed: string[] = [];
        const recreationalDrugs = socialHistory.recreationalDrugs.drugsUsed;
        Object.keys(recreationalDrugs).map((_key, index) => {
            const product = `${recreationalDrugs[index].name} (${recreationalDrugs[index].numberPerWeek} per week, ${recreationalDrugs[index].modesOfDelivery}', ')`;
            productsUsed.push(product);
        });
        return productsUsed.join(', ');
    };

    interestedInQuitting = (socialHistorySection: SocialHistorySection) => {
        let str;
        socialHistorySection.interestedInQuitting === YesNoMaybeResponse.Yes
            ? (str = 'Interested in quitting? Yes')
            : socialHistorySection.interestedInQuitting ===
              YesNoMaybeResponse.Maybe
            ? (str = 'Interested in quitting? Maybe')
            : socialHistorySection.interestedInQuitting ===
              YesNoMaybeResponse.No
            ? (str = 'Interested in quitting? No')
            : (str = null);
        return str;
    };

    checkEmptyAnswers = (socialHistorySection: SocialHistorySection) => {
        if (socialHistorySection.triedToQuit === YesNoResponse.None) {
            return true;
        }
        if (
            socialHistorySection.interestedInQuitting ===
            YesNoMaybeResponse.None
        ) {
            return true;
        }
        return false;
    };

    triedToQuit = (socialHistorySection: SocialHistorySection) => {
        let str;
        if (socialHistorySection.triedToQuit === YesNoResponse.Yes) {
            str = 'Tried to quit? Yes';
        } else if (socialHistorySection.triedToQuit === YesNoResponse.No) {
            str = 'Tried to quit? No';
        }
        return str;
    };

    render(): React.ReactNode {
        const { socialHistory } = this.props;

        return (
            <div>
                {this.checkEmptyTobacco() ? (
                    <div>No tobacco use reported.</div>
                ) : (
                    <div>
                        <b>Tobacco</b>
                        <ul>
                            {socialHistory.tobacco.usage ===
                            SubstanceUsageResponse.Yes ? (
                                <li>Currently uses tobacco</li>
                            ) : null}
                            {socialHistory.tobacco.usage ===
                            SubstanceUsageResponse.InThePast ? (
                                <li>
                                    Used to use tobacco but does not anymore
                                </li>
                            ) : null}
                            {socialHistory.tobacco.quitYear ? (
                                <li>
                                    Quit Year:{socialHistory.tobacco.quitYear}
                                </li>
                            ) : null}
                            {socialHistory.tobacco.usage ===
                            SubstanceUsageResponse.NeverUsed ? (
                                <li>Never used</li>
                            ) : null}
                            {socialHistory.tobacco.packsPerDay &&
                            socialHistory.tobacco.numberOfYears ? (
                                <li>
                                    {socialHistory.tobacco.numberOfYears *
                                        socialHistory.tobacco.packsPerDay}{' '}
                                    pack years
                                </li>
                            ) : null}
                            {socialHistory.tobacco.productsUsed ? (
                                <li>
                                    Products used:{' '}
                                    {socialHistory.tobacco.productsUsed.join(
                                        ', '
                                    )}
                                </li>
                            ) : null}
                            {(socialHistory.tobacco.usage ===
                                SubstanceUsageResponse.Yes ||
                                socialHistory.tobacco.usage ===
                                    SubstanceUsageResponse.InThePast) &&
                            !this.checkEmptyAnswers(socialHistory.tobacco) ? (
                                <li>
                                    {this.interestedInQuitting(
                                        socialHistory.tobacco
                                    )}
                                </li>
                            ) : null}
                            {(socialHistory.tobacco.usage ===
                                SubstanceUsageResponse.Yes ||
                                socialHistory.tobacco.usage ===
                                    SubstanceUsageResponse.InThePast) &&
                            !this.checkEmptyAnswers(socialHistory.tobacco) ? (
                                <li>
                                    {this.triedToQuit(socialHistory.tobacco)}
                                </li>
                            ) : null}
                            {socialHistory.tobacco.comments ? (
                                <li>
                                    Comments:{socialHistory.tobacco.comments}
                                </li>
                            ) : null}
                        </ul>
                    </div>
                )}

                {this.checkEmptyAlcohol() ? (
                    <div>No alcohol use reported.</div>
                ) : (
                    <div>
                        <b>Alcohol</b>
                        <ul>
                            {socialHistory.alcohol.usage ===
                            SubstanceUsageResponse.Yes ? (
                                <li>Currently uses alcohol</li>
                            ) : null}
                            {socialHistory.alcohol.usage ===
                            SubstanceUsageResponse.InThePast ? (
                                <li>
                                    Used to use alcohol but does not anymore
                                </li>
                            ) : null}
                            {socialHistory.alcohol.quitYear ? (
                                <li>
                                    Quit Year:{socialHistory.alcohol.quitYear}
                                </li>
                            ) : null}
                            {socialHistory.alcohol.usage ===
                            SubstanceUsageResponse.NeverUsed ? (
                                <li>Never used</li>
                            ) : null}
                            {socialHistory.alcohol.drinksConsumed.length > 0 ? (
                                <li>
                                    Products used:{' '}
                                    {this.alcoholProductsUsed(socialHistory)}
                                </li>
                            ) : null}
                            {(socialHistory.alcohol.usage ===
                                SubstanceUsageResponse.Yes ||
                                socialHistory.alcohol.usage ===
                                    SubstanceUsageResponse.InThePast) &&
                            !this.checkEmptyAnswers(socialHistory.alcohol) ? (
                                <li>
                                    {this.interestedInQuitting(
                                        socialHistory.alcohol
                                    )}
                                </li>
                            ) : null}
                            {(socialHistory.alcohol.usage ===
                                SubstanceUsageResponse.Yes ||
                                socialHistory.alcohol.usage ===
                                    SubstanceUsageResponse.InThePast) &&
                            !this.checkEmptyAnswers(socialHistory.alcohol) ? (
                                <li>
                                    {this.triedToQuit(socialHistory.alcohol)}
                                </li>
                            ) : null}
                            {socialHistory.alcohol.comments ? (
                                <li>
                                    Comments:{socialHistory.alcohol.comments}
                                </li>
                            ) : null}
                        </ul>
                    </div>
                )}

                {this.checkEmptyRecreationalDrugs() ? (
                    <div>No recreational drug use reported.</div>
                ) : (
                    <div>
                        <b>Recreational Drugs</b>
                        <ul>
                            {socialHistory.recreationalDrugs.usage ===
                            SubstanceUsageResponse.Yes ? (
                                <li>Currently uses substances</li>
                            ) : null}
                            {socialHistory.recreationalDrugs.usage ===
                            SubstanceUsageResponse.InThePast ? (
                                <li>
                                    Used to use substances but does not anymore
                                </li>
                            ) : null}
                            {socialHistory.recreationalDrugs.quitYear ? (
                                <li>
                                    Quit Year:
                                    {socialHistory.recreationalDrugs.quitYear}
                                </li>
                            ) : null}
                            {socialHistory.recreationalDrugs.usage ===
                            SubstanceUsageResponse.NeverUsed ? (
                                <li>Never used</li>
                            ) : null}
                            {socialHistory.recreationalDrugs.drugsUsed.length >
                            0 ? (
                                <li>
                                    Products used:{' '}
                                    {this.recreationalDrugsProductsUsed(
                                        socialHistory
                                    )}
                                </li>
                            ) : null}
                            {(socialHistory.recreationalDrugs.usage ===
                                SubstanceUsageResponse.Yes ||
                                socialHistory.recreationalDrugs.usage ===
                                    SubstanceUsageResponse.InThePast) &&
                            !this.checkEmptyAnswers(
                                socialHistory.recreationalDrugs
                            ) ? (
                                <li>
                                    {this.interestedInQuitting(
                                        socialHistory.recreationalDrugs
                                    )}
                                </li>
                            ) : null}
                            {(socialHistory.recreationalDrugs.usage ===
                                SubstanceUsageResponse.Yes ||
                                socialHistory.recreationalDrugs.usage ===
                                    SubstanceUsageResponse.InThePast) &&
                            !this.checkEmptyAnswers(
                                socialHistory.recreationalDrugs
                            ) ? (
                                <li>
                                    {this.triedToQuit(
                                        socialHistory.recreationalDrugs
                                    )}
                                </li>
                            ) : null}
                            {socialHistory.recreationalDrugs.comments ? (
                                <li>
                                    Comments:
                                    {socialHistory.recreationalDrugs.comments}
                                </li>
                            ) : null}
                        </ul>
                    </div>
                )}

                {socialHistory.livingSituation === '' ? (
                    <div>No living situation reported.</div>
                ) : (
                    <div>
                        <b>Living Situation: </b>
                        {socialHistory.livingSituation}
                    </div>
                )}
                {socialHistory.employment === '' ? (
                    <div>No employment reported.</div>
                ) : (
                    <div>
                        <b>Employment: </b>
                        {socialHistory.employment}
                    </div>
                )}
                {socialHistory.diet === '' ? (
                    <div>No diet reported.</div>
                ) : (
                    <div>
                        <b>Diet: </b>
                        {socialHistory.diet}
                    </div>
                )}
                {socialHistory.exercise === '' ? (
                    <div>No exercise reported.</div>
                ) : (
                    <div>
                        <b>Exercise: </b>
                        {socialHistory.exercise}
                    </div>
                )}
            </div>
        );
    }
}

export default SocialHistoryNote;
