import { Character, CharacterBuffsKey, CharacterStatKey } from "./char/Character"; 
import { Enemy, EnemyDebuffKey, EnemyStatKey } from "./enemy/Enemy";

export type EntityProperty =  CharacterStatKey | EnemyStatKey | CharacterBuffsKey | EnemyDebuffKey | 'lvl' | 'element' | 'srcStat';
export type ElementDmgType = 'fire' | 'ice' | 'lightning' | 'physical' | 'quantum' | 'imaginary' | 'wind';


export type ResultDmg = [number, number, number];

export interface CalcModel {
    character: Character;
    enemy: Enemy;
}

// export interface Character {
//     element: ElementDmgType;
//     srcStat: SourceStatKey;
//     stats: CharacterStatsType;
// };

// export interface CharacterStatsType {
//     [key: string]: number;
//     multiplier: number;
//     hp: number;
//     def: number;
//     atk: number;
//     crrate: number;
//     crdmg: number;
//     baseatk: number;
//     basehp: number;
//     basedef: number;
//     flatatk: number;
//     flathp: number;
//     flatdef: number;
//     breakeffect: number;
//     atkIncrease: number;
//     hpIncrease: number;
//     defIncrease: number;
//     dmgIncrease: number;
//     defIgnore: number;
//     resPen: number;
// };

// export interface EnemyStatsType {
//     [key: string]: number;
//     lvl: number;
//     res: number;
//     defReduction: number;
//     resReduction: number;
//     dmgTakenIncrease: number;
//     brokenMultiplier: number;
// };
