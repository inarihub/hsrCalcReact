export type GroupMap<T> = Map<string, T>;
export type ArrayLikeGroupedMap<K extends string = string, T = any> = [K, [string, T][]][];

/**
 * Grouped map.
 * 
 * K is a group name. T is values of inner map.
 */
export class GroupedMap<K extends string = string, T = any> {
    private _map: Map<K, GroupMap<T>>;

    constructor();
    constructor(arr: ArrayLikeGroupedMap<K, T>);
    constructor(map: Map<K, GroupMap<T>>);
    constructor(groupedMap: GroupedMap<K, T>);
    constructor(param?: ArrayLikeGroupedMap<K, T> | Map<K, GroupMap<T>> | GroupedMap<K, T>) {
        if (param instanceof Array) {
            this._map = GroupedMap.fromArray<K, T>(param).data;
        } else if (param instanceof Map) {
            this._map = param;
        } else if (param instanceof GroupedMap) {
            this._map = param.data;
        } else {
            this._map = new Map<K, GroupMap<T>>();
        }
    }

    get data() {
        return this._map;
    }

    public setObject(obj: T, group: K, name: string) {

        if (!this._map.has(group)) {
                this._map.set(group, new Map<string, T>);
        }

        this._map.get(group)!.set(name, obj);
    }

    public setGroupMap(key: K, map: GroupMap<T>) {
        this._map.set(key, map);
    }

    public getElement(key: string, group: K) {
        return this._map.has(group) ? this._map.get(group)!.get(key) : undefined;
    }

    public getConvertedGroupedMap<M = any>(convertFunc: (obj: T) => M): GroupedMap<K, M> {
        let result = new GroupedMap<K, M>();
        this._map.forEach((groupMap, groupKey) => {
            groupMap.forEach((set, key) => {
                const modifiedObj = convertFunc(set);
                result.setObject(modifiedObj, groupKey, key);
            })
        })
        return result;
    }

    public static isTypes<K extends string = string, T = any>(map: GroupedMap<K, T> | unknown, groupKeysCheck: (groupKey: K | unknown) => groupKey is K, objTypeCheck: (obj: T | unknown) => obj is T): map is GroupedMap<K, T> {
        if (map instanceof GroupedMap) {
            map.data.forEach((group, key) => {

                let isValidObjType = true;

                group.forEach(obj => {
                    if (!objTypeCheck(obj)) {
                        isValidObjType = false;
                    }
                });

                if (!groupKeysCheck(key) || !isValidObjType) {
                    return false
                }
                
            });

            return true;
        }

        return false;
    }

    public unsetObject(group: K, name: string): boolean {

        if (this.isObjExists(group, name)) {

            this._map.get(group)!.delete(name);
            return true;
        }

        return false;
    }

    public isObjExists(group: K, name: string): boolean {
        return (this._map.has(group) && this._map.get(group)!.has(name));
    }

    public hasElement(key: string, group: K) {
        return this._map.has(group) && this._map.get(group)!.has(key);
    }

    public getWith(obj: T, name: string, group: K): GroupedMap<K, T> {
        this.setObject(obj, group, name);
        return new GroupedMap<K, T>(this._map);
    }

    public getWithout(name: string, group: K): GroupedMap<K, T> {
        this.unsetObject(group, name);
        return new GroupedMap<K, T>(this._map)
    }

    public getGroupClone(group: K): GroupMap<T> {
        return new Map(this._map.get(group));
    }

    public static fromArray<K extends string = string, T = any>(array: ArrayLikeGroupedMap<K, T>): GroupedMap<K, T> {

        function isValidArray(value: any[]) {
            return (Array.isArray(value) && value.length === 2);
        }

        let result = new Map<K, GroupMap<T>>();

        try {
            array?.forEach(group => {

                if (!isValidArray(group))
                    throw new Error("Array value is invalid. Source: 'Groupedmap.fromArray()" + group);
    
                let groupMap = new Map<string, T>(); // not GroupMap<T>
    
                group[1].forEach(element => {
    
                    if (!isValidArray(element))
                        throw new Error("Array value is invalid. Source: 'Groupedmap.fromArray(). Params: " + element);
    
                    groupMap.set(element[0], element[1]);
                })
                result.set(group[0], groupMap);
            });
        } catch(e) {
            console.log(e);
        } finally {
            return new GroupedMap<K, T>(result);
        }    
    }

    public static toArray<K extends string = string, T = any>(groupedMapObj: GroupedMap<K, T>): ArrayLikeGroupedMap<K, T> {

        let result: ArrayLikeGroupedMap<K, T> = [];

        groupedMapObj.data.forEach((groupMap, groupKey) => {
            let groupArray = Array.from(groupMap);
            result.push([groupKey, groupArray]);
        })

        return result;
    }

    public static stringify<K extends string = string, T = any>(groupedMapObj: GroupedMap<K, T>): string {
        const arrayLike = GroupedMap.toArray<K, T>(groupedMapObj);
        const stringLike = JSON.stringify(arrayLike);
        return stringLike;
    }

    public static parse<K extends string = string, T = any>(stringLike: string): GroupedMap<K, T> {
        if (!stringLike || stringLike.length === 0) return new GroupedMap<K, T>();
        const arrayLike = JSON.parse(stringLike);
        return Array.isArray(arrayLike) ? GroupedMap.fromArray<K, T>(arrayLike) : new GroupedMap<K, T>();
    }
}
