import { useState } from 'react';
import classes from './Results.module.scss';
import { ResultDmg } from '../stats/Stat.types';

interface Results {
    result: ResultDmg;
}

export const Results = (props: Results) => {
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
}