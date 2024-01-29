import { useRef } from 'react';
import { BonusSet } from '../BonusSet';
import { BonusSetTypes, TypedSetsObject, bonusSetsLSKey } from '../setSaver/SetSaver';
import classes from './SetSelector.module.scss';
import local from '@/pages/shared/StatDictionary';

interface SetSelectorProps {
    list: Map<BonusSetTypes, TypedSetsObject>;
    loadCallback?: (bonusSet: BonusSet) => void;
    updateCallback?: () => void;
}

export function getSelectorDataBySelected(selector: HTMLSelectElement): { groupName: BonusSetTypes, value: string } {
    if (!selector) {
        console.log('Parameter is invalid in getSelectorGroupName');
        return null;
    }

    if (selector.multiple) {
        console.log("getSelectorGroupName is working only with non-multiple select element");
        return null;
    }

    if (selector.selectedOptions[0]?.parentElement instanceof HTMLOptGroupElement) {
        const groupElement = selector.selectedOptions[0].parentElement as HTMLOptGroupElement;
        const value = selector.selectedOptions[0].value;
        return { groupName: groupElement.id as BonusSetTypes, value };
    }

    console.log("Something went wrong in 'getSelectorGroupName' function");
    return {groupName: null, value: null};
}

export function createOptionsFromList(list: Map<BonusSetTypes, TypedSetsObject>, filters?: BonusSetTypes[]) {

    const options: JSX.Element[] = [];

    for (const [key, values] of list) {

        if (!filters || filters.includes(key) || filters.length === 0) {

            const groupOptions: JSX.Element[] = [];

            for (const value of Object.keys(values)) {
                groupOptions.push(<option key={value} value={value}>{value}</option>)
            }

            options.push(<optgroup key={key} id={key} label={local['en'][key]}>{groupOptions}</optgroup>);
        }
    }

    return options;
}

function parseBonusSet(stringGroupsJSON: string): TypedSetsObject;
function parseBonusSet(stringGroupsJSON: string, index: string): BonusSet;
function parseBonusSet(stringGroupsJSON: string, index?: string): BonusSet | TypedSetsObject {

    const parsedBonusSetGroups = JSON.parse(stringGroupsJSON ?? null) as TypedSetsObject;

    if (!parsedBonusSetGroups) {
        console.log('Error when parsing selected set!');
        return null;
    }

    if (!index) {
        return parsedBonusSetGroups as TypedSetsObject;
    }

    const selectedObj = parsedBonusSetGroups[index] as BonusSet;
    if (!selectedObj) {
        console.log('Error when loading selected set!');
        return null;
    }

    return selectedObj;
}

export const SetSelector = (props: SetSelectorProps) => {

    const selectorRef = useRef<HTMLSelectElement>(null);

    const loadBonusSetHandler = () => {

        const list = props.list;
        const { groupName, value } = getSelectorDataBySelected(selectorRef.current);

        if (groupName && value && list.get(groupName)) {

            const selectedObj = props.list.get(groupName)[value];

            if (selectedObj && confirm('Do you want to load set? It will reset current preset.')) {
                props.loadCallback(selectedObj);
            }
        }
    };

    const deleteBonusSetHandler = () => {

        const list = props.list;
        const { groupName, value } = getSelectorDataBySelected(selectorRef.current);

        if (groupName && value && list.get(groupName)) {

            const stringObj = localStorage.getItem(bonusSetsLSKey + groupName);
            const typedSets = parseBonusSet(stringObj);

            delete typedSets[value];
            const newStringObj = JSON.stringify(typedSets);

            if (Object.keys(typedSets).length === 0) {
                localStorage.removeItem(bonusSetsLSKey + groupName);
            } else {
                localStorage.setItem(bonusSetsLSKey + groupName, newStringObj);
            }

            props.updateCallback();
        }
    };

    const options: JSX.Element[] = createOptionsFromList(props.list) ?? [];

    return (
        <div className={classes.setsListModule}>
            <p className={classes.header}>Your sets:</p>
            <div className={classes.buttonSection}>
                <button onClick={loadBonusSetHandler}>Load</button>
                <button onClick={deleteBonusSetHandler}>Delete</button>
            </div>
            <select ref={selectorRef} className={classes.setsList} name="fruit" size={10}>
                {options}
            </select>
        </div>
    );
};