/**
 * @fileoverview Base components and types to abstract the overall
 * structure/responsiveness/interactions of the discussion and plan page.
 */

import {
    DiagnosesOptionMapping,
    OptionMapping,
    getOptionMapping,
} from '_processOptions';
import AddRowButton from 'components/tools/AddRowButton/AddRowButton';
import { WhenResponse } from 'constants/enums';
import medications from 'constants/medications';
import procedures from 'constants/procedures';
import registrationConstants from 'constants/registration-constants.json';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Accordion, Grid, Header, Icon } from 'semantic-ui-react';
import {
    ConditionCategoryKey,
    EventHandler,
    HandleOnAddItem,
    PlanAction,
} from '../util';

type Options = { main: OptionMapping; when?: OptionMapping };

type DiagnosesOptions = {
    main: DiagnosesOptionMapping;
    when?: DiagnosesOptionMapping;
};

interface CategoryFormStateProps<T> {
    categoryData: T[];
}

export interface CategoryFormOwnProps {
    mobile: boolean;
    conditionId: string;
    formatAction: (action: PlanAction, ...args: any[]) => EventHandler;
}

export type CategoryFormProps<T> = CategoryFormOwnProps &
    CategoryFormStateProps<T>;

export type CategoryFormComponent<T> = (
    row: T,
    options?: Options | DiagnosesOptions,
    onAddItem?: HandleOnAddItem
) => JSX.Element;

interface BaseCategoryFormProps<T> {
    mobile: boolean;
    category: ConditionCategoryKey;
    categoryData: T[];
    numColumns: 2 | 3;
    addRowLabel: string;
    components: {
        mobileContent: CategoryFormComponent<T>;
        mobileTitle: CategoryFormComponent<T>;
        gridColumn: CategoryFormComponent<T>;
        gridHeaders: React.FC;
    };
    addRow: EventHandler;
}

const specialties = getOptionMapping(registrationConstants.specialties);

const TYPE_TO_OPTION: {
    [key in ConditionCategoryKey]: OptionMapping;
} = {
    differentialDiagnoses: {},
    prescriptions: medications,
    proceduresAndServices: procedures,
    referrals: specialties,
};

/**
 * Component for all categories of the discussion and plan section of the note
 */
export const BaseCategoryForm = <T extends { id: string }>(
    props: BaseCategoryFormProps<T>
) => {
    const {
        category,
        categoryData,
        mobile,
        components,
        numColumns,
        addRowLabel,
        addRow,
    } = props;

    const [expanded, setExpanded] = useState<boolean>(false);
    const [activeRows, setActiveRows] = useState(new Set());
    const [options, setOptions] = useState<Options | DiagnosesOptions>({
        main: TYPE_TO_OPTION[category] || {},
    });

    useEffect(() => {
        if (category === 'differentialDiagnoses') {
            import('constants/diagnoses.json').then((diseases) => {
                setOptions({
                    main: diseases as unknown as DiagnosesOptionMapping,
                });
            });
        }
    }, [category]);

    useEffect(() => {
        if (categoryData.length > 0 && 'when' in categoryData[0]) {
            const whenOptions = Object.values(WhenResponse)
                .filter((res) => res !== WhenResponse.None)
                .reduce((options, res) => {
                    const label = res.replace('_', ' ').toLowerCase();
                    options[res] = { label, value: res };
                    return options;
                }, {} as OptionMapping);
            setOptions({
                ...options,
                when: whenOptions,
            });
        }
    }, [categoryData]);

    const onAddItem: HandleOnAddItem = (_e, { optiontype, value }) => {
        // Add to list of options
        setOptions({
            ...options,
            [optiontype]: {
                ...options[optiontype as 'main' | 'when'],
                [value]: { value, label: value },
            },
        });
    };

    // Render each entry as an expandable accordion when in mobile view, and as a
    // responsive grid otherwise.
    let content;
    if (mobile) {
        const toggleRow = (id: string) => {
            const newActiveRows = new Set(activeRows);
            if (activeRows.has(id)) {
                newActiveRows.delete(id);
            } else {
                newActiveRows.add(id);
            }
            setActiveRows(newActiveRows);
        };

        const panels = categoryData.map((row) => {
            const title = components.mobileTitle(row, options, onAddItem);
            const content = components.mobileContent(row, options, onAddItem);
            return {
                key: row.id,
                active: activeRows.has(row.id),
                title: { content: title },
                onTitleClick: () => toggleRow(row.id),
                content: { content },
            };
        });

        content = (
            <Accordion
                fluid
                styled
                exclusive={false}
                panels={panels}
                className={`plan-section-form ${category as string}`}
            />
        );
    } else {
        const body = categoryData.map((row) =>
            components.gridColumn(row, options, onAddItem)
        );
        content = (
            <Grid stackable columns={numColumns} className='section-body'>
                {components.gridHeaders({})}
                {body}
            </Grid>
        );
    }

    const checkDifferentialDiagnoses = (s: string) => {
        return s == 'differentialDiagnoses'
            ? 'Diagnosis'
            : _.startCase(s as string);
    };

    // const enableToggle = mobile && category !== 'differentialDiagnoses';
    const enableToggle = mobile;

    return (
        <Accordion fluid className='plan-section'>
            <Accordion.Title
                active={!enableToggle || expanded}
                /* eslint-disable-next-line */
                onClick={enableToggle ? () => setExpanded(!expanded) : () => {}}
            >
                <Header as='h2' attached size='large'>
                    {mobile &&
                        (expanded ? (
                            <Icon name='caret down'></Icon>
                        ) : (
                            <Icon name='caret right'></Icon>
                        ))}

                    {_.startCase(category as string)}
                </Header>
            </Accordion.Title>
            <Accordion.Content active={!enableToggle || expanded}>
                {content}
                <AddRowButton name={addRowLabel} onClick={addRow} />
            </Accordion.Content>
        </Accordion>
    );
};
