import classes from './SetSelector.module.scss';
import local from '@/pages/shared/StatDictionary';
import { useRef } from 'react';
import { bonusSetsLSKey } from '../setSaver/SetSaver';
import { BonusItem, BonusSet, BonusSetGroupKeys, bonusSetGroupKeysValues, isBonusSetGroupKey } from '@/pages/shared/BonusSetTypes';
import { GroupedMap } from '@/pages/shared/GroupedMap';
import { getStorageBonusSets, isArrayLikeBonusGroup } from '../BonusSetManager';
import { loadJSONFile, readJSONFileAsText, saveToJSONFile } from '@/pages/hsrCalc/services/store/SetupsStorage';
import { isBonusSet } from '@/pages/shared/BonusSet';

interface SetSelectorProps {
    provider: GroupedMap<BonusSetGroupKeys, BonusSet>;
    loadCallback?: (bonusItems: BonusItem[]) => void;
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
    return { groupName: null, name: null };
}

export function createOptionsFromList(provider: GroupedMap<BonusSetGroupKeys, BonusSet>, filters?: BonusSetGroupKeys[]) {

    const options: JSX.Element[] = [];

    provider.data.forEach((bonusMap, groupName) => {

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

function getNameForBonusCopy(map: GroupedMap<BonusSetGroupKeys, BonusSet>, oldName: string, group: BonusSetGroupKeys) {

    let newName = oldName;
    let reserveIndex = 0;

    while (map.getElement(newName, group)) {

        if (reserveIndex > 999) {
            throw new Error('Something went wrong with indexing new setup');
        }

        reserveIndex++;
        newName = oldName.concat('(', reserveIndex.toString(), ')');
    }

    return newName;
}

export const SetSelector = (props: SetSelectorProps) => {

    const selectorRef = useRef<HTMLSelectElement>(null);

    const loadBonusSetHandler = () => {

        const { groupName, name } = getSelectorDataBySelected(selectorRef.current);

        if (groupName && name && props.provider.getElement(name, groupName)) {

            const selectedObj = props.provider.getElement(name, groupName);

            if (selectedObj && confirm('Do you want to load set? It will reset current preset.')) {
                props.loadCallback(selectedObj.items);
            }
        }
    };

    const deleteBonusSetHandler = () => {

        const { groupName, name } = getSelectorDataBySelected(selectorRef.current);

        if (groupName && name) {

            const stringObj = localStorage.getItem(bonusSetsLSKey + groupName);
            const arrayLikeGroupMap = JSON.parse(stringObj);
            if (!isArrayLikeBonusGroup(arrayLikeGroupMap)) return;
            const groupMap = new Map<string, BonusSet>(arrayLikeGroupMap);

            if (groupMap.delete(name) && groupMap.size !== 0) {

                const newStringObj = JSON.stringify(Array.from(groupMap));
                localStorage.setItem(bonusSetsLSKey + groupName, newStringObj);

            } else if (groupMap.size === 0) {

                localStorage.removeItem(bonusSetsLSKey + groupName);
            }

            props.updateCallback();
        }
    };

    const importSetsHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {

        let files: FileList = undefined;

        try {
            files = await loadJSONFile(false, 600);
        } catch (e) {
            console.log(e);
            return;
        }

        if (!files || !files[0]) { return; }

        let storedBonusSets = getStorageBonusSets();

        let importedBonuses: string;

        try {
            importedBonuses = await readJSONFileAsText(files[0]);
        } catch (e) {
            console.log(e);
            return;
        }

        if (!importedBonuses || importedBonuses.length === 0) {
            alert('There is nothing to import');
            return;
        }

        let parsedBonuses: GroupedMap<BonusSetGroupKeys, BonusSet>;

        try {
            const parsed = GroupedMap.parse(importedBonuses);
            parsedBonuses = GroupedMap.isTypes(parsed, isBonusSetGroupKey, isBonusSet) ? parsed : undefined;
        } catch (e) {
            console.log('Wrong type of file!');
            return;
        }

        if (confirm('Do you want to SAVE all your previous setups?\n"OK" to ADD new setups, "Cancel" to CLEAR and ADD')) {

            const doRewriteItems = confirm('Do you want to override setups on name conflict?\n"Cancel" to add with new names');

            parsedBonuses.data.forEach((groupMap, groupKey) => {
                groupMap.forEach((set, key) => {

                    let newKey = key;

                    if (!doRewriteItems) {
                        newKey = getNameForBonusCopy(storedBonusSets, key, groupKey);
                    }

                    storedBonusSets.setObject(set, groupKey, newKey);
                })
            })

        } else {

            storedBonusSets = new GroupedMap<BonusSetGroupKeys, BonusSet>(parsedBonuses);         
        }

        storedBonusSets.data.forEach((groupMap, groupKey) => {
            const arrayLikeGroupMap = Array.from(groupMap);
            const lsNewItem = JSON.stringify(arrayLikeGroupMap);
            localStorage.setItem(bonusSetsLSKey + groupKey, lsNewItem);
        });

        props.updateCallback();
    };

    const exportSetsHandler = () => {

        const storedBonusSets = getStorageBonusSets();

        if (storedBonusSets.data.size === 0) {
            return;
        }
        const arrayLikeStoredBonusSets = GroupedMap.toArray(storedBonusSets);
        const setupsString = JSON.stringify(arrayLikeStoredBonusSets);
        let file = new File([setupsString], 'bonuses.json', { type: "text/plain:charset=UTF-8" });

        saveToJSONFile(file);
    };

    const clearSetsHandler = (): void => {
        if (confirm('Do you want to DELETE ALL your bonuses?')) {
            bonusSetGroupKeysValues.forEach((key) => {
                localStorage.removeItem(bonusSetsLSKey + key);
            })
        }
        props.updateCallback();
    };

    const options: JSX.Element[] = createOptionsFromList(props.provider) ?? [];

    return (
        <div className={classes.setsListModule}>
            <p className={classes.header}>Your sets:</p>
            <div className={classes.buttonSection}>

                <div className={classes.buttonSet}>
                    <button onClick={importSetsHandler}>Import</button>
                    <button onClick={exportSetsHandler}>Export</button>
                    <button onClick={clearSetsHandler}>Clear</button>
                </div>

                <div className={classes.buttonSet}>
                    <button onClick={loadBonusSetHandler}>Load</button>
                    <button onClick={deleteBonusSetHandler}>Delete</button>
                </div>

            </div>
            <select ref={selectorRef} className={classes.setsList} name="fruit" size={10}>
                {options}
            </select>
        </div>
    );
};