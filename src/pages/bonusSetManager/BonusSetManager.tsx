import { useState } from 'react';
import classes from './BonusSetManager.module.scss';
import { BonusSetTypes, SetSaver, TypedSetsObject, bonusSetTypeValues, bonusSetsLSKey } from './setSaver/SetSaver';
import { SetSelector } from './setSelector/SetSelector';
import { SetEditor } from './setEditor/SetEditor';
import { BonusSet, BonusSetKey, getBonusSet } from './BonusSet';
import { AttackTypesWithAny, ElementDmgTypesWithAll } from '../shared/Stat.types';

export interface BonusItem {
    id: number;
    key: BonusSetKey;
    value: number;
    atkTypeOption: AttackTypesWithAny | 'none';
    elemTypeOption: ElementDmgTypesWithAll | 'none';
};

export const defaultSetItem: BonusItem = {id: 0, key: 'dmgIncrease', value: 1, atkTypeOption: 'any', elemTypeOption: 'all' };

export function getBonusSetObjects() {

    let result: Map<BonusSetTypes, TypedSetsObject> = new Map();

    for (const key of bonusSetTypeValues) {

        const parsedObj: TypedSetsObject = JSON.parse(localStorage.getItem(bonusSetsLSKey + key));

        if (parsedObj) {
            result.set(key, parsedObj);
        }  
    }

    return result;
}

const BonusSetManager = () => {

    const [keyList, setKeyList] = useState<Map<BonusSetTypes, TypedSetsObject>>(getBonusSetObjects()); 
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
        setKeyList(() => getBonusSetObjects());
    };

    return (
        <div className={classes.bonusSetManagerMain}>

            <div className={classes.row}>

                <div className={classes.column}>
                    <SetSaver set={bonusSet} updateCallback={updateSetsHandler}/>
                    <SetSelector list={keyList} loadCallback={loadSetHandler} updateCallback={updateSetsHandler}/>
                </div>

                <div className={classes.column}>
                    <SetEditor set={bonusSet} addBonusCallback={addBonusHandler} deleteBonusCallback={deleteBonusHandler}/>
                </div>

            </div>

        </div>
    );
};

export default BonusSetManager;