import classes from './SetSelector.module.scss';
import local from '@/pages/shared/StatDictionary';
import { useRef } from 'react';
import { bonusSetsLSKey } from '../setSaver/SetSaver';
import { BonusSet, BonusSetGroupKeys } from '@/pages/shared/BonusSetTypes';
import { BonusGroupMap, BonusGroupMapArrayLike, BonusSetProvider } from '@/pages/shared/BonusSetProvider';

interface SetSelectorProps {
    provider: BonusSetProvider;
    loadCallback?: (bonusSet: BonusSet) => void;
    updateCallback?: () => void;
}

export function getSelectorDataBySelected(selector: HTMLSelectElement): { groupName: BonusSetGroupKeys, name: string } {

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
        const groupName = groupElement.id as BonusSetGroupKeys;
        const name = selector.selectedOptions[0].value;
        return { groupName, name };
    }

    console.log("Something went wrong in 'getSelectorGroupName' function");
    return {groupName: null, name: null};
}

export function createOptionsFromList(provider: BonusSetProvider, filters?: BonusSetGroupKeys[]) {

    const options: JSX.Element[] = [];

    provider.forEach((groupName, bonusMap) => {

        if (!filters || filters.includes(groupName) || filters.length === 0) {

            const groupOptions: JSX.Element[] = [];

            bonusMap.forEach((bonusSet, name) => {
                groupOptions.push(<option key={name} value={name}>{name}</option>);
            })

            options.push(<optgroup key={groupName} id={groupName} label={local['en'][groupName]}>{groupOptions}</optgroup>);
        }
    })

    return options;
}

function parseBonusSet(stringGroupsJSON: string): BonusGroupMap;
function parseBonusSet(stringGroupsJSON: string, index: string): BonusSet;
function parseBonusSet(stringGroupsJSON: string, index?: string): BonusSet | BonusGroupMap {

    const parsedBonusGroupArray = JSON.parse(stringGroupsJSON ?? null) as BonusGroupMapArrayLike;
    const bonusSetMap = BonusSetProvider.groupMapFromArray(parsedBonusGroupArray);

    if (!bonusSetMap) {
        console.log('Error when parsing selected set!');
        return null;
    }

    if (!index) {
        return bonusSetMap as BonusGroupMap;
    }

    const selectedObj = bonusSetMap.get(index);
    if (!selectedObj) {
        console.log('Error when loading selected set!');
        return null;
    }

    return selectedObj;
}

export const SetSelector = (props: SetSelectorProps) => {

    const selectorRef = useRef<HTMLSelectElement>(null);

    const loadBonusSetHandler = () => {

        const { groupName, name } = getSelectorDataBySelected(selectorRef.current);

        if (groupName && name && props.provider.getBonusSet(name, groupName)) {

            const selectedObj = props.provider.getBonusSet(name, groupName);

            if (selectedObj && confirm('Do you want to load set? It will reset current preset.')) {
                props.loadCallback(selectedObj);
            }
        }
    };

    const deleteBonusSetHandler = () => {

        const { groupName, name } = getSelectorDataBySelected(selectorRef.current);

        if (groupName && name) {

            const stringObj = localStorage.getItem(bonusSetsLSKey + groupName);
            const groupMap = BonusSetProvider.parseMap(stringObj);

            if (groupMap.delete(name) && groupMap.size !== 0) {

                const newStringObj = BonusSetProvider.stringifyMap(groupMap);
                localStorage.setItem(bonusSetsLSKey + groupName, newStringObj);

            } else if (groupMap.size === 0) {

                localStorage.removeItem(bonusSetsLSKey + groupName);
            }

            props.updateCallback();
        }
    };

    const options: JSX.Element[] = createOptionsFromList(props.provider) ?? [];

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