import { memo, useState } from 'react';
import classes from './Results.module.scss';
import { ResultDmg } from '../../shared/Stat.types';

interface Results {
    result: ResultDmg;
}

export const Results = memo((props: Results) => {
    const attNames = ['Damage', 'Crit.Dmg', 'Avg.Dmg'];

    return (
        <div className={classes.resultsMain}>
            <div className={classes.resultRow}>
                <p className={classes.attText}>{attNames[0]}</p>
                <p className={classes.valueText}>{props.result[0]}</p>
            </div>
            <div className={classes.resultRow}>
                <p className={classes.attText}>{attNames[1]}</p>
                <p className={classes.valueText}>{props.result[1]}</p>
            </div>
            <div className={classes.resultRow} style={{borderBottom: 'none'}}>
                <p className={classes.attText}>{attNames[2]}</p>
                <p className={classes.valueText}>{props.result[2]}</p>
            </div>
        </div>
    );
}, function (prev, next) {
    if (prev.result[0] !== next.result[0] || prev.result[1] !== next.result[1] || prev.result[2] !== next.result[2]) {
        return false;
    }
    return true;
});