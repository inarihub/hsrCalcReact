import { useRef, useState } from 'react';
import classes from './DataStore.module.scss';
import { Character, CharacterObj } from '../stats/char/Character';
import { Enemy, EnemyObj } from '../stats/enemy/Enemy';

interface DataStoreProps {
    char: Character;
    enemy: Enemy;
    loadCallback?: (char: Character, enemy: Enemy) => void;
}

const lsSetupsKey = 'setups';

interface Setups {
    [name: string]: { char: CharacterObj, enemy: EnemyObj };
}

function buildOptionElements(obj: Setups): JSX.Element[] {

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
    const setups = localStorage.getItem(lsSetupsKey);
    const parsedSetups: Setups = JSON.parse(setups ?? null);

    return parsedSetups ?? {}; // fix
}

function importSetupFile(multiple = false, timeout = 10): Promise<FileList> {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.click();

    return new Promise((resolve, reject) => {
        input.addEventListener("change", event => resolve(input.files));
        setTimeout(() => reject(), timeout * 1000);
    });
}

function readSetupFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onloadend = (e) => {
            const content = e.target.result as string;
            resolve(content);
        };

        reader.onerror = (e) => {
            reject(e);
        };

        reader.readAsText(file);
    });
}

export const DataStore = (props: DataStoreProps) => {
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

    const loadHanlder = () => {
        const selector = selectorRef.current;
        let setupsObj = getSetups();
        if (!setupsObj || Object.entries(setupsObj).length === 0) { return }

        const char = setupsObj[selector.value].char;
        const enemy = setupsObj[selector.value].enemy;

        const code = btoa(JSON.stringify(setupsObj));

        console.log(code);
        console.log(atob(code));

        const newCharInstance = new Character(char.element, char.srcStat, char.stats, char.buffs);
        const newEnemyInstance = new Enemy(enemy.lvl, enemy.element, enemy.stats, enemy.debuffs, enemy.isBroken);

        if (newCharInstance && newEnemyInstance) {
            props.loadCallback(newCharInstance, newEnemyInstance);
        }
    };

    const deleteHandler = () => {
        const selector = selectorRef.current;
        let setupsObj = getSetups();

        if (!setupsObj) { return }

        if (confirm(`Selected setup ${selector.value} will be deleted. Are you sure?`)) {
            delete setupsObj[selector.value];
            const jsonSetups = JSON.stringify(setupsObj);
            localStorage.setItem(lsSetupsKey, jsonSetups);
            setOptions(buildOptionElements(setupsObj));
        }
    };

    const saveToFileHandler = () => {

        let file = new File([JSON.stringify(getSetups() ?? null)], 'setups.json', { type: "text/plain:charset=UTF-8" });
        const url = window.URL.createObjectURL(file);

        const aElement = document.createElement("a");
        aElement.setAttribute('style', "display: none");
        aElement.href = url;
        aElement.download = file.name;
        aElement.click();
        window.URL.revokeObjectURL(url);
        aElement.remove();
    };

    const importDataHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {

        event.persist();

        const files = await importSetupFile(false, 30);
        let setupsObj = getSetups();

        if (!files[0]) { 
            alert('Reading from file went wrong');
            return; 
        }

        const importedSetups = await readSetupFile(files[0]);

        if (importedSetups.length === 0) { 
            alert('There is nothing to import');
            return;
        }

        const parsedSetups = JSON.parse(importedSetups) as Setups;

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

                <select ref={selectorRef} className={classes.loadSelector}>
                    {options}
                </select>

                <section className={classes.loadSectionButtons}>
                    <button onClick={deleteHandler}>Delete</button>
                    <button onClick={loadHanlder}>Load</button>
                </section>

            </div>

            <div className={classes.importExportSection}>
                <button onClick={importDataHandler}>Import</button>
                <button onClick={saveToFileHandler}>Export</button>
            </div>

        </div>
    );
};