import { useRef, useState } from 'react';
import classes from './DataStore.module.scss';
import { Character, CharacterObj } from '../stats/char/Character';
import { Enemy, EnemyObj } from '../stats/enemy/Enemy';

interface DataStoreProps {
    char: Character;
    enemy: Enemy;
    loadCallback?: (char: Character, enemy: Enemy) => void;
}

const lsSetups = 'setups';

interface Setups {
    [name: string]: { char: CharacterObj, enemy: EnemyObj };
}

function getSelectOptions(obj: Setups): JSX.Element[] {

    if (!obj) { return [] }

    const newOptions = [];

    for (const name in obj) {

        newOptions.push(
            <option key={name} className={classes.options}>
                {name}
            </option>
        );
    }

    return newOptions;
}

function getSetups(): Setups {
    const setups = localStorage.getItem(lsSetups);
    const parsedSetups: Setups = JSON.parse(setups ?? null);

    return parsedSetups ?? {};
}

export const DataStore = (props: DataStoreProps) => {
    const lsSetupsObj = JSON.parse(localStorage[lsSetups] ?? null);
    const [options, setOptions] = useState(getSelectOptions(lsSetupsObj));

    const saveInputRef = useRef<HTMLInputElement>(null);
    const selectorRef = useRef<HTMLSelectElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    const saveHandler = () => {

        const input = saveInputRef.current;

        if (input && input.value !== '') {

            let setupsObj = getSetups();

            const confirmOnMatch = setupsObj[input.value] && confirm('This name already exists. Do you want to override?');
            const noMatch = !setupsObj[input.value];

            if (confirmOnMatch || noMatch) {

                setupsObj[input.value] = {
                    char: props.char.getCharObj(),
                    enemy: props.enemy.getEnemyObj()
                };

                const lsNewItem = JSON.stringify(setupsObj);
                localStorage.setItem(lsSetups, lsNewItem);
                setOptions(getSelectOptions(setupsObj));

                saveInputRef.current.value = '';
                statusRef.current.textContent = 'Saved';

                const idInterval = setTimeout(
                    () => {
                        statusRef.current.textContent = '';
                        clearTimeout(idInterval);
                    }, 1500);
            }
        }
    };

    const loadHanlder = () => {
        const selector = selectorRef.current;
        let setupsObj = getSetups();
        if (!setupsObj) { return }

        const char = setupsObj[selector.value].char;
        const enemy = setupsObj[selector.value].enemy;

        const newCharInstance = new Character(char.element, char.srcStat, char.stats, char.buffs);
        const newEnemyInstance = new Enemy(enemy.lvl, enemy.element, enemy.stats, enemy.debuffs, enemy.isBroken);

        if (newCharInstance && newEnemyInstance) {
            props.loadCallback(newCharInstance, newEnemyInstance);
        }
    };

    return (
        <div className={classes.dataStoreModule}>

            <div className={classes.headerSection}>
                <p className={classes.header}>Save/Load:</p>
                <div ref={statusRef} className={classes.statusText}></div>
            </div>

            <div className={classes.saveSection}>
                <input ref={saveInputRef} className={classes.inputSave}></input>
                <button onClick={saveHandler}>Save</button>
            </div>

            <div className={classes.loadSection}>
                <select ref={selectorRef} className={classes.loadSelector}>
                    {options}
                </select>
                <button onClick={loadHanlder}>Load</button>
            </div>

        </div>
    );
};