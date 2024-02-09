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

export type BonusSet = BonusItem[];

export type BonusSetKey = CharacterBuffsKey | EnemyDebuffKey;
export type BonusSetOptions = AttackTypesWithAny | ElementDmgTypesWithAll | 'none';


export interface BonusContextData {
    isActive: boolean,
    comparisonValue: number,
}

export const bonusSetGroupKeysValues: string[] = ['weapon', 'teammate', 'relics', 'planars', 'other'] as const;
export type BonusSetGroupKeys = typeof bonusSetGroupKeysValues[number];

export function isBonusSetGroupKey(string: BonusSetGroupKeys | unknown): string is BonusSetGroupKeys {
    return bonusSetGroupKeysValues.includes(string?.toString());
}