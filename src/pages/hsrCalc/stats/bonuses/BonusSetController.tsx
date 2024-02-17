import { FilterStack } from '../shared/FilterStack';
import classes from './BonusSetController.module.scss';
import { BonusSetElement } from './BonusSetElement';
import { useEffect, useRef, useState } from 'react';
import { getStorageBonusSets } from '@/pages/bonusSetManager/BonusSetManager';
import { createOptionsFromList, getSelectorDataBySelected } from '@/pages/bonusSetManager/setSelector/SetSelector';
import { BonusSetGroupKeys, ContextBonusSet } from '@/pages/shared/BonusSetTypes';
import { BonusSetLib } from '../../HSRCalc';
import { setBonusSetContext } from '@/pages/shared/BonusSet';
import { GroupedMap } from '@/pages/shared/GroupedMap';

interface BonusSetControllerProps {
    provider: BonusSetLib;
    updateCallback: (provider: BonusSetLib) => void;
}

export const BonusSetController = (props: BonusSetControllerProps) => {


    const [filters, setFilters] = useState<BonusSetGroupKeys[]>([]);
    const selectorRef = useRef<HTMLSelectElement>(null);
    const bonusSetList = getStorageBonusSets();

    const listRef = useRef<HTMLDivElement>(null);

    const updateFiltersHandler = (filters: BonusSetGroupKeys[]) => {
        setFilters(filters);
    }

    const loadHandler = () => {
        const selector = selectorRef.current;

        if (selector) {
            const { groupName, name } = getSelectorDataBySelected(selector);

            if (groupName && name && bonusSetList.getElement(name, groupName)) {

                const bonusSet = bonusSetList.getElement(name, groupName);
                const contextBonusSet = setBonusSetContext(bonusSet, true, [0, 0, 0]); // TODO: WRITE DEFAULT

                if (contextBonusSet) { // maybe check should i update state. or check here is it the same
                    props.updateCallback(props.provider.getWith(contextBonusSet, name, groupName));
                }
            }
        }
    };

    const setActiveHandler = (name: string, groupName: BonusSetGroupKeys) => {
        //if no parameters = isActive of set;
        return (ids?: number | number[]) => {

            function switchActive(id: number) {
                const item = element.items.find(e => e.id === id);

                if (item) {
                    item.isActive = !item.isActive;
                }
            }

            let element = { ...props.provider.getElement(name, groupName) };

            if (ids === undefined) {
                element.isActive = !element.isActive;
            } else if (Array.isArray(ids)) {
                ids.forEach(e => switchActive(e));

            } else {
                switchActive(ids);
            }

            props.updateCallback(props.provider.getWith(element, name, groupName))
        }
    }

    const deleteHandler = (name: string, groupName: BonusSetGroupKeys) => {

        return () => {

            if (groupName.length === 0 || name.length === 0) return;

            if (props.provider.hasElement(name, groupName)) {
                props.updateCallback(props.provider.getWithout(name, groupName));
            }
        }
    };

    const clearHandler = () => {
        if (props.provider.data.size !== 0 && confirm('Do you want to clear the list?')) {
            props.updateCallback(new GroupedMap<BonusSetGroupKeys, ContextBonusSet>());
        }
    };

    const bonusSetElementsList: JSX.Element[] = createOptionsFromList(bonusSetList, filters) ?? [];

    let currentBonusSets: JSX.Element[] = [];

    props.provider.data.forEach((groupMap, groupKey) => {

        if (!filters || filters.includes(groupKey) || filters.length === 0) {

            groupMap.forEach((set, name) => {

                currentBonusSets.push((
                    <BonusSetElement key={name} set={set} setActiveCallback={setActiveHandler(name, groupKey)} deleteCallback={deleteHandler(name, groupKey)} />
                ));

            })
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

            <FilterStack contents={['weapon', 'teammate', 'relics', 'planars']} updateCallback={updateFiltersHandler} />

            <div ref={listRef} className={classes.bonusSetsSection}>
                {currentBonusSets}
            </div>
        </div>
    );
};