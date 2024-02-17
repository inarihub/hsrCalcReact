import { memo, useRef, useState } from 'react';
import classes from './DataStore.module.scss';
import { Character } from '../stats/char/Character';
import { Enemy } from '../stats/enemy/Enemy';
import { SetupsList, lsSetupsKey, getSetups, saveToJSONFile, loadJSONFile, readJSONFileAsText } from '../services/store/SetupsStorage';
import { setToLocalStorage } from '@/pages/shared/DataStoreUtils';
import { BonusSetLib } from '../HSRCalc';
import { GroupedMap } from '@/pages/shared/GroupedMap';

interface DataStoreProps {
    char: Character;
    enemy: Enemy;
    bonuses: BonusSetLib;
    loadCallback?: (char: Character, enemy: Enemy, bonuses: BonusSetLib) => void;
}

function buildOptionElements(obj: SetupsList): JSX.Element[] {

    if (!obj) { return [] }

    const newOptions = [];

    for (const name of Object.keys(obj).sort()) {

        newOptions.push(
            <option key={name} className={classes.options}>
                {name}
            </option>
        );
    }

    return newOptions;
}

function isSetupsEmpty(setups: SetupsList): boolean {
    return Object.keys(setups).length === 0;
}

export function getNameForSetupCopy(obj: { [name: string]: any }, oldName: string) {

    let newName = oldName;
    let reserveIndex = 0;

    while (obj[newName]) {

        if (reserveIndex > 999) {
            throw new Error('Something went wrong with indexing new setup');
        }

        reserveIndex++;
        newName = oldName.concat('(', reserveIndex.toString(), ')');
    }

    return newName;
}

export const DataStore = memo((props: DataStoreProps) => {
    const lsSetupsObj = JSON.parse(localStorage[lsSetupsKey] ?? null);
    const [options, setOptions] = useState(buildOptionElements(lsSetupsObj));

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
                    enemy: props.enemy.getEnemyObj(),
                    bonuses: GroupedMap.toArray(props.bonuses)
                };

                const lsNewItem = JSON.stringify(setupsObj);
                setToLocalStorage(lsSetupsKey, lsNewItem);

                setOptions(buildOptionElements(setupsObj));

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

    const loadHandler = () => {

        const selector = selectorRef.current;
        let setupsObj = getSetups();

        if (isSetupsEmpty(setupsObj) || !selector.value || selector.value === '') {
            return;
        }

        const { char, enemy, bonuses } = setupsObj[selector.value];

        const newCharInstance = new Character(char.atkType, char.element, char.srcStat, char.stats, char.buffs);
        const newEnemyInstance = new Enemy(enemy.lvl, enemy.element, enemy.stats, enemy.debuffs, enemy.isBroken);
        const newBonusSetInstance = new GroupedMap(bonuses);

        if (newCharInstance && newEnemyInstance) {
            props.loadCallback(newCharInstance, newEnemyInstance, newBonusSetInstance);
        }
    };

    const deleteHandler = () => {
        const selector = selectorRef.current;
        let setupsObj = getSetups();

        if (isSetupsEmpty(setupsObj) || !selector.value || selector.value === '') {
            return;
        }

        if (confirm(`Selected setup "${selector.value}" will be deleted. Are you sure?`)) {
            delete setupsObj[selector.value];
            const jsonSetups = JSON.stringify(setupsObj);
            localStorage.setItem(lsSetupsKey, jsonSetups);
            setOptions(buildOptionElements(setupsObj));
        }
    };

    const exportDataHandler = () => {

        const setups = getSetups();

        if (isSetupsEmpty(setups)) {
            return;
        }

        const setupsString = JSON.stringify(setups);
        let file = new File([setupsString], 'setups.json', { type: "text/plain:charset=UTF-8" });

        saveToJSONFile(file);
    };

    const importDataHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {

        let files: FileList = undefined;

        try {
            files = await loadJSONFile(false, 600);
        } catch (e) {
            console.log(e);
            return;
        }

        if (!files || !files[0]) { return; }

        let setupsObj = getSetups();

        let importedSetups: string;

        try {
            importedSetups = await readJSONFileAsText(files[0]);
        } catch (e) {
            console.log(e);
            return;
        }

        if (!importedSetups || importedSetups.length === 0) {
            alert('There is nothing to import');
            return;
        }

        let parsedSetups: SetupsList;

        try {
            parsedSetups = JSON.parse(importedSetups) as SetupsList;
        } catch (e) {
            console.log('Wrong type of file!');
            return;
        }

        if (confirm('Do you want to SAVE all your previous setups?\n"OK" to ADD new setups, "Cancel" to CLEAR and ADD')) {

            const doRewriteItems = confirm('Do you want to override setups on name conflict?\n"Cancel" to add with new names');

            for (const setup in parsedSetups) {

                let newKey = setup;

                if (!doRewriteItems) {
                    newKey = getNameForSetupCopy(setupsObj, setup);
                }

                setupsObj[newKey] = parsedSetups[setup];
            }

        } else {

            setupsObj = {};

            for (const setup in parsedSetups) {
                setupsObj[setup] = parsedSetups[setup];
            }
        }

        const lsNewItem = JSON.stringify(setupsObj);
        localStorage.setItem(lsSetupsKey, lsNewItem);
        setOptions(buildOptionElements(setupsObj));
    };

    const clearHandler = () => {
        if (confirm('Do you want to delete all saved setups?')) {
            localStorage.removeItem('setups');
            setOptions([]);
        }
    }

    return (
        <div className={classes.dataStoreModule}>

            <div className={classes.headerSection}>
                <p className={classes.header}>Save/Load:</p>
                <div ref={statusRef} className={classes.statusText}></div>
            </div>

            <div className={classes.saveSection}>
                <input ref={saveInputRef} maxLength={20} className={classes.inputSave}></input>
                <button onClick={saveHandler}>Save</button>
            </div>

            <div className={classes.loadSection}>

                <select ref={selectorRef} className={classes.loadSelector}
                    disabled={options.length === 0} defaultValue={''}>
                    <option value={''} disabled hidden>-select setup-</option>
                    {options}
                </select>

                <section className={classes.loadSectionButtons}>
                    <button onClick={deleteHandler}>Delete</button>
                    <button onClick={loadHandler}>Load</button>
                </section>

            </div>

            <div className={classes.importExportSection}>
                <button onClick={importDataHandler}>Import</button>
                <button onClick={exportDataHandler}>Export</button>
                <button onClick={clearHandler}>Clear</button>
            </div>

        </div>
    );
});