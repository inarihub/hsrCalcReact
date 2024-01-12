import classes from './StatSetList.module.scss';
import { StatSet } from "./StatSet";
import { useState } from 'react';

export const StatSetList = () => {
    const selectedStats = [
        { title: 'HP', value: 2500 },
        { title: 'Def', value: 1250 },
        { title: 'Crit rate', value: 75 }
    ];

    const [set, setSet] = useState(selectedStats[0]);
    
    return (
        <div className={classes.statSetContainer}>
            <select name="stat" id="stat" onChange={(e) => setSet(selectedStats[Number(e.currentTarget.selectedIndex)])}>
                <option value={0}>Option #1</option>
                <option value={2}>Option #2</option>
                <option value={3}>Option #3</option>
            </select>
            <StatSet set={set} />
        </div>
    );
};