import { ElementDmgTypes } from "../../../shared/Stat.types";

export type EnemyStatKey = 'lvl' | 'res' | 'def';
export type EnemyDebuffKey = 'defReduction' | 'resReduction' | 'dmgTakenIncrease';

export interface EnemyStatsType {
    [key: string]: number;
    hp: number;
    def: number;
    res: number;
};

export interface EnemyDebuffsType {
    [key: string]: number;
    defReduction: number;
    resReduction: number;
    dmgTakenIncrease: number;
};

export interface EnemyObj {
    lvl: number;
    element: ElementDmgTypes;
    stats: EnemyStatsType;
    debuffs: EnemyDebuffsType;
    isBroken: boolean;
}

export class Enemy {
    private _lvl: number;
    private _element: ElementDmgTypes;
    private _stats: EnemyStatsType;
    private _debuffs: EnemyDebuffsType;
    private _isBroken: boolean;

    constructor(level: number = 95, element: ElementDmgTypes = 'fire',
    stats: EnemyStatsType = getDefaultEnemyStats(), debuffs: EnemyDebuffsType = getDefaultEnemyDebuffs(), isBroken: boolean = false) {
        this._lvl = level;
        this._element = element;
        this._stats = stats;
        this._debuffs = debuffs;
        this._isBroken = isBroken;
        this.updateDefByLvl();
    };

    updateDefByLvl() {
        this._stats.def = 200 + 10 * this._lvl;
    }

    get lvl() { return this._lvl; }
    get element() { return this._element; }
    get stats() { return this._stats; }
    get debuffs() { return this._debuffs; }
    get isBroken() { return this._isBroken; }

    set lvl(value: number) {
        this._lvl = value;
        this.updateDefByLvl();
    }
    set element(value: ElementDmgTypes) { this._element = value; }
    set stats(value: EnemyStatsType) { this._stats = value; }
    set debuffs(value: EnemyDebuffsType) { this._debuffs = value; }
    set isBroken(value: boolean) { this._isBroken = value; }

    getEnemyObj(): EnemyObj {
        return {lvl: this.lvl, element: this.element, stats: this.stats, debuffs: this._debuffs, isBroken: this._isBroken};
    }
};

export function getDefaultEnemyStats() {
    return {
        hp: 0,
        def: 0,
        res: 0
    };
};

export function getDefaultEnemyDebuffs() {
    return {
        defReduction: 0,
        resReduction: 0,
        dmgTakenIncrease: 0,
    };
};