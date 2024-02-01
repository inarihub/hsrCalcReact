import classes from './CharStats.module.scss';
import { AttackTypes, ElementDmgTypes, attackTypeValues } from '../../../shared/Stat.types';
import {StatRow} from '../shared/StatRow';
import { srcTypes, elementDmgTypes } from '../shared/StatDictionaries';
import { Character, CharacterBuffsKey, CharacterStatKey, SourceStatKey } from './Character';

type OptionalSet = { percent: CharacterBuffsKey, base: CharacterStatKey, flat: CharacterBuffsKey };

interface CharStatsProps {
    char: Character;
    onCharChanged: (char: Character) => void;
}

export const CharStats = (props: CharStatsProps) => {
    const atkType = props.char.atkType;
    const srcStat = props.char.srcStat;
    const element = props.char.element;
    const charStats = props.char.stats;
    const charBuffs = props.char.buffs;


    let dynamic = statOpt(props.char.srcStat);

    const changeStatHandler = (statKey: CharacterStatKey, value: number) => {
       props.onCharChanged(new Character(atkType, element, srcStat, { ...charStats, [statKey]: value }, charBuffs));
    };

    const changeBuffsHandler = (buffKey: CharacterBuffsKey, value: number) => {
       props.onCharChanged(new Character(atkType, element, srcStat, charStats, { ...charBuffs, [buffKey]: value }));
    };

    let atkTypeSelectOptions = [];
    for (const atkType of attackTypeValues) {
        atkTypeSelectOptions.push(<option key={atkType} value={atkType}>{atkType[0].toUpperCase() + atkType.substring(1)}</option>)
    }

    let srcStatSelectOptions = [];
    for (const srcName of srcTypes) {
        srcStatSelectOptions.push(<option key={srcName} value={srcName}>{srcName[0].toUpperCase() + srcName.substring(1)}</option>);
    }

    let elementSelectOptions = [];
    for (const element of elementDmgTypes) {
        elementSelectOptions.push(<option key={element} value={element}>{element[0].toUpperCase() + element.substring(1)}</option>);
    }

    return (
        <div className={classes.mainContainer}>
            <p className={classes.header}>Character:</p>

            <section className={classes.dmgSrcSection}>
                <label htmlFor='atkType'>Atk type:</label>
                <select id='atkType' value={atkType} onInput={(e) => {
                    const newAtkType = e.currentTarget.value as AttackTypes;
                    props.onCharChanged(new Character(newAtkType, element, srcStat, charStats, charBuffs));
                }}>
                    {atkTypeSelectOptions}
                </select>
            </section>

            <section className={classes.dmgSrcSection}>
                <label htmlFor='sourceStat'>Dmg source:</label>
                <select id='sourceStat' value={srcStat} onInput={(e) => {
                    const newSrcStat = e.currentTarget.value as SourceStatKey;
                    props.onCharChanged(new Character(atkType, element, newSrcStat, charStats, charBuffs));
                }}>
                    {srcStatSelectOptions}
                </select>
            </section>

            <section className={classes.dmgSrcSection}>
                <label htmlFor='elementDmgType'>Element:</label>
                <select id='elementDmgType' value={element} onInput={(e) => {
                    const newElement = e.currentTarget.value as ElementDmgTypes;
                    props.onCharChanged(new Character(atkType, newElement, srcStat, charStats, charBuffs));
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
