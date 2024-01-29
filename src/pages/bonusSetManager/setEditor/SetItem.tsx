import { characterBaseStatValues, characterBuffValues } from '@/pages/hsrCalc/stats/char/Character';
import classes from './SetItem.module.scss';
import { enemyDebuffValues } from '@/pages/hsrCalc/stats/enemy/Enemy';
import { BonusSetKey } from '../BonusSet';
import { AttackTypesWithAny, ElementDmgTypesWithAll, attackTypeValuesWithAny, dotElementTypeValues, dotElementTypeValuesWithAll, elementTypeValuesWithAll, isPercent } from '@/pages/shared/Stat.types';
import { StatInputValidationService, StatKeyValidationService } from '@/pages/shared/StatInputServices';
import { PercentFragment } from '@/pages/hsrCalc/stats/shared/PercentFragment';
import { Fragment } from 'react';
import local from '@/pages/shared/StatDictionary';

interface SetItemProps {
    set?: { id: number, key: BonusSetKey, value: number, atkTypeOption: AttackTypesWithAny | 'none', elemTypeOption: ElementDmgTypesWithAll | 'none' };
    changeCallback?: (id: number, key: BonusSetKey, value: number, atkTypeOption: AttackTypesWithAny | 'none', elemTypeOption: ElementDmgTypesWithAll | 'none') => void;
    clearCallback?: (id: number) => void;
}

let options: JSX.Element[] = [];
addNamesOfObject(options, [...characterBuffValues]);
addNamesOfObject(options, [...enemyDebuffValues]);
addNamesOfObject(options, [...characterBaseStatValues])

function addNamesOfObject(array: JSX.Element[], o: any[]): void {
    for (const name of o) {
        array.push(<option key={name} value={name}>{local['en'][name]}</option>);
    }
}

function buildAdditionalOptions(fromValues: AttackTypesWithAny[] | ElementDmgTypesWithAll[]): JSX.Element[] {

    const additionalOptions: JSX.Element[] = [];

    if (fromValues) {
        for (const value of fromValues) {
            additionalOptions.push(<option key={value} value={value}>{local['en'][value]}</option>);
        }
    }

    return additionalOptions;
}

export const SetItem = (props: SetItemProps) => {

    const isPercents = isPercent(props.set.key);
    let value = isPercents ? parseFloat((props.set.value * 100).toFixed(2)) : props.set.value;

    let keyNumber = 0;

    let additionalAtkOptions: JSX.Element[] = [];
    let additionalElemOptions: JSX.Element[] = [];

    const hasOptions = props.set.key === 'dmgIncrease' || props.set.key === 'dmgTakenIncrease' || props.set.key === 'elemIncrease' || props.set.key === 'resPen' || props.set.key === 'resReduction';

    if (hasOptions) {
        additionalAtkOptions = buildAdditionalOptions([...attackTypeValuesWithAny]);
        additionalElemOptions = buildAdditionalOptions(props.set.atkTypeOption === 'dot' ? [...dotElementTypeValuesWithAll] : [...elementTypeValuesWithAll]);
    }

    function validationInputStat(value: string, isPercents: boolean): { valueAsString: string; valueAsNumber: number; } {
        return StatInputValidationService.getValidatedStatData(value, isPercents);
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!StatKeyValidationService.isValidKeyInput(event.key, isPercents)) {
            event.preventDefault();
        }
    }

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const validatedInputData = validationInputStat(event.target.value, isPercents);     
        event.target.value = validatedInputData.valueAsString; //need this to avoid missspell
        props.changeCallback(props.set.id, undefined, Number(validatedInputData.valueAsNumber) ?? 0, undefined, undefined);
    }

    const percentMark = isPercents ? <PercentFragment /> : <Fragment />;
    const inputStyleModifier = isPercents ? undefined : { width: '8.5em' };

    return (<div className={classes.effectBlock}>

        <div className={classes.row}>

            <section className={classes.column}>
                <select key={`main${keyNumber++}`} value={props.set.key} className={classes.mainOption} onInput={(e) => {
                    e.persist();
                    props.changeCallback(props.set.id, e.currentTarget.value as BonusSetKey, undefined, undefined, undefined);
                }}>
                    {options}
                </select>
            </section>

            <section className={classes.column}>
                <input style={inputStyleModifier} value={value} key={`value${keyNumber++}`} className={classes.valueInput} type={'number'}
                placeholder={'0'} onKeyDown={keyDownHandler} onChange={inputChangeHandler}></input>
                {percentMark}
            </section>
           
        </div>

        <button className={classes.clearBtn} onClick={() => props.clearCallback(props.set.id)}>x</button>

        {hasOptions ? (<div className={classes.row}>

            <section className={classes.column}>
                <select value={props.set.atkTypeOption} key={`add${keyNumber++}`} className={classes.additionalOption}
                    disabled={additionalAtkOptions.length === 0} onInput={e => {
                        e.persist();
                        props.changeCallback(props.set.id, undefined, undefined, e.currentTarget.value as (AttackTypesWithAny | 'none'), undefined);
                    }}>
                    {additionalAtkOptions}
                </select>
            </section>

            <section className={classes.column}>
                {/* <p className={classes.selectLabel}>Element: </p> */}
                <select value={props.set.elemTypeOption} key={`add${keyNumber++}`} className={classes.additionalOption}
                    disabled={additionalElemOptions.length === 0} onInput={e => {
                        e.persist();
                        props.changeCallback(props.set.id, undefined, undefined, undefined, e.currentTarget.value as (ElementDmgTypesWithAll | 'none'));
                    }}>
                    {additionalElemOptions}
                </select>
            </section>

        </div>) : <Fragment />}

    </div>);
};