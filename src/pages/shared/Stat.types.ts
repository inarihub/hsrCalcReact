import { Character, CharacterBuffsKey, CharacterStatKey } from "../hsrCalc/stats/char/Character"; 
import { Enemy, EnemyDebuffKey, EnemyStatKey } from "../hsrCalc/stats/enemy/Enemy";
import { elementDmgTypes } from "../hsrCalc/stats/shared/StatDictionaries";

export const elementTypeValues = ['fire' , 'ice' , 'lightning' , 'physical' , 'quantum' , 'imaginary' , 'wind'] as const;
export type ElementDmgTypes = typeof elementTypeValues[number];

export const elementTypeValuesWithAll = ['all', ...elementDmgTypes] as const;
export type ElementDmgTypesWithAll = typeof elementTypeValuesWithAll[number];

export const attackTypeValues = ['basic', 'skill', 'ultimate', 'talent', 'dot', 'follow-up'] as const;
export type AttackTypes = typeof attackTypeValues[number];

export const attackTypeValuesWithAny = ['any', ...attackTypeValues] as const;
export type AttackTypesWithAny = typeof attackTypeValuesWithAny[number];

export type EntityProperty =  CharacterStatKey | EnemyStatKey | CharacterBuffsKey | EnemyDebuffKey | 'lvl' | 'element' | 'srcStat';


export type ResultDmg = [number, number, number];

export interface CalcModel {
    character: Character;
    enemy: Enemy;
};