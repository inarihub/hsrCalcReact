import { useEffect, useRef } from 'react';
import classes from './SetEditor.module.scss';
import { SetItem } from './SetItem';
import { AttackTypesWithAny, ElementDmgTypesWithAll } from '@/pages/shared/Stat.types';
import { getDefaultSetItem } from '../BonusSetManager';
import { BonusItem, BonusSetKey } from '@/pages/shared/BonusSetTypes';

interface SetEditorProps {
    set: BonusItem[];
    addBonusCallback?: (id: number, key: BonusSetKey, value: number, atkTypeOption: AttackTypesWithAny | 'none', elemTypeOption: ElementDmgTypesWithAll | 'none') => void;
    deleteBonusCallback?: (id: number) => void;
}

function createSetItems(props?: SetEditorProps) {

    let counter = 0;

    if (props && props.set && Object.keys(props.set).length > 0) {

        let setItems: any[] = [];

        for (const item of props.set) {
            setItems.push(<SetItem key={`item-${counter}`} set={{ ...item }} changeCallback={props.addBonusCallback} clearCallback={props.deleteBonusCallback} />)
            counter++;
        }

        return setItems;
    }

    return [];
}

export const SetEditor = (props: SetEditorProps) => {

    const items = createSetItems(props);
    const lastRef = useRef<HTMLDivElement>(null);
    const defaultItem = getDefaultSetItem();

    useEffect(() => {
        const height = lastRef.current?.scrollHeight;
        lastRef.current?.scrollTo(0, height);
    }, [props])

    return (
        <div className={classes.editModule}>

            <p className={classes.header}>Edit set:</p>

            <div className={classes.effectsList} ref={lastRef}>
                {items}
                <button onClick={() =>
                    props.addBonusCallback(props.set.length, defaultItem.key, defaultItem.value,
                        defaultItem.atkTypeOption, defaultItem.elemTypeOption)}>Add</button>
            </div>

        </div>
    );
};