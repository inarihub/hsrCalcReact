import { Character } from '@/pages/hsrCalc/stats/char/Character';
import classes from './SetItem.module.scss';
import { Enemy } from '@/pages/hsrCalc/stats/enemy/Enemy';
import { useRef } from 'react';
import { BonusSetKey, BonusSetOptions } from '../BonusSet';
import { AttackTypesWithAny, ElementDmgTypes, attackTypeValuesWithAny, elementTypeValues, elementTypeValuesWithAll } from '@/pages/shared/Stat.types';

interface SetItemProps {
    set?: {id: number, key: BonusSetKey, value: number, option: BonusSetOptions};
    changeCallback: (id: number, key?: BonusSetKey, value?: number, option?: BonusSetOptions) => void
}

let incKey = 0;

let options: JSX.Element[] = [];
    addNamesOfObject(options, new Character().buffs);
    addNamesOfObject(options, new Enemy().debuffs);

function addNamesOfObject(array: JSX.Element[], o: object): void {
    const names = Object.getOwnPropertyNames(o);

    for (const name of names) {
        array.push(<option key={name} value={name}>{name}</option>);
    }
}

function buildAdditionalOptions(fromValues: AttackTypesWithAny[] | (ElementDmgTypes | 'all')[]) {
    const additionalOptions = [];
    for (const value of fromValues){
        additionalOptions.push(<option key={value} value={value}>{value}</option>);
    }
    return additionalOptions;
}

export const SetItem = (props: SetItemProps) => {

    const keySelectorRef = useRef<HTMLSelectElement>(null);
    const optionSelectorRef = useRef<HTMLSelectElement>(null);
    const inputValueRef = useRef<HTMLInputElement>(null);

    let additionalOptions: JSX.Element[] = [];

    if (props.set.key === 'dmgIncrease') {
        additionalOptions = buildAdditionalOptions([...attackTypeValuesWithAny]);
    } else if (props.set.key === 'elemIncrease' || props.set.key === 'resPen' || props.set.key === 'resReduction') {
        additionalOptions = buildAdditionalOptions([...elementTypeValuesWithAll]);
    }

    return (<div className={classes.effectBlock}>
        <select ref={keySelectorRef} key={`main${incKey++}`} value={props.set.key} className={classes.mainOption} onInput={(e) => {
            props.changeCallback(props.set.id, e.currentTarget.value as BonusSetKey, undefined, undefined);
            
        }}>
            {options}
        </select>
        <select ref={optionSelectorRef} value={props.set.option} key={`add${incKey++}`} className={classes.additionalOption}
        hidden={additionalOptions.length === 0} onInput={e => {
            props.changeCallback(props.set.id, undefined, undefined, e.currentTarget.value as BonusSetOptions);
        
        }}>
            {additionalOptions}
        </select>
        <input ref={inputValueRef} value={props.set.value} key={`value${incKey++}`} className={classes.valueInput} defaultValue={0}
        type={'number'} placeholder={'0'} onInput={e => {
            props.changeCallback(props.set.id, undefined, Number(e.currentTarget.value) ?? 0, undefined);
        }}></input>
    </div>);
};