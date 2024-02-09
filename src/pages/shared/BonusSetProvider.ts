import { isBonusSet } from "./BonusSet";
import { BonusSet, BonusSetGroupKeys, bonusSetGroupKeysValues, isBonusSetGroupKey } from "./BonusSetTypes";

export type BonusGroupMap = Map<string, BonusSet>;
export type BonusGroupMapArrayLike = [string, BonusSet][];
export type BonusSetProviderArrayLike = [BonusSetGroupKeys, BonusGroupMapArrayLike][];

function getDefaultProviderMap(): Map<BonusSetGroupKeys, BonusGroupMap> {

    let defaultMap = new Map();

    for (const group of bonusSetGroupKeysValues) {
        defaultMap.set(group, new Map());
    }

    return defaultMap;
}

export class BonusSetProvider {

    private _bonusGroups: Map<BonusSetGroupKeys, BonusGroupMap>;

    constructor(provider?: BonusSetProvider) {
        this._bonusGroups = provider && BonusSetProvider.isBonusSetProvider(provider) && provider.getBonusSetMaps() ? provider._bonusGroups : getDefaultProviderMap();
    }

    get size(): number {
        return this._bonusGroups.size;
    }

    forEach(callback: (groupName: BonusSetGroupKeys, groupMap: BonusGroupMap) => void) {
        this._bonusGroups.forEach((groupMap, groupName) => {
            callback(groupName, groupMap);
        })
    }

    forEachBonusSets(callback: (group: BonusSetGroupKeys, key: string, element: BonusSet) => void) {
        this._bonusGroups.forEach((group, groupName) => {
            group.forEach((bonusSet, name) => {
                callback(groupName, name, bonusSet);
            })
        })
    }

    getWithBonusMap(map: Map<BonusSetGroupKeys, BonusGroupMap>) {
        this._bonusGroups = map;
        return this;
    }

    static stringify(provider: BonusSetProvider): string {
        const providerArrayLike = BonusSetProvider.toArray(provider) ?? [];
        return JSON.stringify(providerArrayLike);
    }

    static stringifyMap(map: BonusGroupMap): string {
        const mapArrayLike = BonusSetProvider.groupMapToArray(map) ?? [];
        return JSON.stringify(mapArrayLike);
    }

    static parse(str: string): BonusSetProvider {
        if (!str && str.length === 0) {
            return new BonusSetProvider();
        }
        const providerArrayLike: BonusSetProviderArrayLike = JSON.parse(str);
        return BonusSetProvider.fromArray(providerArrayLike);
    }

    static parseMap(str: string): BonusGroupMap {
        if (!str || str.length === 0) {
            return new Map<string, BonusSet>();
        }
        const mapArrayLike: BonusGroupMapArrayLike = JSON.parse(str);
        return BonusSetProvider.groupMapFromArray(mapArrayLike);
    }

    static groupMapFromArray(array: BonusGroupMapArrayLike): BonusGroupMap {

        let groupMap = new Map<string, BonusSet>();

        if (!Array.isArray(array)) return groupMap;

        for (const element of array) {

            if (Array.isArray(element) && element.length === 2 && typeof element[0] === 'string' && isBonusSet(element[1])) {

                groupMap.set(element[0], element[1]);

            } else {
                console.log(`Invalid data to convert: ${element}`)
            }
        }

        return groupMap;
    }

    static groupMapToArray(map: BonusGroupMap): BonusGroupMapArrayLike {
        return map ? Array.from(map) : [];
    }

    static fromArray(array: BonusSetProviderArrayLike): BonusSetProvider {

        let map = new Map<BonusSetGroupKeys, BonusGroupMap>();

        if (Array.isArray(array)) {

            for (const group of array) {

                if (Array.isArray(group) && group.length === 2) {

                    const groupMap = BonusSetProvider.groupMapFromArray(group[1]);

                    if (isBonusSetGroupKey(group[0])) {

                        map.set(group[0], groupMap)

                    } else {
                        console.log(`Invalid data to convert: ${group[0]}`)
                    }
                } else {
                    console.log(`Invalid data: ${group}`)
                }
            }
        }
        return new BonusSetProvider().getWithBonusMap(map);
    }

    static toArray(provider: BonusSetProvider): BonusSetProviderArrayLike {
        return provider ? Array.from(provider.getBonusSetMaps()).map(([key, map]) => ([key, Array.from(map)])) : [];
    }

    static isBonusSetProvider(provider: BonusSetProvider | unknown): provider is BonusSetProvider {
        return provider instanceof Object && Object.getOwnPropertyNames(provider).every(value => Object.getOwnPropertyNames(new BonusSetProvider()).includes(value));
    }

    public getBonusSetMaps(): Map<BonusSetGroupKeys, BonusGroupMap> {
        return this._bonusGroups;
    }

    public getWith(name: string, group: BonusSetGroupKeys, bonusSet: BonusSet): BonusSetProvider {
        this.addBonusSet(bonusSet, group, name);
        return new BonusSetProvider(this);
    }

    public getWithout(name: string, group: BonusSetGroupKeys): BonusSetProvider {
        this.deleteBonusSet(group, name);
        return new BonusSetProvider(this);
    }

    public getKeyMaps(): Map<string, string[]> {

        let list: Map<string, string[]> = new Map;

        this._bonusGroups.forEach((element, key) => {
            list.set(key, Array.from(element).map(e => e[0]));
        })

        return list;
    }

    public hasBonusSet(groupName: BonusSetGroupKeys, name: string): boolean {
        return this.bonusExists(name, groupName);
    }

    public addBonusSet(bonusSet: BonusSet, group: BonusSetGroupKeys, name: string): boolean {

        if (this.bonusExists(name, group)) {
            return false;
        }

        const map = this._bonusGroups;

        if (!this.groupExists(group)) {
            map.set(group, new Map<string, BonusSet>() as BonusGroupMap);
        }

        let newGroups = map.get(group);
        newGroups.set(name, bonusSet);
        return true;
    }

    public addBonusSetGroup(group: BonusSetGroupKeys, bonusMap: BonusGroupMap): boolean {
        if (!bonusMap || bonusMap.size === 0) return false;
        this._bonusGroups.set(group, bonusMap);
        return true;
    }

    public deleteBonusSet(group: BonusSetGroupKeys, name: string): boolean {

        if (!this.bonusExists(name, group)) return false;

        const map = this._bonusGroups;
        map.get(group).delete(name);
        return true;
    }

    public getBonusSet(name: string, group: BonusSetGroupKeys) {

        if (!this.bonusExists(name, group)) return undefined;

        const map = this._bonusGroups;
        return map.get(group).get(name);
    }

    private bonusExists(name: string, group: BonusSetGroupKeys): boolean {
        return this.groupExists(group) && this._bonusGroups.get(group).has(name);
    }

    private groupExists(group: BonusSetGroupKeys) {
        return this._bonusGroups.has(group);
    }
}