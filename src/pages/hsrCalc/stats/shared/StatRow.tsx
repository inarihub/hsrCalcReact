import { Fragment, memo, useEffect, useRef } from 'react';
import classes from './StatRow.module.scss';
import { getTitle } from './CharStatTitles';
import { EntityProperty } from '../Stat.types';

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
    const value = isPercents ? props.value * 100 : props.value;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const value = Number.isNaN(props.value) ? 0 : props.value;
        //inputRef.current.value = isPercents ? (value * 100).toFixed(1) : value.toString();
    });

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (props.max && Number(event.currentTarget.value) > props.max) {
            event.currentTarget.value = props.max.toString();
        }
        if (event.currentTarget.value.length > 9) {
            event.currentTarget.value = event.currentTarget.value.substring(0, 9);
        }

        const result = Number(event.currentTarget.value) ?? 0
        props.changeCallback(props.statType, isPercents ? result / 100 : result);
    };

    const title = getTitle(props.statType);
    const percentMark = isPercents ? <text style={{ margin: 0 }}>%</text> : <Fragment />;
    const inputStyleModifier = isPercents ? undefined : { width: '8em' };

    return (
        <div className={classes.statRow}>
            <text>{title}</text>
            <div>
                <input ref={inputRef} className={classes.userInput} style={inputStyleModifier}
                    onFocus={e => e.currentTarget.select()} onChange={changeHandler}
                    type="number" value={parseFloat(value.toFixed(2))} placeholder="0"></input>
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