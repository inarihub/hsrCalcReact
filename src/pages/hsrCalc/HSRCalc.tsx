import { useEffect, useRef, useState } from 'react';
import classes from './HSRCalc.module.scss';
import { Results } from './results/Results';
import { CharStats } from './stats/char/CharStats';
import { EnemyStats } from './stats/enemy/EnemyStats';
import { dmgResult } from './stats/DmgCalculation';
import { Character, CharacterObj } from './stats/char/Character';
import { Enemy, EnemyObj } from './stats/enemy/Enemy';
import { DataStore } from './dataStore/DataStore';
import { BonusSetController } from './stats/bonuses/BonusSetController';
import { BonusSetGroupKeys, ContextBonusSet, isBonusSetGroupKey } from '../shared/BonusSetTypes';
import { ArrayLikeGroupedMap, GroupedMap } from '../shared/GroupedMap';
import { isContextBonusSet } from '../shared/BonusSet';
import { versionControlValidation } from '../shared/VersionControl';

const lsDefaultUser = 'defaultUserSetup';
versionControlValidation();

let calcObjectsState = getSavedState();

function getSavedState(): CalcBonusState {

    const setupString = localStorage.getItem(lsDefaultUser);

    if (setupString) {
        const defaultUserSetup = JSON.parse(setupString) as ParsedBonusStateObjects;
        const char = defaultUserSetup.char;
        const enemy = defaultUserSetup.enemy;
        const groupedMap = GroupedMap.fromArray(defaultUserSetup.bonuses);


        const newCharInstance = new Character(char.atkType, char.element, char.srcStat, char.stats, char.buffs);
        const newEnemyInstance = new Enemy(enemy.lvl, enemy.element, enemy.stats, enemy.debuffs, enemy.isBroken);
        const newBonusSetGroups = GroupedMap.isTypes(groupedMap, isBonusSetGroupKey, isContextBonusSet) ? groupedMap : new GroupedMap<BonusSetGroupKeys, ContextBonusSet>();

        return { char: newCharInstance, enemy: newEnemyInstance, bonuses: newBonusSetGroups };
    }

    return { char: new Character(), enemy: new Enemy(), bonuses: new GroupedMap<BonusSetGroupKeys, ContextBonusSet>() };
}

export type BonusSetLib = GroupedMap<BonusSetGroupKeys, ContextBonusSet>;

export interface BonusPathWithIDs {
    group: BonusSetGroupKeys;
    name: string;
    ids: number[];
}

export interface BonusPath {
    group: BonusSetGroupKeys;
    name: string;
}

interface ParsedBonusStateObjects {
    char: CharacterObj,
    enemy: EnemyObj,
    bonuses: ArrayLikeGroupedMap,
}

interface CalcBonusState {
    char: Character,
    enemy: Enemy,
    bonuses: BonusSetLib,
}

const HSRCalc = () => {
    const [char, setChar] = useState<Character>(calcObjectsState.char);
    const [enemy, setEnemy] = useState<Enemy>(calcObjectsState.enemy);
    const [bonusSets, setBonusSets] = useState<BonusSetLib>(calcObjectsState.bonuses);

    let charRef = useRef<Character>(char);
    let enemyRef = useRef<Enemy>(enemy);
    let bonusRef = useRef<BonusSetLib>(bonusSets);
    let backupTimer = useRef<NodeJS.Timeout>(null);

    function setDefaultByRef() {
        const charObj = charRef.current?.getCharObj() ?? new Character();
        const enemyObj = enemyRef.current?.getEnemyObj() ?? new Enemy();
        const bonusObj = bonusRef.current ? GroupedMap.toArray(bonusRef.current) : [];
        const composedObj: ParsedBonusStateObjects = { char: charObj, enemy: enemyObj, bonuses: bonusObj };
        localStorage.setItem(lsDefaultUser, JSON.stringify(composedObj));
    }

    useEffect(() => {
        charRef.current = char;
        enemyRef.current = enemy;
        bonusRef.current = bonusSets;
    })

    useEffect(() => {

        window.addEventListener("beforeunload", e => {
            setDefaultByRef();
            return;
        });

        return () => {
            setDefaultByRef();
            calcObjectsState = { char: charRef.current, enemy: enemyRef.current, bonuses: bonusRef.current };
        };
    }, []);

    useEffect(() => {
        setBonusSets((prev) => {
            initComparisonValues(char, enemy, prev);
            return new GroupedMap<BonusSetGroupKeys, ContextBonusSet>(prev);
        });
    }, [char, enemy]);

    useEffect(() => {

        if (backupTimer.current) {
            clearTimeout(backupTimer.current)
            backupTimer.current = setTimeout(() => {setDefaultByRef(); clearTimeout(backupTimer.current);}, 5000);
            return () => {clearTimeout(backupTimer.current); backupTimer.current = null;};

        } else {
            backupTimer.current = setTimeout(() => {setDefaultByRef(); clearTimeout(backupTimer.current);}, 5000);
        }

    }, [bonusSets])

    function charChangedHandler(newCharStats: Character) {
        setChar(() => {
            setTimeout(() => {}, 1000);
            return newCharStats;
        });
    };

    function enemyChangedHanlder(newEnemy: Enemy) {
        setEnemy(() => {
            return newEnemy;
        });
    };

    function loadSetupHandler(char: Character, enemy: Enemy, bonuses: BonusSetLib) {
        charChangedHandler(char);
        enemyChangedHanlder(enemy);
        loadBonusSetHandler(bonuses); //little bit messy
    }

    function loadBonusSetHandler(sets: BonusSetLib) {
        initComparisonValues(char, enemy, sets);
        setBonusSets(sets);
    }

    //не считает при изменении статов перса или врага. перенести куда-то в результаты может, чтоб выплёвывало в бонус сеты
    function initComparisonValues(char: Character, enemy: Enemy, sets: BonusSetLib) {

        const result = dmgResult(char, enemy, sets);

        const newLib = new GroupedMap(sets);

        newLib.data.forEach((groupMap) => {
            groupMap.forEach((set) => {

                if (set.isActive) {
                    set.isActive = !set.isActive;
                    const setLocalRes = dmgResult(char, enemy, newLib);
                    set.isActive = !set.isActive;

                    set.comparisonValue = [
                        (result[0] - setLocalRes[0]) / setLocalRes[0],
                        (result[1] - setLocalRes[1]) / setLocalRes[1],
                        (result[2] - setLocalRes[2]) / setLocalRes[2]
                    ].map(e => Number.isNaN(e) ? 0 : e) as [number, number, number];
                } else {
                    set.comparisonValue = [0, 0, 0];
                }


                set.items.forEach(item => {

                    if (item.isActive) {
                        item.isActive = !item.isActive;
                        const localRes = dmgResult(char, enemy, newLib);
                        item.isActive = !item.isActive;

                        item.comparisonValue = [
                            (result[0] - localRes[0]) / localRes[0],
                            (result[1] - localRes[1]) / localRes[1],
                            (result[2] - localRes[2]) / localRes[2]
                        ].map(e => Number.isNaN(e) ? 0 : e) as [number, number, number];

                    } else {
                        item.comparisonValue = [0, 0, 0];
                    }
                });
            })
        })
    }

    const result = dmgResult(char, enemy, bonusSets);

    return (

        <div className={classes.calcMainContainer}>

            <div className={classes.row}>

                <div className={classes.column}>
                    <CharStats char={char} onCharChanged={charChangedHandler} />
                </div>

                <div className={classes.column}>
                    <EnemyStats enemy={enemy} onChangeCallback={enemyChangedHanlder} />
                    <Results result={result} />
                    <DataStore char={char} enemy={enemy} bonuses={bonusSets} loadCallback={loadSetupHandler} />
                </div>

                <div className={classes.column}>
                    <BonusSetController provider={bonusSets} updateCallback={loadBonusSetHandler} />
                </div>

            </div>

        </div>
    );
}

export default HSRCalc;