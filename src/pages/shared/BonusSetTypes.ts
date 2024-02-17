import { CharacterBuffsKey } from "../hsrCalc/stats/char/Character";
import { EnemyDebuffKey } from "../hsrCalc/stats/enemy/Enemy";
import { AttackTypesWithAny, ElementDmgTypesWithAll } from "./Stat.types";

export interface BonusItem {
    readonly id: number,
    readonly key: BonusSetKey,
    value: number,
    atkTypeOption: AttackTypesWithAny | 'none',
    elemTypeOption: ElementDmgTypesWithAll | 'none'
};

export interface ContextBonusItem extends BonusItem {
    isActive: boolean;
    comparisonValue: [number, number, number],
}

export interface BonusSet {
    name: string;
    type: BonusSetGroupKeys;
    items: BonusItem[];
};

export interface ContextBonusSet extends Omit<BonusSet, 'items'> { 
    isActive: boolean;
    comparisonValue: [number, number, number]; 
    items: ContextBonusItem[];
}

export type BonusSetMap = Map<string, BonusSet>;

export interface ContextBonusSet extends BonusSet {
    
}

export type ContextBonusSetMap = Map<string, ContextBonusSet>;

export type BonusSetKey = CharacterBuffsKey | EnemyDebuffKey;
export type BonusSetOptions = AttackTypesWithAny | ElementDmgTypesWithAll | 'none';

export const bonusSetGroupKeysValues = ['weapon', 'teammate', 'relics', 'planars', 'other'] as const;
export type BonusSetGroupKeys = typeof bonusSetGroupKeysValues[number];

export function isBonusSetGroupKey(string: BonusSetGroupKeys | unknown): string is BonusSetGroupKeys {
    return bonusSetGroupKeysValues.includes(string as BonusSetGroupKeys);
}