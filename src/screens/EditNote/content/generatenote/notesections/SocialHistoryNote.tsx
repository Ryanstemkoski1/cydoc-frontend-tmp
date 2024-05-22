import {
    SubstanceUsageResponse,
    YesNoMaybeResponse,
    YesNoResponse,
} from '@constants/enums';
import React, { Component } from 'react';
import { SocialHistoryState } from '@redux/reducers/socialHistoryReducer';
import { Table } from 'semantic-ui-react';

interface SocialHistoryProps {
    socialHistory: SocialHistoryState;
    isRich: boolean;
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
            if (
                alcohol[index].numberPerWeek == -1 ||
                alcohol[index].size == '' ||
                alcohol[index].type == ''
            ) {
                //don't do anything
            } else {
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
            }
        });
        return productsUsed.join(', ');
    };

    recreationalDrugsProductsUsed = (socialHistory: SocialHistoryState) => {
        const productsUsed: string[] = [];
        const recreationalDrugs = socialHistory.recreationalDrugs.drugsUsed;

        Object.keys(recreationalDrugs).map((_key, index) => {
            if (
                recreationalDrugs[index].modesOfDelivery.length == 0 ||
                recreationalDrugs[index].name == '' ||
                recreationalDrugs[index].numberPerWeek == -1
            ) {
                //don't do anything
            } else {
                const product = `${recreationalDrugs[index].name} (${recreationalDrugs[index].numberPerWeek} per week, ${recreationalDrugs[index].modesOfDelivery})`;
                productsUsed.push(product);
            }
        });
        return productsUsed.join(', ');
    };

    interestedInQuitting = (socialHistorySection: SocialHistorySection) => {
        let str = '';
        socialHistorySection.interestedInQuitting === YesNoMaybeResponse.Yes
            ? (str = ' Patient is interested in quitting.')
            : socialHistorySection.interestedInQuitting ===
                YesNoMaybeResponse.Maybe
              ? (str = ' Patient is maybe interested in quitting.')
              : socialHistorySection.interestedInQuitting ===
                  YesNoMaybeResponse.No
                ? (str = ' Patient is not interested in quitting.')
                : (str = '');
        return str;
    };

    /*checkEmptyAnswers = (socialHistorySection: SocialHistorySection) => {
        if (socialHistorySection.triedToQuit === YesNoResponse.None && socialHistorySection.interestedInQuitting ===
            YesNoMaybeResponse.None) {
            return true;
        }
        return false;
    };*/

    triedToQuit = (socialHistorySection: SocialHistorySection) => {
        let str = '';
        if (socialHistorySection.triedToQuit === YesNoResponse.Yes) {
            str = ' Patient has tried to quit before.';
        } else if (socialHistorySection.triedToQuit === YesNoResponse.No) {
            str = ' Patient has never tried to quit before.';
        }
        return str;
    };

    validatePackPerDay = (input: string) => {
        input = input.trim();
        const pattern = /^(?:(?:\d+\s+)?\d+\/\d+|\d+(?:\.\d+)?|\d+)$/;
        return pattern.test(input) ? false : true;
    };
    render(): React.ReactNode {
        const { socialHistory } = this.props;
        const packsPerDay: any = () => {
            if (
                this.validatePackPerDay(`${socialHistory.tobacco.packsPerDay}`)
            ) {
                return `0`;
            }
            const packs = `${socialHistory.tobacco.packsPerDay}`
                .split(' ')
                .reduce((acc, el) => {
                    if (eval(el) == undefined) {
                        return acc;
                    }
                    return (acc = eval(acc) + eval(el));
                }, '0');
            return packs;
        };
        const numberOfYears =
            socialHistory.tobacco.numberOfYears == -1
                ? 0
                : socialHistory.tobacco.numberOfYears;

        const tobaccoText = this.checkEmptyTobacco()
            ? null
            : (socialHistory.tobacco.usage === SubstanceUsageResponse.Yes
                  ? ' Currently uses tobacco.'
                  : '') +
              (socialHistory.tobacco.usage === SubstanceUsageResponse.InThePast
                  ? ' Used to use tobacco but does not anymore.'
                  : '') +
              (socialHistory.tobacco.quitYear !== -1 &&
              socialHistory.tobacco.usage === SubstanceUsageResponse.InThePast
                  ? ` Quit Year: ${socialHistory.tobacco.quitYear.toString()}.`
                  : '') +
              (socialHistory.tobacco.usage === SubstanceUsageResponse.NeverUsed
                  ? ' Never used.'
                  : '') +
              (packsPerDay != -1 && socialHistory.tobacco.numberOfYears
                  ? ` ${(numberOfYears * packsPerDay())
                        .toFixed(1)
                        .toString()} pack years.`
                  : '') +
              (socialHistory.tobacco.productsUsed.length !== 0
                  ? ` Products used: ${socialHistory.tobacco.productsUsed.join(
                        ', '
                    )}.`
                  : '') +
              (socialHistory.tobacco.interestedInQuitting ===
                  YesNoMaybeResponse.Yes ||
              socialHistory.tobacco.interestedInQuitting ===
                  YesNoMaybeResponse.No ||
              socialHistory.tobacco.interestedInQuitting ===
                  YesNoMaybeResponse.Maybe
                  ? `${this.interestedInQuitting(socialHistory.tobacco)}`
                  : '') +
              (socialHistory.tobacco.usage === SubstanceUsageResponse.Yes ||
              socialHistory.tobacco.usage === SubstanceUsageResponse.InThePast
                  ? `${this.triedToQuit(socialHistory.tobacco)}`
                  : '') +
              (socialHistory.tobacco.comments
                  ? ` Comments: ${socialHistory.tobacco.comments}`
                  : '');

        const alcoholText = this.checkEmptyAlcohol()
            ? null
            : (socialHistory.alcohol.usage === SubstanceUsageResponse.Yes
                  ? ' Currently uses alcohol.'
                  : '') +
              (socialHistory.alcohol.usage === SubstanceUsageResponse.InThePast
                  ? ' Used to use alcohol but does not anymore.'
                  : '') +
              (socialHistory.alcohol.quitYear !== -1 &&
              socialHistory.alcohol.usage === SubstanceUsageResponse.InThePast
                  ? ` Quit Year: ${socialHistory.alcohol.quitYear}.`
                  : '') +
              (socialHistory.alcohol.usage === SubstanceUsageResponse.NeverUsed
                  ? ' Never used.'
                  : '') +
              (socialHistory.alcohol.drinksConsumed.length > 0 &&
              this.alcoholProductsUsed(socialHistory).length > 0
                  ? ` Products used: ${this.alcoholProductsUsed(
                        socialHistory
                    )}.`
                  : '') +
              (socialHistory.alcohol.interestedInQuitting ===
                  YesNoMaybeResponse.Yes ||
              socialHistory.alcohol.interestedInQuitting ===
                  YesNoMaybeResponse.No ||
              socialHistory.alcohol.interestedInQuitting ===
                  YesNoMaybeResponse.Maybe
                  ? `${this.interestedInQuitting(socialHistory.alcohol)}`
                  : '') +
              (socialHistory.alcohol.usage === SubstanceUsageResponse.Yes ||
              socialHistory.alcohol.usage === SubstanceUsageResponse.InThePast
                  ? `${this.triedToQuit(socialHistory.alcohol)}`
                  : '') +
              (socialHistory.alcohol.comments
                  ? ` Comments: ${socialHistory.alcohol.comments}`
                  : '');
        const recreationalDrugsText = this.checkEmptyRecreationalDrugs()
            ? null
            : (socialHistory.recreationalDrugs.usage ===
              SubstanceUsageResponse.Yes
                  ? ' Currently uses recreational drugs.'
                  : '') +
              (socialHistory.recreationalDrugs.usage ===
              SubstanceUsageResponse.InThePast
                  ? ' Used to use recreational drugs but does not anymore.'
                  : '') +
              (socialHistory.recreationalDrugs.quitYear !== -1 &&
              socialHistory.recreationalDrugs.usage ===
                  SubstanceUsageResponse.InThePast
                  ? ` Quit Year: ${socialHistory.recreationalDrugs.quitYear}.`
                  : '') +
              (socialHistory.recreationalDrugs.usage ===
              SubstanceUsageResponse.NeverUsed
                  ? ' Never used.'
                  : '') +
              (socialHistory.recreationalDrugs.drugsUsed.length > 0 &&
              this.recreationalDrugsProductsUsed(socialHistory).length > 0
                  ? ` Products used: ${this.recreationalDrugsProductsUsed(
                        socialHistory
                    )}.`
                  : '') +
              (socialHistory.recreationalDrugs.interestedInQuitting ===
                  YesNoMaybeResponse.Yes ||
              socialHistory.recreationalDrugs.interestedInQuitting ===
                  YesNoMaybeResponse.No ||
              socialHistory.recreationalDrugs.interestedInQuitting ===
                  YesNoMaybeResponse.Maybe
                  ? `${this.interestedInQuitting(
                        socialHistory.recreationalDrugs
                    )}`
                  : '') +
              (socialHistory.recreationalDrugs.usage ===
                  SubstanceUsageResponse.Yes ||
              socialHistory.recreationalDrugs.usage ===
                  SubstanceUsageResponse.InThePast
                  ? `${this.triedToQuit(socialHistory.recreationalDrugs)}`
                  : '') +
              (socialHistory.recreationalDrugs.comments
                  ? ` Comments: ${socialHistory.recreationalDrugs.comments}`
                  : '');

        return (
            <div>
                {!this.props.isRich ? (
                    <div>
                        {tobaccoText ? (
                            <>
                                <b>Tobacco: </b>
                                {tobaccoText}
                            </>
                        ) : (
                            <div />
                        )}
                        {tobaccoText &&
                        (alcoholText || recreationalDrugsText) ? (
                            <br />
                        ) : (
                            <div />
                        )}
                        {alcoholText ? (
                            <>
                                <b>Alcohol:</b>
                                {alcoholText}
                            </>
                        ) : (
                            <div />
                        )}
                        {alcoholText && recreationalDrugsText ? (
                            <br />
                        ) : (
                            <div />
                        )}
                        {recreationalDrugsText ? (
                            <>
                                <b>Recreational Drugs:</b>
                                {recreationalDrugsText}
                            </>
                        ) : (
                            <div />
                        )}
                        {socialHistory.livingSituation === '' ? (
                            <div />
                        ) : (
                            <div>
                                <b>Living Situation: </b>
                                {socialHistory.livingSituation}
                            </div>
                        )}
                        {socialHistory.employment === '' ? (
                            <div />
                        ) : (
                            <div>
                                <b>Employment: </b>
                                {socialHistory.employment}
                            </div>
                        )}
                        {socialHistory.diet === '' ? (
                            <div />
                        ) : (
                            <div>
                                <b>Diet: </b>
                                {socialHistory.diet}
                            </div>
                        )}
                        {socialHistory.exercise === '' ? (
                            <div />
                        ) : (
                            <div>
                                <b>Exercise: </b>
                                {socialHistory.exercise}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {(tobaccoText ||
                            alcoholText ||
                            recreationalDrugsText) && (
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            Substance
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Notes
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                {tobaccoText && (
                                    <Table.Row key={0}>
                                        <Table.Cell>
                                            {<b>Tobacco</b>}
                                        </Table.Cell>
                                        <Table.Cell>{tobaccoText}</Table.Cell>
                                    </Table.Row>
                                )}
                                {alcoholText && (
                                    <Table.Row key={1}>
                                        <Table.Cell>
                                            {<b>Alcohol</b>}
                                        </Table.Cell>
                                        <Table.Cell>{alcoholText}</Table.Cell>
                                    </Table.Row>
                                )}
                                {recreationalDrugsText && (
                                    <Table.Row key={2}>
                                        <Table.Cell>
                                            {<b>Recreational Drugs</b>}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {recreationalDrugsText}
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table>
                        )}
                        {(socialHistory.livingSituation !== '' ||
                            socialHistory.diet !== '' ||
                            socialHistory.employment !== '' ||
                            socialHistory.exercise! !== '') && (
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            Other Social Factors
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Notes
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                {socialHistory.livingSituation !== '' && (
                                    <Table.Row key={0}>
                                        <Table.Cell>
                                            {<b>Living Situation</b>}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {socialHistory.livingSituation}
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                {socialHistory.employment !== '' && (
                                    <Table.Row key={1}>
                                        <Table.Cell>
                                            {<b>Employment</b>}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {socialHistory.employment}
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                {socialHistory.diet !== '' && (
                                    <Table.Row key={2}>
                                        <Table.Cell>{<b>Diet</b>}</Table.Cell>
                                        <Table.Cell>
                                            {socialHistory.diet}
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                                {socialHistory.exercise !== '' && (
                                    <Table.Row key={3}>
                                        <Table.Cell>
                                            {<b>Exercise</b>}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {socialHistory.exercise}
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default SocialHistoryNote;
