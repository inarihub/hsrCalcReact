import { useRef } from 'react';
import classes from './SetSaver.module.scss';
import { BonusItem, BonusSet, BonusSetGroupKeys, bonusSetGroupKeysValues, isBonusSetGroupKey } from '@/pages/shared/BonusSetTypes';
import { isBonusSet } from '@/pages/shared/BonusSet';
import { isArrayLikeBonusGroup } from '../BonusSetManager';
import { GroupedMap } from '@/pages/shared/GroupedMap';

export const bonusSetsLSKey = 'bonusset-';

interface SetSaverProps {
    set: BonusItem[];
    updateCallback?: () => void;
};

function isBonusSetArray(arr: [string, BonusSet][] | unknown): arr is [string, BonusSet][] {
    return (Array.isArray(arr) && arr.every(e => typeof e[0] === 'string' && isBonusSet(e[1])))
}

export const SetSaver = (props: SetSaverProps) => {

    const typeSelector = useRef<HTMLSelectElement>(null);
    const inputElement = useRef<HTMLInputElement>(null);

    let typeSelectorOptions: JSX.Element[] = [];

    for (const name of bonusSetGroupKeysValues) {
        typeSelectorOptions.push(<option key={name} value={name}>{name}</option>)
    }

    const saveHandler = (e: React.MouseEvent) => {

        if (!typeSelector.current || typeSelector.current.value === 'none') {
            console.log('Please select the type of set!');
        }
        if (!inputElement.current || inputElement.current.value === '') {
            console.log('Please input the name of set!');
        }
        if (!props.set || props.set.length === 0) {
            console.log('Current set is invalid');
        }

        const groupName = typeSelector.current.value as BonusSetGroupKeys;
        const allSetsOfTypeStringObj = localStorage.getItem(bonusSetsLSKey + groupName);
        let bonusGroupMap: Map<string, BonusSet>;

        if (allSetsOfTypeStringObj) {

            const allSetsOfTypeArray = JSON.parse(allSetsOfTypeStringObj);

            if (isArrayLikeBonusGroup(allSetsOfTypeArray)) {
                bonusGroupMap = new Map(allSetsOfTypeArray);
            }

        } else {
            bonusGroupMap = new Map();
        }

        const userKey = inputElement.current.value.trim();

        if (bonusGroupMap.has(userKey) && !confirm('Current set already exists. Do you want to override it?')) {
            return;
        }

        const bonusSet: BonusSet = { name: userKey, type: groupName, items: props.set };

        bonusGroupMap.set(userKey, bonusSet);
        const arrayLikeGroupMap = Array.from(bonusGroupMap);
        const stringifiedBonusSets = JSON.stringify(arrayLikeGroupMap);
        localStorage.setItem(bonusSetsLSKey + groupName, stringifiedBonusSets);

        props.updateCallback();

    };

    return (<div className={classes.saveModule}>
        <p className={classes.header}>Save set:</p>
        <div className={classes.saveControls}>

            <select ref={typeSelector} defaultValue={'none'}>
                <option hidden disabled value={'none'}>-select type-</option>
                {typeSelectorOptions}
            </select>

            <input ref={inputElement} maxLength={20} type='text' placeholder='Type the name of set'></input>

            <button onClick={saveHandler}>Save</button>

        </div>
    </div>);
};