import { ArrayLikeGroupedMap } from "@/pages/shared/GroupedMap";
import { Character, CharacterObj } from "../../stats/char/Character";
import { Enemy, EnemyObj } from "../../stats/enemy/Enemy";
import { BonusSetGroupKeys, ContextBonusSet } from "@/pages/shared/BonusSetTypes";
import { BonusSetLib } from "../../HSRCalc";

export const lsSetupsKey = 'setups';

export type Setup = { char: CharacterObj, enemy: EnemyObj, bonuses: ArrayLikeGroupedMap<BonusSetGroupKeys, ContextBonusSet> };

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

export function saveToJSONFile(file: File) {

    const url = window.URL.createObjectURL(file);
    const aElement = document.createElement("a");

    aElement.setAttribute('style', "display: none");
    aElement.href = url;
    aElement.download = file.name;
    aElement.click();

    window.URL.revokeObjectURL(url);
    aElement.remove();
}

export function readJSONFileAsText(file: File): Promise<string> {
    
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

export function loadJSONFile(multiple = false, timeout = 10) {

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