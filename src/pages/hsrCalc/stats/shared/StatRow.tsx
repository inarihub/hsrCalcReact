import { Fragment, memo, useEffect, useRef } from 'react';
import classes from './StatRow.module.scss';
import { getTitle } from './CharStatTitles';
import { EntityProperty } from '../../../shared/Stat.types';

type valueType = 'absolute' | 'percent';

interface StatRowProps {
    value: number;
    statType: EntityProperty;
    type?: valueType;
    min?: number;
    max?: number;
    changeCallback?: (key: EntityProperty, value: number) => void;
}

let rendCount: number = 0;

export const StatRow = memo(function StatRow(props: StatRowProps) {

    const isPercents = props.type === 'percent';
    let value = isPercents ? props.value * 100 : props.value;
    const inputRef = useRef<HTMLInputElement>(null);

    // useEffect(() => {
    //     //const value = Number.isNaN(props.value) ? 0 : props.value;
    //     //inputRef.current.value = isPercents ? (value * 100).toFixed(1) : value.toString();
    // });

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === parseFloat(value.toFixed(2)).toString()) return;

        if (props.max && Number(event.currentTarget.value) > props.max) {
            event.currentTarget.value = props.max.toString();
        }
        if (event.currentTarget.value.length > 9) {
            event.currentTarget.value = event.currentTarget.value.substring(0, 9);
        }

        let result = Number(event.currentTarget.value) < 0 ? event.currentTarget.value.substring(1) : event.currentTarget.value;
        event.currentTarget.value = isPercents ? result : Number.parseInt(result).toString() ?? '0';

        props.changeCallback(props.statType, isPercents ? Number(event.currentTarget.value) / 100 : Number.parseInt(event.currentTarget.value));
    };

    const title = getTitle(props.statType);
    const percentMark = isPercents ? <text style={{ margin: 0 }}>%</text> : <Fragment />;
    const inputStyleModifier = isPercents ? undefined : { width: '8em' };

    return (
        <div className={classes.statRow}>
            <p>{title}</p>
            <div>
                <input ref={inputRef} className={classes.userInput} style={inputStyleModifier}
                    // onFocus={e => e.currentTarget.select()} onKeyDown={e => {
                    //     if (e.key === '.') {
                    //         e.preventDefault();
                    //     }
                    // }}
                    onInput={changeHandler}
                    type="number" value={parseFloat(value.toFixed(2))}></input>
                {percentMark}
            </div>
        </div>
    );
}, function (prev: StatRowProps, next: StatRowProps): boolean {
    if (prev.value !== next.value || prev.changeCallback !== next.changeCallback) {
        rendCount++;
        return false;
    }
    return true
});