import { ElementDmgType } from "../Stat.types";

export type SourceStatKey = 'hp' | 'def' | 'atk';
export type CharacterStatKey = 'multiplier' | 'baseatk' | 'basehp' | 'basedef';
export type CharacterBuffsKey = 'crrate' | 'crdmg' | 'atkIncrease' | 'hpIncrease' | 'defIncrease' | 'flatatk' | 'flathp' | 'flatdef' | 'dmgIncrease' | 'defIgnore' | 'resPen';
export type CharacterStatInput = CharacterStatKey | CharacterBuffsKey | 'srcStat' | 'element';
export type ChatacterStatValue = number | SourceStatKey | ElementDmgType;

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
    dmgIncrease: number;
    defIgnore: number;
    resPen: number;
};

export interface CharacterObj {
    element: ElementDmgType;
    srcStat: SourceStatKey;
    stats: CharacterStatsType;
    buffs: CharacterBuffsType;
}

export class Character {

    element: ElementDmgType;
    srcStat: SourceStatKey;
    stats: CharacterStatsType;
    buffs: CharacterBuffsType;

    constructor(element: ElementDmgType = 'fire', srcStat: SourceStatKey = 'atk',
        stats: CharacterStatsType = getDefaultStats(), buffs: CharacterBuffsType = getDefaultBuffs()) {
        this.element = element;
        this.srcStat = srcStat;
        this.stats = stats;
        this.buffs = buffs;
    };

    getCharObj(): CharacterObj {
        return {element: this.element, srcStat: this.srcStat, stats: this.stats, buffs: this.buffs};
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
        flatatk: 0,
        flathp: 0,
        flatdef: 0,
        breakeffect: 0,
        atkIncrease: 0,
        hpIncrease: 0,
        defIncrease: 0,
        dmgIncrease: 0,
        defIgnore: 0,
        resPen: 0
    };
};    