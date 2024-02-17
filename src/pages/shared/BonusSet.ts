import { AttackTypesWithAny, DotElementDmgTypes, ElementDmgTypesWithAll, attackTypeValuesWithAny, dotElementTypeValues, dotElementTypeValuesWithAll, elementTypeValuesWithAll, isPercent } from "./Stat.types";
import { BonusItem, BonusSet, BonusSetKey, ContextBonusItem, ContextBonusSet } from "./BonusSetTypes";

export function getBonusItems(set: BonusItem[], id: number, key?: BonusSetKey, value?: number, atkTypeOption?: AttackTypesWithAny | 'none', elemTypeOption?: ElementDmgTypesWithAll | 'none'): BonusItem[] {

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

        const newItems = [...set, { id, key: newKey, value: newValue, atkTypeOption: newAtkOpt, elemTypeOption: newElemOpt }];

        return newItems;
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

export function isBonusSet(bonusSet: BonusSet | unknown): bonusSet is BonusSet {
    return (bonusSet instanceof Object && bonusSet.hasOwnProperty('name') &&
    bonusSet.hasOwnProperty('type') && bonusSet.hasOwnProperty('items'));
}

export function isContextBonusSet(cBonusSet: ContextBonusSet | unknown): cBonusSet is ContextBonusSet {
    return (cBonusSet instanceof Object && cBonusSet.hasOwnProperty('isActive') &&
    cBonusSet.hasOwnProperty('comparisonValue') && isBonusSet(cBonusSet));
}

// export function isBonusItem(bonusItem: BonusItem | unknown): bonusItem is BonusItem {
//     return (bonusItem instanceof Object && bonusItem.hasOwnProperty('id') && bonusItem.hasOwnProperty('key') &&
//     bonusItem.hasOwnProperty('atkTypeOption') && bonusItem.hasOwnProperty('elemTypeOption') && bonusItem.hasOwnProperty('value') &&
//     typeof (bonusItem as BonusItem).id === 'number');
// }

export function setBonusSetContext(obj: BonusSet, isActive: boolean, comparisonValue: [number, number, number]) {
    return {...obj, isActive, comparisonValue, items: obj.items.map(e => {
        const newElement = {...e, isActive, comparisonValue} as ContextBonusItem;
        return newElement;
    })} as ContextBonusSet;
}