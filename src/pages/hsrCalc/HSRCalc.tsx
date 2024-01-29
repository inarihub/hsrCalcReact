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
import { BonusSet } from '../bonusSetManager/BonusSet';
import { BonusSetTypes } from '../bonusSetManager/setSaver/SetSaver';

const lsDefaultUser = 'defaultUserSetup';

let calcObjectsState = getSavedState();

function getSavedState(): CalcStateObjects {

    const setupString = localStorage.getItem(lsDefaultUser);
    const defaultUserSetup = setupString ? JSON.parse(setupString) as CalcStateObjects : {} as CalcStateObjects;

    if (Object.keys(defaultUserSetup).length !== 0) {
        const setup = parseToSetup(defaultUserSetup); // this is not setup anymore in terms of functionality. rename
        return { char: setup.char ?? new Character(), enemy: setup.enemy ?? new Enemy(), bonuses: new Map(defaultUserSetup.bonuses) ?? new Map(), inactives: defaultUserSetup.inactives ?? [] }; // check if it is correct map
    }

    return { char: new Character(), enemy: new Enemy(), bonuses: new Map(), inactives: [] };
}

export interface BonusPathWithIDs {
    group: BonusSetTypes;
    name: string;
    ids: number[];
}

export interface BonusPath {
    group: BonusSetTypes;
    name: string;
}

interface CalcStateObjects {
    char: Character,
    enemy: Enemy,
    bonuses: Map<string, BonusSet>,
    inactives: BonusPath[]
}

const HSRCalc = () => {
    const [char, setChar] = useState<Character>(calcObjectsState.char);
    const [enemy, setEnemy] = useState<Enemy>(calcObjectsState.enemy);
    const [bonusSets, setBonusSets] = useState<Map<string, BonusSet>>(calcObjectsState.bonuses); //default? save state between loadings?
    const [inactiveBonuses, setInactiveBonuses] = useState<BonusPath[]>(calcObjectsState.inactives);

    let charRef = useRef<Character>(char);
    let enemyRef = useRef<Enemy>(enemy);
    let bonusRef = useRef<Map<string, BonusSet>>(bonusSets);
    let inactivesRef = useRef<BonusPath[]>(inactiveBonuses);
    

    function setDefaultByRef() {
        const charObj = charRef.current?.getCharObj();
        const enemyObj = enemyRef.current?.getEnemyObj();
        const bonusObj = [...bonusRef.current];
        const inactivesObj = [...inactivesRef.current];
        localStorage.setItem(lsDefaultUser, JSON.stringify({ char: charObj, enemy: enemyObj, bonus: bonusObj, inactives: inactivesObj }));
    }

    useEffect(() => {

        window.addEventListener("beforeunload", e => {
            setDefaultByRef();
            return;
        });

        return () => {
            setDefaultByRef();
            calcObjectsState = { char: charRef.current, enemy: enemyRef.current, bonuses: bonusRef.current, inactives: inactivesRef.current };
        };
    }, []);

    useEffect(() => {
        charRef.current = char;
        enemyRef.current = enemy;
        bonusRef.current = bonusSets;
        inactivesRef.current = inactiveBonuses;
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

    function loadBonusSetHandler(sets: Map<string, BonusSet>) {
        setBonusSets(sets);
    }

    function findInactiveBonusPath(pathObj: BonusPath, inactiveBonuses: BonusPath[]): number {

        if (!Array.isArray(inactiveBonuses)) {
            console.log('Missin array. Source: findInactiveBonusPath');
            return -1;
        }

        return inactiveBonuses.findIndex(obj => obj.group === pathObj.group && obj.name === pathObj.name);
    }

    function setInactiveBonusesHandler(pathObj: BonusPath, isActive: boolean) {
        setInactiveBonuses((prev) => {
            if (isActive) {
                const newList = [...prev];
                const objIndex = findInactiveBonusPath(pathObj, inactiveBonuses);
                newList.splice(objIndex, 1);
                return newList;
            }
            else {
                return [...prev, pathObj];
            }
        })
    }

    const allBonuses: BonusSet = [];

    bonusSets.forEach((set, key) => {
        const [group, name] = key.split('/_/');
        if (inactiveBonuses.find(obj => obj.group === group && obj.name === name) === undefined) {
            allBonuses.push(...set)
        }
    });

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
                    <BonusSetController bonusSets={bonusSets} updateCallback={loadBonusSetHandler}
                    hideBonusCallback={setInactiveBonusesHandler} />
                </div>

            </div>

        </div>
    );
}

// export function getDefaultCharStats(): CharacterStatsType {
//     return {
//         multiplier: 0,
//         hp: 0,
//         def: 0,
//         atk: 0,
//         crrate: 0.05,
//         crdmg: 0.5,
//         baseatk: 0,
//         basehp: 0,
//         basedef: 0,
//         flatatk: 0,
//         flathp: 0,
//         flatdef: 0,
//         breakeffect: 0,
//         atkIncrease: 0,
//         hpIncrease: 0,
//         defIncrease: 0,
//         dmgIncrease: 0,
//         defIgnore: 0,
//         resPen: 0
//     };
// };

export default HSRCalc;