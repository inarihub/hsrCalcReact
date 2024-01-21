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
                <text className={classes.attText}>{attNames[0]}</text>
                <text className={classes.valueText}>{props.result[0]}</text>
            </div>
            <div className={classes.resultRow}>
                <text className={classes.attText}>{attNames[1]}</text>
                <text className={classes.valueText}>{props.result[1]}</text>
            </div>
            <div className={classes.resultRow}>
                <text className={classes.attText}>{attNames[2]}</text>
                <text className={classes.valueText}>{props.result[2]}</text>
            </div>
        </div>
    );
}, function (prev, next) {
    if (prev.result[0] !== next.result[0] || prev.result[1] !== next.result[1] || prev.result[2] !== next.result[2]) {
        return false;
    }
    return true;
});