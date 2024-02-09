import { useState } from 'react';
import classes from './BonusSetManager.module.scss';
import { SetSaver, bonusSetsLSKey } from './setSaver/SetSaver';
import { SetSelector } from './setSelector/SetSelector';
import { SetEditor } from './setEditor/SetEditor';
import { getBonusSet } from '../shared/BonusSet';
import { AttackTypesWithAny, ElementDmgTypesWithAll } from '../shared/Stat.types';
import { BonusSet, BonusSetKey, bonusSetGroupKeysValues } from '../shared/BonusSetTypes';
import { BonusSetProvider } from '../shared/BonusSetProvider';

export interface BonusItem {
    id: number;
    key: BonusSetKey;
    value: number;
    atkTypeOption: AttackTypesWithAny | 'none';
    elemTypeOption: ElementDmgTypesWithAll | 'none';
};

export const defaultSetItem: BonusItem = {id: 0, key: 'dmgIncrease', value: 1, atkTypeOption: 'any', elemTypeOption: 'all' };

export function getStorageBonusSets(): BonusSetProvider {

    let result = new BonusSetProvider();

    for (const group of bonusSetGroupKeysValues) {

        const groupMap = BonusSetProvider.parseMap(localStorage.getItem(bonusSetsLSKey + group));

        if (groupMap) {
            result.addBonusSetGroup(group, groupMap);
        }  
    }

    return result;
}

const initialProvider = getStorageBonusSets();

const BonusSetManager = () => {

    const [provider, setProvider] = useState<BonusSetProvider>(initialProvider); 
    const [bonusSet, setBonusSet] = useState<BonusSet>([defaultSetItem]);
    
    const addBonusHandler = (id: number, key?: BonusSetKey, value?: number, atkTypeOption?: AttackTypesWithAny | 'none', elemTypeOption?: ElementDmgTypesWithAll | 'none') => {

        if (!key && Number.isNaN(Number(value)) && !atkTypeOption && !elemTypeOption) return;

        setBonusSet((prev) => {
            return getBonusSet(prev, id, key, value, atkTypeOption, elemTypeOption);;
        })
    };

    const deleteBonusHandler = (id: number) => {
        if (Number.isNaN(Number(id))) return;

        setBonusSet((prev) => {
            
            const index = prev.findIndex(element => element.id === id);
            
            if (index === -1) {
                alert("There's no bonus to delete");
                return prev;
            };

            let newArr = [...prev];
            newArr.splice(index, 1);

            let i = 0;
            console.log(newArr);
            newArr = newArr.map((element) => { return {...element, id: i++}});
            console.log(newArr);

            return newArr;
        })
    };

    const loadSetHandler = (bonusSet: BonusSet) => {
        setBonusSet(bonusSet);
    };

    const updateSetsHandler = () => {
        setProvider(() => getStorageBonusSets());
    };

    return (
        <div className={classes.bonusSetManagerMain}>

            <div className={classes.row}>

                <div className={classes.column}>
                    <SetSaver set={bonusSet} updateCallback={updateSetsHandler}/>
                    <SetSelector provider={provider} loadCallback={loadSetHandler} updateCallback={updateSetsHandler}/>
                </div>

                <div className={classes.column}>
                    <SetEditor set={bonusSet} addBonusCallback={addBonusHandler} deleteBonusCallback={deleteBonusHandler}/>
                </div>

            </div>

        </div>
    );
};

export default BonusSetManager;