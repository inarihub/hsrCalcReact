import { useEffect, useRef, useState } from 'react';
import classes from './HSRCalc.module.scss';
import { Results } from './results/Results';
import { CharStats } from './stats/char/CharStats';
import { EnemyStats } from './stats/enemy/EnemyStats';
import { dmgResult } from './stats/DmgCalculation';
import { Character } from './stats/char/Character';
import { Enemy } from './stats/enemy/Enemy';
import { DataStore } from './dataStore/DataStore';
import { parseToSetup } from './services/store/SetupsStorage';
import { BonusSetController } from './stats/bonuses/BonusSetController';
import { BonusSet, BonusSetGroupKeys } from '../shared/BonusSetTypes';
import { BonusSetProvider, BonusSetProviderArrayLike } from '../shared/BonusSetProvider';

const lsDefaultUser = 'defaultUserSetup';

let calcObjectsState = getSavedState();

function getSavedState(): CalcBonusState {

    const setupString = localStorage.getItem(lsDefaultUser);
    const defaultUserSetup = setupString ? JSON.parse(setupString) as ParsedBonusStateObjects : {} as ParsedBonusStateObjects;

    if (Object.keys(defaultUserSetup).length !== 0) {
        const setup = parseToSetup(defaultUserSetup);
        return {
            char: setup.char instanceof Character ? setup.char : new Character(),
            enemy: setup.enemy instanceof Enemy ? setup.enemy : new Enemy(),
            bonuses: BonusSetProvider.fromArray(defaultUserSetup.bonuses),
        };
    }

    return { char: new Character(), enemy: new Enemy(), bonuses: new BonusSetProvider() };
}

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
    char: Character,
    enemy: Enemy,
    bonuses: BonusSetProviderArrayLike,
}

interface CalcBonusState {
    char: Character,
    enemy: Enemy,
    bonuses: BonusSetProvider,
}

const HSRCalc = () => {
    const [char, setChar] = useState<Character>(calcObjectsState.char);
    const [enemy, setEnemy] = useState<Enemy>(calcObjectsState.enemy);
    const [bonusSets, setBonusSets] = useState<BonusSetProvider>(calcObjectsState.bonuses);

    let charRef = useRef<Character>(char);
    let enemyRef = useRef<Enemy>(enemy);
    let bonusRef = useRef<BonusSetProvider>(bonusSets);

    function setDefaultByRef() {
        const charObj = charRef.current?.getCharObj() ?? new Character();
        const enemyObj = enemyRef.current?.getEnemyObj() ?? new Enemy();
        const bonusObj = BonusSetProvider.toArray(bonusRef.current);
        localStorage.setItem(lsDefaultUser, JSON.stringify({ char: charObj, enemy: enemyObj, bonus: bonusObj }));
    }

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
        charRef.current = char;
        enemyRef.current = enemy;
        bonusRef.current = bonusSets;
    })

    function charChangedHandler(newCharStats: Character) {
        setChar(() => {
            return newCharStats;
        });
    };

    function enemyChangedHanlder(newEnemy: Enemy) {
        setEnemy(() => {
            return newEnemy;
        });
    };

    function loadSetupHandler(char: Character, enemy: Enemy) {
        charChangedHandler(char);
        enemyChangedHanlder(enemy);
    }

    function loadBonusSetHandler(sets: BonusSetProvider) {
        setBonusSets(sets);
    }

    const allBonuses: BonusSet = [];

    // bonusSets.getBonusSetMaps().forEach((set) => {
    //     set.forEach((bonus) => {
    //         if (bonus.isActive) {
    //             allBonuses.push(...bonus.set);
    //         }
    //     })
    // });

    const result = dmgResult(char, enemy, allBonuses);

    return (

        <div className={classes.calcMainContainer}>

            <div className={classes.row}>

                <div className={classes.column}>
                    <CharStats char={char} onCharChanged={charChangedHandler} />
                </div>

                <div className={classes.column}>
                    <EnemyStats enemy={enemy} onChangeCallback={enemyChangedHanlder} />
                    <Results result={result} />
                    <DataStore char={char} enemy={enemy} loadCallback={loadSetupHandler} />
                </div>

                <div className={classes.column}>
                    <BonusSetController provider={bonusSets} updateCallback={loadBonusSetHandler} />
                </div>

            </div>

        </div>
    );
}

export default HSRCalc;