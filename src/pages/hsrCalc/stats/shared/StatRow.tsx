import { Fragment, memo, useRef } from 'react';
import classes from './StatRow.module.scss';
import { getTitle } from './CharStatTitles';
import { EntityProperty, isPercent } from '@/pages/shared/Stat.types';
import { StatInputValidationService, StatKeyValidationService } from '@/pages/shared/StatInputServices';
import { PercentFragment } from './PercentFragment';

type valueType = 'absolute' | 'percent';

interface StatRowProps {
    value: number;
    statType: EntityProperty;
    type?: valueType;
    changeCallback?: (key: EntityProperty, value: number) => void;
}

export const StatRow = memo(function StatRow(props: StatRowProps) {

    const isPercents = isPercent(props.statType);
    let value = isPercents ? parseFloat((props.value * 100).toFixed(2)) : props.value;
    const inputRef = useRef<HTMLInputElement>(null);

    const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        
        if (!StatKeyValidationService.isValidKeyInput(e.key, isPercents)) {
            e.preventDefault();
        }
    };

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

        const validatedInputData = StatInputValidationService.getValidatedStatData(event.target.value, isPercents);

        event.target.value = validatedInputData.valueAsString;
        props.changeCallback(props.statType, validatedInputData.valueAsNumber);
    };

    const title = getTitle(props.statType);
    const percentMark = isPercents ? <PercentFragment /> : <Fragment />;
    const inputStyleModifier = isPercents ? undefined : { width: '8em' };

    return (
        <div className={classes.statRow}>
            <p>{title}</p>
            <div className={classes.inputSection}>
                
                <input ref={inputRef} className={classes.userInput} style={inputStyleModifier}
                    onKeyDown={keyDownHandler}
                    onChange={changeHandler}
                    type={'number'} value={value}></input>

                    {percentMark}
            </div>
        </div>
    );
}, (prev: StatRowProps, next: StatRowProps): boolean => {
    if (prev.value !== next.value || prev.changeCallback !== next.changeCallback) {
        return false;
    }
    return true;
});