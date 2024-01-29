import { AttackTypesWithAny, DotElementDmgTypes, ElementDmgTypesWithAll, attackTypeValuesWithAny, dotElementTypeValues, dotElementTypeValuesWithAll, elementTypeValues, elementTypeValuesWithAll, isPercent } from "../shared/Stat.types";
import { CharacterBuffsKey } from "../hsrCalc/stats/char/Character";
import { EnemyDebuffKey } from "../hsrCalc/stats/enemy/Enemy";

export type BonusSet = { id: number, key: BonusSetKey, value: number, atkTypeOption: AttackTypesWithAny | 'none', elemTypeOption: ElementDmgTypesWithAll | 'none' }[];
export type BonusSetKey = CharacterBuffsKey | EnemyDebuffKey;
export type BonusSetOptions = AttackTypesWithAny | ElementDmgTypesWithAll | 'none';

export function getBonusSet(set: BonusSet, id: number, key?: BonusSetKey, value?: number, atkTypeOption?: AttackTypesWithAny | 'none', elemTypeOption?: ElementDmgTypesWithAll | 'none'): BonusSet {

    if ((!key && Number.isNaN(Number(value)) && !atkTypeOption && !elemTypeOption) || Number.isNaN(Number(id))) throw new Error('Something went wrong! origin: getBonusSet()');

    const searchedElement = set.find(element => element.id === id);

    if (searchedElement) {
        const index = set.indexOf(searchedElement);
        const newBonusSet = [...set];
        const newKey = key ?? searchedElement.key;
        let newValue = Number.isNaN(Number(value)) ? searchedElement.value : Number(value);
        
        if (key && isPercent(searchedElement.key) !== isPercent(key)) {
            newValue = 0;
        }

        // if (!isPercent(key) && newValue % 1 > 0) {
        //     newValue = parseInt(newValue.toFixed(0));
        // } else if (isPercent(key) && newValue % 0.0001 > 0) {
        //     newValue = parseFloat(newValue.toFixed(4));
        // }

        let newAtkOpt = atkTypeOption ?? searchedElement.atkTypeOption;
        let newElemOpt = elemTypeOption ?? searchedElement.elemTypeOption;

        if (key) {
            const optionsByKey = getValidOptionsByKey(key);
            newAtkOpt = optionsByKey.atkTypeOption;
            newElemOpt = optionsByKey.elemTypeOption;
        }

        if (atkTypeOption === 'dot' && !dotElementTypeValues.includes(elemTypeOption as DotElementDmgTypes)) {
            newElemOpt = dotElementTypeValuesWithAll[0];
        }

        newBonusSet[index] = { id, key: newKey, value: newValue, atkTypeOption: newAtkOpt, elemTypeOption: newElemOpt };
        return newBonusSet;

    } else {

        if (Number.isNaN(Number(id))) throw new Error('Invalid ID for new set');

        const newKey = key ?? 'crrate';
        const newValue = Number.isNaN(Number(value)) ? 0 : Number(value);
        const optionByKey = getValidOptionsByKey(key);
        const newAtkOpt = optionByKey.atkTypeOption;
        const newElemOpt = optionByKey.elemTypeOption;

        return [...set, { id, key: newKey, value: newValue, atkTypeOption: newAtkOpt, elemTypeOption: newElemOpt }];
    }
};

type ValidatedOptions = { atkTypeOption: AttackTypesWithAny | 'none', elemTypeOption: ElementDmgTypesWithAll | 'none' };

function getValidOptionsByKey(key: BonusSetKey)
    : ValidatedOptions {
        
    if (!key) throw new Error('Invalid key');

    const result: ValidatedOptions = { atkTypeOption: 'none', elemTypeOption: 'none' };

    if (key === 'dmgIncrease' || key === 'dmgTakenIncrease' || key === 'elemIncrease' || key === 'resPen' || key === 'resReduction') {
        result.atkTypeOption = attackTypeValuesWithAny[0];
        result.elemTypeOption = elementTypeValuesWithAll[0];
    }

    return result;
}

// function hasDmgIncreaseOption(x: unknown): x is AttackTypesWithAny {
//     let result = false;
//     for (const value of attackTypeValuesWithAny) {
//         result ||= x === value;
//     }
//     return result;
// }

// function hasElemIncreaseOption(x: unknown): x is ElementDmgTypes {
//     let result = false;
//     for (const value of elementTypeValues) {
//         result ||= x === value;
//     }
//     return result;
// }