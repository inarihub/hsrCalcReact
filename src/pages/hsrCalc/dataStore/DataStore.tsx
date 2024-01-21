import { memo, useRef, useState } from 'react';
import classes from './DataStore.module.scss';
import { Character } from '../stats/char/Character';
import { Enemy } from '../stats/enemy/Enemy';
import { SetupsList, lsSetupsKey, getSetups, parseToSetup, saveSetupToFile, importSetupFile, readSetupFile } from '../services/store/SetupsStorage';

interface DataStoreProps {
    char: Character;
    enemy: Enemy;
    loadCallback?: (char: Character, enemy: Enemy) => void;
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
                    enemy: props.enemy.getEnemyObj()
                };

                const lsNewItem = JSON.stringify(setupsObj);
                localStorage.setItem(lsSetupsKey, lsNewItem);
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

        const setup = parseToSetup(setupsObj[selector.value]);

        if (setup.char && setup.enemy) {
            props.loadCallback(setup.char, setup.enemy);
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

    const saveToFileHandler = () => {

        const setups = getSetups();

        if (isSetupsEmpty(setups)) {
            return;
        }

        const setupsString = JSON.stringify(setups);
        let file = new File([setupsString], 'setups.json', { type: "text/plain:charset=UTF-8" });

        saveSetupToFile(file);
    };

    const importDataHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {

        event.persist();

        let files: FileList = undefined;

        try {
            files = await importSetupFile(false, 600);
        } catch(e) {
            alert(e);
        }

        if (!files || !files[0]) { return; }

        let setupsObj = getSetups();

        let importedSetups: string;

        try {
            importedSetups = await readSetupFile(files[0]);
        } catch(e) {
            alert(e);
        }
        

        if (importedSetups.length === 0) {
            alert('There is nothing to import');
            return;
        }

        let parsedSetups: SetupsList;

        try {
            parsedSetups = JSON.parse(importedSetups) as SetupsList;
        } catch (e) {
            alert('Wrong type of file!');
            return;
        }

        if (confirm('Do you want to SAVE all your previous setups?\n"OK" to ADD new setups, "Cancel" to CLEAR and ADD')) {

            const doRewriteItems = confirm('Do you want to override setups if when conflict?\n"Cancel" to add with new names');

            for (const setup in parsedSetups) {

                let newKey = setup;

                if (!doRewriteItems) {

                    let reserveIndex = 0;

                    while (setupsObj[newKey]) {

                        if (reserveIndex > 999) {
                            throw new Error('Something went wrong with indexing new setup');
                        }

                        reserveIndex++;
                        newKey = setup.concat('(', reserveIndex.toString(), ')');
                    }
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
                <button onClick={saveToFileHandler}>Export</button>
                <button onClick={() => localStorage.clear()}>Clear</button>
            </div>

        </div>
    );
});