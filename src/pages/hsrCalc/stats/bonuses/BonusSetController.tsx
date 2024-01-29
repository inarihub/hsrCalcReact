import { BonusSet } from '@/pages/bonusSetManager/BonusSet';
import { FilterStack } from '../shared/FilterStack';
import classes from './BonusSetController.module.scss';
import { BonusSetElement } from './BonusSetElement';
import { useRef, useState } from 'react';
import { getBonusSetObjects } from '@/pages/bonusSetManager/BonusSetManager';
import { createOptionsFromList, getSelectorDataBySelected } from '@/pages/bonusSetManager/setSelector/SetSelector';
import { BonusSetTypes } from '@/pages/bonusSetManager/setSaver/SetSaver';
import local from '@/pages/shared/StatDictionary';
import { BonusPath, BonusPathWithIDs } from '../../HSRCalc';

interface BonusSetControllerProps {
    bonusSets: Map<string, BonusSet>;
    updateCallback: (sets: Map<string, BonusSet>) => void;
    hideBonusCallback: (pathObj: BonusPath, isActive: boolean) => void;
}

function parseBonusSetKey(value: string): {groupName: BonusSetTypes, name: string} {
    if (!value || value === '') throw new Error('Parse had been failed');
    const strValues = value.split('/_/');
    if (strValues.length !== 2) throw new Error('Parse had been failed');
    //check groupName for type;
    return {groupName: strValues[0] as BonusSetTypes, name: strValues[1]};
}

function createBonusSetKey(groupName: BonusSetTypes, name: string): string {
    return `${groupName}/_/${name}`;
}

export const BonusSetController = (props: BonusSetControllerProps) => {


    const [filters, setFilters] = useState<BonusSetTypes[]>([]);
    const selectorRef = useRef<HTMLSelectElement>(null);
    const bonusSetList = getBonusSetObjects(); //fix

    const updateHandler = (filters: BonusSetTypes[]) => {
        setFilters(filters);
    }

    const loadHandler = () => {
        const selector = selectorRef.current;

        if (selector) {
            const { groupName, value } = getSelectorDataBySelected(selector);
            const key = createBonusSetKey(groupName, value);

            if (groupName && value && bonusSetList.get(groupName)) {

                const selectedObj = bonusSetList.get(groupName)[value];

                if (selectedObj && !props.bonusSets.get(key)) {
                    const newSets = new Map(props.bonusSets); // can i do this in other places? create new instance in callback, not in setState after
                    newSets.set(key, selectedObj);
                    props.updateCallback(newSets); // in: BonusSets, out BonusSets. instead of useEffect
                }
            }
        }
    };

    const deleteHandler = (groupName: BonusSetTypes, value: string) => {
        if (groupName.length === 0 || value.length === 0) return;

        const newSets = new Map(props.bonusSets);

        if (newSets.delete(createBonusSetKey(groupName, value))) {
            props.updateCallback(newSets);
        }
    };

    const clearHandler = () => {
        if (props.bonusSets.size !== 0) {
            props.updateCallback(new Map());
        }
    };

    const bonusSetElementsList: JSX.Element[] = createOptionsFromList(bonusSetList, filters) ?? [];

    let currentBonusSets: JSX.Element[] = [];
    props.bonusSets.forEach((bonusSet, key) => {
        const {groupName, name} = parseBonusSetKey(key);
        if (!filters || filters.includes(groupName) || filters.length === 0) {

            currentBonusSets.push((
                <BonusSetElement key={key} title={name} group={groupName} set={bonusSet} deleteCallback={deleteHandler}
                hideBonusCallback={props.hideBonusCallback} />
            ));

        }
    })

    return (
        <div className={classes.bonusControllerContainer}>

            <div className={classes.headerSection}>
                <p className={classes.header}>Bonuses:</p>
            </div>

            <div className={classes.controlsPanel}>
                <select ref={selectorRef} className={classes.bonusSetList} disabled={bonusSetElementsList.length === 0}>
                    <option key={'option-none'} hidden value={'none'}>{bonusSetElementsList.length === 0 ? '-Create bonus set-' : '-Select bonus sets-'}</option>
                    {bonusSetElementsList}
                </select>

                <div className={classes.controlButtonSection}>
                    <button onClick={loadHandler}>Load</button>
                    <button onClick={clearHandler}>Clear</button>
                </div>
            </div>

            <FilterStack contents={['weapon', 'teammate', 'relics', 'planars']} updateCallback={updateHandler} />

            <div className={classes.bonusSetsSection}>
                {currentBonusSets}
            </div>
        </div>
    );
};