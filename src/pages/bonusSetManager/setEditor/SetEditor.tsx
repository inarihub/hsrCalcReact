import { useEffect, useRef, useState } from 'react';
import classes from './SetEditor.module.scss';
import { SetItem } from './SetItem';
import { BonusSet, BonusSetKey, BonusSetOptions } from '../BonusSet';

interface SetEditorProps {
    set?: BonusSet;
    addBonusCallback?: (id: number, key: BonusSetKey, value: number, option: BonusSetOptions) => void;
}

function createSetItems(props?: SetEditorProps) {
    
    let counter = 0;

    if (props && props.set && Object.keys(props.set).length > 0) {

        let setItems: any[] = [];

        for (const item of props.set) {
            setItems.push(<SetItem key={`item-${counter}`} set={{...item}} changeCallback={props.addBonusCallback} />)
            counter++;
        }

        return setItems;
    }

    return [ <SetItem key={'item-0'} changeCallback={props.addBonusCallback} /> ];
}

export const SetEditor = (props: SetEditorProps) => {

    const items = createSetItems(props);
    const lastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const height = lastRef.current?.scrollHeight;
        lastRef.current?.scrollTo(0, height);
    }, [props])

    return (
        <div className={classes.editModule}>

            <p className={classes.header}>Edit set:</p>

            <div className={classes.effectsList} ref={lastRef}>
                {items}
                <button onClick={() => props.addBonusCallback(items.length, 'crrate', 0, 'none')}>New</button>
            </div>

        </div>
    );
};