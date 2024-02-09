import { Character, CharacterObj } from "../../stats/char/Character";
import { Enemy, EnemyObj } from "../../stats/enemy/Enemy";

export const lsSetupsKey = 'setups';

export type Setup = { char: CharacterObj, enemy: EnemyObj };

export interface SetupsList {
    [name: string]: Setup;
}

export function getSetups(): SetupsList {
    const setups = localStorage.getItem(lsSetupsKey);
    if (!setups) {
        console.log('There is no setups yet');
        return {};
    }

    const parsedSetups = JSON.parse(setups);

    if (!parsedSetups || Object.keys(parsedSetups).length === 0) {
        console.log('There is no setups yet');
        return {};
    }

    return parsedSetups;
}

export function parseToSetup(setup: Setup): { char: Character, enemy: Enemy } {
    
    const char = setup.char;
    const enemy = setup.enemy;

    const newCharInstance = new Character(char.atkType, char.element, char.srcStat, char.stats, char.buffs);
    const newEnemyInstance = new Enemy(enemy.lvl, enemy.element, enemy.stats, enemy.debuffs, enemy.isBroken);

    return { char: newCharInstance, enemy: newEnemyInstance };
}

export function saveSetupToFile(file: File) {

    const url = window.URL.createObjectURL(file);
    const aElement = document.createElement("a");

    aElement.setAttribute('style', "display: none");
    aElement.href = url;
    aElement.download = file.name;
    aElement.click();

    window.URL.revokeObjectURL(url);
    aElement.remove();
}

export function readSetupFile(file: File): Promise<string> {
    
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

export function importSetupFile(multiple = false, timeout = 10) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.multiple = multiple;
    input.click();

    let timerID: NodeJS.Timeout;

    return new Promise<FileList>((resolve, reject) => {

        input.addEventListener("change", () => resolve(input.files));
        input.addEventListener("cancel", () => resolve(null));

        timerID = setTimeout(() => { reject(); }, timeout * 1000);
    })
        .finally(() => {
            input.remove();
            clearTimeout(timerID);
        });
}