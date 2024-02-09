import classes from './BonusSetElement.module.scss';
import { Fragment, useEffect, useRef, useState } from 'react';
import { isPercent } from '@/pages/shared/Stat.types';
import local from '@/pages/shared/StatDictionary';
import { BonusPath, BonusPathWithIDs } from '../../HSRCalc';
import { BonusSet, BonusSetGroupKeys } from '@/pages/shared/BonusSetTypes';

interface BonusSetElementProps {
    title: string;
    group?: BonusSetGroupKeys;
    set: BonusSet;
    deleteCallback: (groupName: BonusSetGroupKeys, value: string) => void;
}

export const BonusSetElement = (props: BonusSetElementProps) => {

    const [isMinimized, setIsMinimized] = useState<boolean>(true);
    const [active, setActive] = useState<boolean>(true);

    let bonusSetColumns = [];

    // useEffect(() => {
    //     props.hideBonusCallback({group: props.group, name: props.title}, active);
    // }, [active]);

    for (const bonus of props.set) {

        const optionOneText = !bonus.atkTypeOption || bonus.atkTypeOption === 'any' || bonus.atkTypeOption === 'none' ? '' : local['en'][bonus.atkTypeOption];
        const optionTwoText = !bonus.elemTypeOption || bonus.elemTypeOption === 'all' || bonus.elemTypeOption == 'none' ? '' : local['en'][bonus.elemTypeOption];
        const optionsText = optionOneText === '' && optionTwoText === '' ? '' : `(${optionTwoText} ${optionOneText})`

        const isPercents = isPercent(bonus.key);
        let value = isPercents ? parseFloat((bonus.value * 100).toFixed(2)) : bonus.value;

        bonusSetColumns.push(
            (<div className={classes.bonus} key={bonus.key + bonus.id + '_bonus'}>
                <p className={classes.bonusDesc}>+{local['en'][bonus.key]} {optionsText}:</p><p className={classes.bonusValue}>{value}{isPercents ? '%' : ''}</p>
            </div>))
    }

    return (

        <div className={classes.bonusSetContainer}>

            <div className={classes.headerSection}>

                <div className={classes.titles}>
                    <p className={classes.group}>{local['en'][props.group]}{props.group?.length > 0 ? ':' : ''}</p>
                    <p className={classes.header}>{props.title}</p>
                </div>

                <div className={classes.controlButtonsSection}>
                    <button key='deactivateButton' title='Activate or deactivate this bonus' style={active ? undefined : {backgroundColor: 'darkred'}}
                    className={classes.controlButton} onClick={e => setActive(prev => !prev)}>👁</button>
                    <button key='showHideButton' title='Minimize or restore details' className={classes.controlButton} onClick={e => setIsMinimized((prev) => !prev)}>...</button>
                    <button key='deleteButton' title='Delete this bonus' className={classes.controlButton} onClick={e => props.deleteCallback(props.group, props.title)}>x</button>
                </div>

            </div>

            {isMinimized ? <Fragment /> : (
                <div className={classes.bonusesPreviewList}>
                    {bonusSetColumns}
                </div>
            )}

        </div>
    );
};