import { useEffect, useRef, useState } from 'react';
import classes from './HSRCalc.module.scss';
import { Results } from './results/Results';
import { CharStats } from './stats/char/CharStats';
import { StatSetList } from './stats/shared/StatSetList';
import { ResultDmg } from './stats/Stat.types';
import { EnemyStats } from './stats/enemy/EnemyStats';
import { dmgResult } from './stats/DmgCalculation';
import { Character } from './stats/char/Character';
import { Enemy, EnemyStatsType } from './stats/enemy/Enemy';
import { DataStore } from './dataStore/DataStore';

const HSRCalc = () => {
    const [char, setChar] = useState<Character>(new Character());
    const [enemy, setEnemy] = useState<Enemy>(new Enemy());
    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const clearSetups = () => {
        localStorage.clear();
    };

    function charChangedHanlder(newCharStats: Character) {
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
        charChangedHanlder(char);
        enemyChangedHanlder(enemy);
    }

    const options = () => {
        let savedNames = [];
        const ls = Object.entries(localStorage);
        for (const name of ls) {
            if (name[0].startsWith('.set__'))
                savedNames.push(<option key={name[0].substring(6)} value={name[0].substring(6)}>{name[0].substring(6)}</option>);
        }
        return savedNames;
    }
    const result = dmgResult(char, enemy);

    return (

        <div className={classes.calcMainContainer}>

            <div className={classes.row}>

                <div className={classes.column}>
                    <div className={classes.charStatsContainer}>
                        <CharStats char={char} onCharChanged={charChangedHanlder} />
                    </div>
                </div>

                <div className={classes.column}>
                    <div className={classes.enemyStatsContainer}>
                        <EnemyStats enemy={enemy} onChangeCallback={enemyChangedHanlder} />
                    </div>

                    <div className={classes.resultsContainer}>
                        <Results result={result} />
                    </div>

                    <DataStore char={char} enemy={enemy} loadCallback={loadSetupHandler} />
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