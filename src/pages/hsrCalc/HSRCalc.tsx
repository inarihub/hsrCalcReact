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
import { BonusController } from './stats/bonuses/BonusController';

const lsDefaultUser = 'defaultUserSetup';

let setup = getDefaultSetup();

function getDefaultSetup(): [Character, Enemy] {
    const setupString = localStorage.getItem(lsDefaultUser);
        const defaultUserSetup = JSON.parse(setupString ?? '{}'); // type default setup
       
        if (Object.keys(defaultUserSetup).length !== 0) {
            const setup = parseToSetup(defaultUserSetup);
            return [setup.char, setup.enemy];
        }
        
        return [new Character(), new Enemy()];
}

let counter = 0;

const HSRCalc = () => {
    const [char, setChar] = useState<Character>(setup[0]);
    const [enemy, setEnemy] = useState<Enemy>(setup[1]);
    
    let charRef = useRef<Character>();
    charRef.current = char;

    let enemyRef = useRef<Enemy>();
    enemyRef.current = enemy;

    function setDefaultByRef() {
        const charObj = charRef.current.getCharObj();
        const enemyObj = enemyRef.current.getEnemyObj();
        localStorage.setItem(lsDefaultUser, JSON.stringify({ char: charObj, enemy: enemyObj }));
    }

    useEffect(() => {

        window.addEventListener("beforeunload", e => {
            setDefaultByRef();
            return;
        });

        return () => {   
            setDefaultByRef()
            setup = [charRef.current, enemyRef.current];
        };
    }, []);

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

    const result = dmgResult(char, enemy);

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
                    <BonusController />
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