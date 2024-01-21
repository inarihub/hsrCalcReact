import { useEffect, useState } from 'react';
import classes from './CharStats.module.scss';
import { ElementDmgTypes } from '../../../shared/Stat.types';
import { StatRow } from '../shared/StatRow';
import { srcTypes, elementDmgTypes } from '../shared/StatDictionaries';
import { Character, CharacterBuffsKey, CharacterBuffsType, CharacterStatKey, CharacterStatsType, SourceStatKey } from './Character';
import { buffer } from 'stream/consumers';

type OptionalSet = { percent: CharacterBuffsKey, base: CharacterStatKey, flat: CharacterBuffsKey };

interface CharStatsProps {
    char: Character;
    onCharChanged: (char: Character) => void;
}

let counter = '';

export const CharStats = (props: CharStatsProps) => {
    const srcStat = props.char.srcStat;
    const element = props.char.element;
    const charStats = props.char.stats;
    const charBuffs = props.char.buffs;


    let dynamic = statOpt(props.char.srcStat);

    const changeStatHandler = (statKey: CharacterStatKey, value: number) => {
       props.onCharChanged(new Character(element, srcStat, { ...charStats, [statKey]: value }, charBuffs));
    };

    const changeBuffsHandler = (buffKey: CharacterBuffsKey, value: number) => {
       props.onCharChanged(new Character(element, srcStat, charStats, { ...charBuffs, [buffKey]: value }));
    };

    let srcStatSelectOptions = [];
    for (const srcName of srcTypes) {
        srcStatSelectOptions.push(<option value={srcName}>{srcName[0].toUpperCase() + srcName.substring(1)}</option>);
    }

    let elementSelectOptions = [];
    for (const element of elementDmgTypes) {
        elementSelectOptions.push(<option value={element}>{element[0].toUpperCase() + element.substring(1)}</option>);
    }

    // let statRows = [
    //     {name: 'baseatk', class: 'stat', type: 'absolute'},
    //     {name: 'basehp', class: 'stat', type: 'absolute'},
    //     {name: 'basedef', class: 'stat', type: 'absolute'},

    // ];

    return (
        <div className={classes.mainContainer}>
            <p className={classes.header}>Character:</p>

            <section className={classes.dmgSrcSection}>
                <label htmlFor='sourceStat'>Dmg source:</label>
                <select id='sourceStat' value={srcStat} onInput={(e) => {
                    const newSrcStat = e.currentTarget.value as SourceStatKey;
                    props.onCharChanged(new Character(element, newSrcStat, charStats, charBuffs));
                }}>
                    {srcStatSelectOptions}
                </select>
            </section>

            <section className={classes.dmgSrcSection}>
                <label htmlFor='elementDmgType'>Element:</label>
                <select id='elementDmgType' value={element} onInput={(e) => {
                    const newElement = e.currentTarget.value as ElementDmgTypes;
                    props.onCharChanged(new Character(newElement, srcStat, charStats, charBuffs));
                }}>
                    {elementSelectOptions}
                </select>
            </section>

            <p className={classes.totalStatInfo}>Total {srcStat}: {props.char.getCharTotalAtk()}</p>

            <StatRow key='base' value={charStats[dynamic['base']]} statType={dynamic['base']} changeCallback={changeStatHandler} />
            <StatRow key='percent' value={charBuffs[dynamic['percent']]} statType={dynamic['percent']} type='percent' changeCallback={changeBuffsHandler} />
            <StatRow key='flat' value={charBuffs[dynamic['flat']]} statType={dynamic['flat']} changeCallback={changeBuffsHandler} />

            <StatRow key='multiplier' value={charStats['multiplier']} statType={'multiplier'} type='percent' changeCallback={changeStatHandler} />
            <StatRow key='crrate' value={charBuffs['crrate']} statType={'crrate'} type='percent' changeCallback={changeBuffsHandler} />
            <StatRow key='crdmg' value={charBuffs['crdmg']} statType={'crdmg'} type='percent' changeCallback={changeBuffsHandler} />
            <StatRow key='dmgIncrease' value={charBuffs['dmgIncrease']} statType={'dmgIncrease'} type='percent' changeCallback={changeBuffsHandler} />

            <StatRow key='elemIncrease' value={charBuffs['elemIncrease']} statType={'elemIncrease'} type='percent' changeCallback={changeBuffsHandler} />

            <StatRow key='defIgnore' value={charBuffs['defIgnore']} statType={'defIgnore'} type='percent' changeCallback={changeBuffsHandler} />
            <StatRow key='resPen' value={charBuffs['resPen']} statType={'resPen'} type='percent' changeCallback={changeBuffsHandler} />
        </div>
    );
};

function statOpt(statType: SourceStatKey): OptionalSet {
    switch (statType) {
        case 'hp':
            return {
                percent: 'hpIncrease',
                base: 'basehp',
                flat: 'flathp'
            };
        case 'atk':
            return {
                percent: 'atkIncrease',
                base: 'baseatk',
                flat: 'flatatk'
            };
        case 'def':
            return {
                percent: 'defIncrease',
                base: 'basedef',
                flat: 'flatdef'
            };
        default:
            break;
    }
};
