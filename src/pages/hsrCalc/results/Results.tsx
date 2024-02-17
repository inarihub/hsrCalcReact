import { memo, useState } from 'react';
import classes from './Results.module.scss';
import { ResultDmg } from '../../shared/Stat.types';

interface Results {
    result: ResultDmg;
}

export const Results = memo((props: Results) => {

    const attNames = {base: 'Damage', crit: 'Crit.Dmg', average: 'Avg.Dmg'};
    const baseDmg = Math.floor(props.result[0]);
    const critDmg = Math.floor(props.result[1]);
    const avgDmg = Math.floor(props.result[2]);

    return (
        <div className={classes.resultsMain}>
            <div className={classes.resultRow}>
                <p className={classes.attText}>{attNames.base}</p>
                <p className={classes.valueText}>{baseDmg}</p>
            </div>
            <div className={classes.resultRow}>
                <p className={classes.attText}>{attNames.crit}</p>
                <p className={classes.valueText}>{critDmg}</p>
            </div>
            <div className={classes.resultRow} style={{borderBottom: 'none'}}>
                <p className={classes.attText}>{attNames.average}</p>
                <p className={classes.valueText}>{avgDmg}</p>
            </div>
        </div>
    );
}, function (prev, next) {
    if (prev.result[0] !== next.result[0] || prev.result[1] !== next.result[1] || prev.result[2] !== next.result[2]) {
        return false;
    }
    return true;
});