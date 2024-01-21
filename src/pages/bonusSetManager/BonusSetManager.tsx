import { useState } from 'react';
import classes from './BonusSetManager.module.scss';
import { SetSaver } from './setSaver/SetSaver';
import { SetSelector } from './setSelector/SetSelector';
import { SetEditor } from './setEditor/SetEditor';
import { BonusSet, BonusSetKey, BonusSetOptions, getBonusSet } from './BonusSet';

const BonusSetManager = () => {
    const [bonusSet, setBonusSet] = useState<BonusSet>([{id: 0, key: 'dmgIncrease', value: 1000, option: 'any' }, {id: 1, key: 'flathp', value: 500, option: 'none'}, {id: 2, key: 'crdmg', value: 500, option: 'none'}]);
    
    const addBonusHandler = (id: number, key?: BonusSetKey, value?: number, option?: BonusSetOptions) => {

        if (!key && value === undefined && option === undefined) return;

        setBonusSet((prev) => {
            return getBonusSet(prev, id, key, value, option);;
        })
    };

    return (
        <div className={classes.bonusSetManagerMain}>

            <div className={classes.row}>

                <div className={classes.column}>
                    <SetSaver />
                    <SetSelector />
                </div>

                <div className={classes.column}>
                    <SetEditor set={bonusSet} addBonusCallback={addBonusHandler}/>
                    {Object.values(bonusSet[0])}<br></br>
                    {Object.values(bonusSet[1])}<br></br>
                    {Object.values(bonusSet[2])}
                </div>

            </div>

        </div>
    );
};

export default BonusSetManager;