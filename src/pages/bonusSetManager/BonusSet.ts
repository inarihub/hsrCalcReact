import { AttackTypesWithAny, ElementDmgTypes, ElementDmgTypesWithAll, attackTypeValuesWithAny, elementTypeValues, elementTypeValuesWithAll } from "../shared/Stat.types";
import { AttackType, CharacterBuffsKey } from "../hsrCalc/stats/char/Character";
import { EnemyDebuffKey } from "../hsrCalc/stats/enemy/Enemy";

export type BonusSetKey = CharacterBuffsKey | EnemyDebuffKey;
export type BonusSetOptions = AttackType | ElementDmgTypesWithAll | 'none';

export function getBonusSet(set: BonusSet, id: number, key?: BonusSetKey, value?: number, option?: BonusSetOptions): BonusSet {

    if ((!key && !value === undefined && option === undefined) || id === undefined || id === null) throw new Error('Something went wrong! origin: getBonusSet()');

    const searchElement = set.find(element => element.id === id);

    if (searchElement) {
        const index = set.indexOf(searchElement);
        const newBonusSet = [...set];
        const newKey = key === undefined ? searchElement.key : key;
        const newValue = value === undefined ? searchElement.value : value;
        const newOption = getOptionByKey(newKey, option);
        newBonusSet[index] = { id, key: newKey, value: newValue, option: newOption};
        return newBonusSet;
    }

    return [...set, { id, key, value, option }];
};

function getOptionByKey(key: BonusSetKey, option?: BonusSetOptions): BonusSetOptions {
    if (key === 'dmgIncrease') {
        return (option && hasDmgIncreaseOption(option)) ? option : attackTypeValuesWithAny[0];
    } else if (key === 'elemIncrease' || key === 'resPen' || key === 'resReduction') {
        return (option && hasElemIncreaseOption(option)) ? option : elementTypeValuesWithAll[0];
    } else {
        return 'none';
    }
}

function hasDmgIncreaseOption(x: unknown): x is AttackTypesWithAny {
    let result = false;
    for (const value of attackTypeValuesWithAny) {    
        result ||= x === value;
    }
    return result;
}

function hasElemIncreaseOption(x: unknown): x is ElementDmgTypes {
    let result = false;
    for (const value of elementTypeValues) {
        result ||= x === value;
    }
    return result;
}

export type BonusSet = { id: number, key: BonusSetKey, value: number, option: BonusSetOptions }[];