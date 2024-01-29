import { Character, CharacterBuffsKey, CharacterStatKey } from "../hsrCalc/stats/char/Character"; 
import { Enemy, EnemyDebuffKey, EnemyStatKey } from "../hsrCalc/stats/enemy/Enemy";
import { elementDmgTypes } from "../hsrCalc/stats/shared/StatDictionaries";

const allValue = 'all';
const anyValue = 'any';

export const dotElementTypeValues = ['fire' , 'lightning' , 'physical' , 'wind'] as const;
export type DotElementDmgTypes = typeof dotElementTypeValues[number];

export const dotElementTypeValuesWithAll = [allValue, ...dotElementTypeValues] as const;
export type DotElementDmgTypesWithAll = typeof dotElementTypeValuesWithAll[number];

export const elementTypeValues = [...dotElementTypeValues, 'ice' , 'quantum' , 'imaginary'] as const;
export type ElementDmgTypes = typeof elementTypeValues[number];

export const elementTypeValuesWithAll = [allValue, ...elementDmgTypes] as const;
export type ElementDmgTypesWithAll = typeof elementTypeValuesWithAll[number];

export const attackTypeValues = ['basic', 'skill', 'ultimate', 'talent', 'dot', 'follow-up'] as const;
export type AttackTypes = typeof attackTypeValues[number];

export const attackTypeValuesWithAny = [anyValue, ...attackTypeValues] as const;
export type AttackTypesWithAny = typeof attackTypeValuesWithAny[number];

export type EntityProperty =  CharacterStatKey | EnemyStatKey | CharacterBuffsKey | EnemyDebuffKey | 'lvl' | 'element' | 'srcStat';


export type ResultDmg = [number, number, number];

export interface CalcModel {
    character: Character;
    enemy: Enemy;
};

export type AllTypesStats = CharacterBuffsKey | CharacterStatKey | EnemyDebuffKey | EnemyStatKey;
type PercentValueStat =  | Omit<AllTypesStats, 'baseatk' | 'basehp' | 'basedef' | 'flatatk' | 'flathp' | 'flatdef' | 'lvl' | 'def'>;
type AbsoluteValueStat = 'baseatk' | 'basehp' | 'basedef' | 'flatatk' | 'flathp' | 'flatdef' | 'lvl' | 'def';

export function isPercent(statKey: AbsoluteValueStat | PercentValueStat): statKey is PercentValueStat {
    const absoluteValues: AbsoluteValueStat[] = ['baseatk', 'basehp', 'basedef', 'flatatk', 'flathp', 'flatdef', 'lvl', 'def'];
    return !absoluteValues.includes(statKey as AbsoluteValueStat);
}