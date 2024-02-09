import { FilterStack } from '../shared/FilterStack';
import classes from './BonusSetController.module.scss';
import { BonusSetElement } from './BonusSetElement';
import { useRef, useState } from 'react';
import { getStorageBonusSets } from '@/pages/bonusSetManager/BonusSetManager';
import { createOptionsFromList, getSelectorDataBySelected } from '@/pages/bonusSetManager/setSelector/SetSelector';
import { BonusSetGroupKeys } from '@/pages/shared/BonusSetTypes';
import { BonusSetProvider } from '@/pages/shared/BonusSetProvider';

interface BonusSetControllerProps {
    provider: BonusSetProvider;
    updateCallback: (provider: BonusSetProvider) => void;
}

export const BonusSetController = (props: BonusSetControllerProps) => {


    const [filters, setFilters] = useState<BonusSetGroupKeys[]>([]);
    const selectorRef = useRef<HTMLSelectElement>(null);
    const bonusSetList = getStorageBonusSets();

    const updateFiltersHandler = (filters: BonusSetGroupKeys[]) => {
        setFilters(filters);
    }

    const loadHandler = () => {
        const selector = selectorRef.current;

        if (selector) {
            const { groupName, name: name } = getSelectorDataBySelected(selector);

            if (groupName && name && bonusSetList.getBonusSet(name, groupName)) {

                const selectedObj = bonusSetList.getBonusSet(name, groupName);

                if (selectedObj && !props.provider.getBonusSet(name, groupName)) {

                    props.updateCallback(props.provider.getWith(name, groupName, selectedObj));
                }
            }
        }
    };

    const deleteHandler = (groupName: BonusSetGroupKeys, name: string) => {

        if (groupName.length === 0 || name.length === 0) return;

        if (props.provider.hasBonusSet(groupName, name)) {
            props.updateCallback(props.provider.getWithout(name, groupName));
        }
    };

    const clearHandler = () => {
        if (props.provider.size !== 0) {
            props.updateCallback(new BonusSetProvider()); // maybe clear func
        }
    };

    const bonusSetElementsList: JSX.Element[] = createOptionsFromList(bonusSetList, filters) ?? [];

    let currentBonusSets: JSX.Element[] = [];

    props.provider.forEachBonusSets((groupName, name, bonusSet) => {

        if (!filters || filters.includes(groupName) || filters.length === 0) {

            currentBonusSets.push((
                <BonusSetElement key={name} title={name} group={groupName} set={bonusSet} deleteCallback={deleteHandler} />
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

            <FilterStack contents={['weapon', 'teammate', 'relics', 'planars']} updateCallback={updateFiltersHandler} />

            <div className={classes.bonusSetsSection}>
                {currentBonusSets}
            </div>
        </div>
    );
};