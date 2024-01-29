import { useRef } from 'react';
import classes from './SetSaver.module.scss';
import { BonusSet } from '../BonusSet';

export const bonusSetsLSKey = 'bonusset-';

export const bonusSetTypeValues = ['weapon', 'teammate', 'relics', 'planars'] as const;
export type BonusSetTypes = typeof bonusSetTypeValues[number];

interface SetSaverProps {
    set: BonusSet;
    updateCallback?: () => void;
};

interface SetTypeObject {
    [type: string]: TypedSetsObject;
};

export interface TypedSetsObject {
    [key: string]: BonusSet;
};

export const SetSaver = (props: SetSaverProps) => {

    const typeSelector = useRef<HTMLSelectElement>(null);
    const inputElement = useRef<HTMLInputElement>(null);

    let typeSelectorOptions: JSX.Element[] = [];

    for (const name of bonusSetTypeValues) {
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

        const allSetsOfType = localStorage.getItem(bonusSetsLSKey + typeSelector.current.value);

        const itemObj: TypedSetsObject = allSetsOfType ? JSON.parse(allSetsOfType) : {};
        const userKey = inputElement.current.value.trim();
        const selectedType = typeSelector.current.value;

        if ((itemObj[userKey] && itemObj[userKey].length !== 0) && !confirm('Current set already exists. Do you want to override it?')) {
            return;
        } else {
            delete itemObj[userKey];
        }

        itemObj[userKey] = props.set;

        const stringifiedBonusSets = JSON.stringify(itemObj);
        localStorage.setItem(bonusSetsLSKey + selectedType, stringifiedBonusSets);

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