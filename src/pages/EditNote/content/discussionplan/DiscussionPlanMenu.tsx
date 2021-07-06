import React, { useRef, useEffect, MouseEvent, ChangeEvent } from 'react';
import {
    Menu,
    Icon,
    Dropdown,
    Input,
    InputOnChangeData,
    MenuItemProps,
} from 'semantic-ui-react';
import DeleteCard from './DiscussionPlanDeleteCard';
import { connect } from 'react-redux';
import {
    PlanConditionsFlat,
    selectPlanConditions,
} from 'redux/selectors/planSelectors';
import { addCondition, updateConditionName } from 'redux/actions/planActions';
import { CurrentNoteState } from 'redux/reducers';
import { DISCUSSION_PLAN_MENU_BP } from 'constants/breakpoints.js';

const TAB_WIDTH = 250;

interface StateProps {
    conditions: PlanConditionsFlat[];
}

interface DispatchProps {
    addCondition: () => void;
    updateConditionName: (conditionIndex: string, newName: string) => void;
}

interface OwnProps {
    index: number;
    windowWidth: number;
    setCurrentIndex: (val: number) => void;
    setCurrentId: (val: string) => void;
}

type DiscussionPlanMenuProps = StateProps & DispatchProps & OwnProps;

/**
 * Hook for keeping track of previous values before rerender
 */
const usePrevious = <T,>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

/**
 * Component for navigating between conditions for discussion and plan
 */
export const DiscussionPlanMenu = (props: DiscussionPlanMenuProps) => {
    const {
        windowWidth,
        index,
        conditions,
        setCurrentIndex,
        setCurrentId,
        addCondition,
        updateConditionName,
    } = props;

    const prevNumConditions = usePrevious<number>(conditions.length) || 0;

    const collapsed =
        windowWidth < DISCUSSION_PLAN_MENU_BP ||
        conditions.length * TAB_WIDTH > DISCUSSION_PLAN_MENU_BP;

    // Switch to the new tab if one was just added
    useEffect(() => {
        if (prevNumConditions < conditions.length) {
            const newest = conditions.length - 1;
            setCurrentId(conditions[newest].id);
            setCurrentIndex(newest);
        }
    }, [prevNumConditions, conditions.length]);

    // Select first tab on initial load
    useEffect(() => {
        if (conditions.length > 0) {
            setCurrentIndex(0);
            setCurrentId(conditions[0].id);
        }
    }, []);

    // Delete currently viewed tab and switch to the tab on the left, if there
    // exists one, otherwise switch to the right. If there are no more conditions,
    // empty the id.
    const deleteCurrent = (index: number) => {
        if (index === 0) {
            setCurrentId(conditions.length - 1 > 0 ? conditions[1].id : '');
            return;
        }
        setCurrentIndex(index - 1);
        setCurrentId(conditions[index - 1].id);
    };

    const selectTab = (
        _e: MouseEvent<HTMLAnchorElement>,
        { idx, uuid }: MenuItemProps
    ) => {
        setCurrentIndex(idx);
        setCurrentId(uuid);
    };

    const setName = (
        _e: ChangeEvent<HTMLInputElement>,
        { uuid, value }: InputOnChangeData
    ) => {
        updateConditionName(uuid, value);
    };

    const addButton = (
        <Menu.Item key='add-btn' id='add-condition' onClick={addCondition}>
            <Icon name='plus' />
        </Menu.Item>
    );

    // Show delete button only when there exist conditions to delete
    let deleteComponent;
    if (conditions.length > 0) {
        deleteComponent = (
            <Menu.Menu className='delete-btn-wrapper' position='right'>
                <DeleteCard
                    uuid={conditions[index].id}
                    name={conditions[index].name}
                    index={index}
                    deleteCurrent={deleteCurrent}
                />
            </Menu.Menu>
        );
    }

    // When screen is too small, show just the active condition as a tab
    // and hide the rest in a dropdown
    if (collapsed) {
        const dropdownItems = conditions.map((condition, i) => (
            <Menu.Item
                key={i}
                name={condition.name}
                text={condition.name}
                value={condition.name}
                active={index === i}
                idx={i}
                uuid={condition.id}
                onClick={selectTab}
            />
        ));
        dropdownItems.push(addButton);
        let currentTab;
        if (index < conditions.length) {
            currentTab = (
                <Menu.Item active>
                    <Input
                        transparent
                        type='text'
                        placeholder='Condition Name'
                        uuid={conditions[index].id}
                        value={conditions[index].name}
                        onChange={setName}
                    />
                </Menu.Item>
            );
        }

        return (
            <Menu tabular>
                {currentTab}
                <Menu.Item>
                    <Dropdown
                        value=''
                        icon='ellipsis horizontal'
                        options={dropdownItems}
                    />
                </Menu.Item>
                {deleteComponent}
            </Menu>
        );
    }

    // Otherwise render each condition as its own tab
    const menuItems = conditions.map((condition, i) => (
        <Menu.Item
            key={i}
            active={i === index}
            idx={i}
            uuid={condition.id}
            onClick={selectTab}
        >
            <Input
                transparent
                type='text'
                placeholder='Condition Name'
                value={condition.name}
                uuid={condition.id}
                idx={i}
                onChange={setName}
            />
        </Menu.Item>
    ));
    menuItems.push(addButton);
    return (
        <Menu stackable tabular>
            {menuItems}
            {deleteComponent}
        </Menu>
    );
};

export default connect(
    (state: CurrentNoteState) => ({ conditions: selectPlanConditions(state) }),
    { addCondition, updateConditionName }
)(DiscussionPlanMenu);
