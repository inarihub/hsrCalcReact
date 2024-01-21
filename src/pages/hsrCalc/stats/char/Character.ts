import { ElementDmgTypes } from "../../../shared/Stat.types";

export type SourceStatKey = 'hp' | 'def' | 'atk';
export type AttackType = 'any' | 'bonus' | 'dot' | 'ultimate' | 'skill' | 'basic' | 'talent';
export type CharacterStatKey = 'multiplier' | 'baseatk' | 'basehp' | 'basedef';
export type CharacterBuffsKey = 'crrate' | 'crdmg' | 'atkIncrease' | 'hpIncrease' | 'defIncrease' | 'flatatk' | 'flathp' | 'flatdef' | 'dmgIncrease' | 'elemIncrease' | 'defIgnore' | 'resPen';
export type CharacterStatInput = CharacterStatKey | CharacterBuffsKey | 'srcStat' | 'element';
export type ChatacterStatValue = number | SourceStatKey | ElementDmgTypes;

export interface CharacterStatsType {
    [key: string]: number;
    multiplier: number;
    baseatk: number;
    basehp: number;
    basedef: number;
};

export interface CharacterBuffsType {
    [key: string]: number;
    flatatk: number;
    flathp: number;
    flatdef: number;
    crrate: number;
    crdmg: number;
    breakeffect: number;
    atkIncrease: number;
    hpIncrease: number;
    defIncrease: number;
    elemIncrease: number;
    dmgIncrease: number;
    defIgnore: number;
    resPen: number;
};

export interface CharacterObj {
    element: ElementDmgTypes;
    srcStat: SourceStatKey;
    stats: CharacterStatsType;
    buffs: CharacterBuffsType;
}

export class Character {

    element: ElementDmgTypes;
    srcStat: SourceStatKey;
    stats: CharacterStatsType;
    buffs: CharacterBuffsType;

    constructor(element: ElementDmgTypes = 'fire', srcStat: SourceStatKey = 'atk',
        stats: CharacterStatsType = getDefaultStats(), buffs: CharacterBuffsType = getDefaultBuffs()) {
        this.element = element ?? 'fire';
        this.srcStat = srcStat ?? 'atk';

        for (const stat of Object.keys(getDefaultStats())) {
            if (stats[stat] === undefined) {
                stats[stat] = 0;
            }
        }

        this.stats = stats;
        
        for (const buff of Object.keys(getDefaultBuffs())) {
            if (buffs[buff] === undefined) {
                buffs[buff] = 0;
                console.log();
            }
        }
        
        this.buffs = buffs;
    };

    getCharObj(): CharacterObj {
        return { element: this.element, srcStat: this.srcStat, stats: this.stats, buffs: this.buffs };
    }

    getCharTotalAtk(): number {
        return Math.floor(this.stats[`base${this.srcStat}`] * (1 + this.buffs[`${this.srcStat}Increase`]) + this.buffs[`flat${this.srcStat}`]);
    }
};

export function getDefaultStats(): CharacterStatsType {
    return {
        multiplier: 0,
        baseatk: 0,
        basehp: 0,
        basedef: 0
    };
};

export function getDefaultBuffs(): CharacterBuffsType {
    return {
        crrate: 0.05,
        crdmg: 0.5,
        flatatk: 352,
        flathp: 0,
        flatdef: 0,
        breakeffect: 0,
        atkIncrease: 0,
        hpIncrease: 0,
        defIncrease: 0,
        elemIncrease: 0,
        dmgIncrease: 0,
        defIgnore: 0,
        resPen: 0
    };
};