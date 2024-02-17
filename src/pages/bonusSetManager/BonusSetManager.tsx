import { useState } from 'react';
import classes from './BonusSetManager.module.scss';
import { SetSaver, bonusSetsLSKey } from './setSaver/SetSaver';
import { SetSelector } from './setSelector/SetSelector';
import { SetEditor } from './setEditor/SetEditor';
import { getBonusItems, isBonusSet } from '../shared/BonusSet';
import { AttackTypesWithAny, ElementDmgTypesWithAll } from '../shared/Stat.types';
import { BonusItem, BonusSet, BonusSetGroupKeys, BonusSetKey, bonusSetGroupKeysValues } from '../shared/BonusSetTypes';
import { GroupedMap } from '../shared/GroupedMap';
import { versionControlValidation } from '../shared/VersionControl';

versionControlValidation();

export const getDefaultSetItem = (id: number = 0): BonusItem => ({ id, key: 'dmgIncrease', value: 1, atkTypeOption: 'any', elemTypeOption: 'all' });

export function isArrayLikeBonusGroup(array: [string, BonusSet][] | unknown): array is [string, BonusSet][] {
    return (Array.isArray(array) && (array.every(e => typeof e[0] === 'string' && isBonusSet(e[1])) || array.length === 0));
}

export function getStorageBonusSets(): GroupedMap<BonusSetGroupKeys, BonusSet> {

    let result = new GroupedMap<BonusSetGroupKeys, BonusSet>();

    for (const group of bonusSetGroupKeysValues) {

        const strItem = localStorage.getItem(bonusSetsLSKey + group);

        if (strItem) {

            const groupMapArrayLike = JSON.parse(localStorage.getItem(bonusSetsLSKey + group));

            if (isArrayLikeBonusGroup(groupMapArrayLike)) {
                const groupMap = new Map(groupMapArrayLike);
                result.setGroupMap(group, groupMap);
            }
        }
    }

    return result;
}

const BonusSetManager = () => {

    const [provider, setProvider] = useState<GroupedMap<BonusSetGroupKeys, BonusSet>>(getStorageBonusSets());
    const [bonusItems, setBonusItems] = useState<BonusItem[]>([getDefaultSetItem()]);

    const addBonusHandler = (id: number, key?: BonusSetKey, value?: number, atkTypeOption?: AttackTypesWithAny | 'none', elemTypeOption?: ElementDmgTypesWithAll | 'none') => {

        if (!key && Number.isNaN(Number(value)) && !atkTypeOption && !elemTypeOption) return;

        setBonusItems((prev) => {
            return getBonusItems(prev, id, key, value, atkTypeOption, elemTypeOption);;
        })
    };

    const deleteBonusHandler = (id: number) => {

        if (Number.isNaN(Number(id))) return;

        setBonusItems((prev) => {

            const index = prev.findIndex(element => element.id === id);

            if (index === -1) {
                console.log("There's no bonus to delete");
                return prev;
            };

            let newArr = [...prev];
            newArr.splice(index, 1);

            let i = 0;
            console.log(newArr);
            newArr = newArr.map((element) => { return { ...element, id: i++ } });
            console.log(newArr);

            return newArr;
        })
    };

    const loadSetHandler = (bonusItems: BonusItem[]) => {
        setBonusItems(bonusItems);
    };

    const updateSetsHandler = () => {
        setProvider(() => getStorageBonusSets());
    };

    return (
        <div className={classes.bonusSetManagerMain}>

            <div className={classes.row}>

                <div className={classes.column}>
                    <SetSaver set={bonusItems} updateCallback={updateSetsHandler} />
                    <SetSelector provider={provider} loadCallback={loadSetHandler} updateCallback={updateSetsHandler} />
                </div>

                <div className={classes.column}>
                    <SetEditor set={bonusItems} addBonusCallback={addBonusHandler} deleteBonusCallback={deleteBonusHandler} />
                </div>

            </div>

        </div>
    );
};

export default BonusSetManager;