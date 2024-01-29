import { useEffect, useState } from 'react';
import classes from './FilterStack.module.scss';
import { BonusSetTypes } from '@/pages/bonusSetManager/setSaver/SetSaver';

interface FilterStackProps {
    contents: BonusSetTypes[];
    updateCallback: (filters: string[]) => void;
}

export const FilterStack = (props: FilterStackProps) => {

    const [activeFilter, setActiveFilter] = useState<BonusSetTypes[]>([]);

    const toggleHandler = (e: React.MouseEvent<HTMLButtonElement>) => {

        const value = e.currentTarget.value as BonusSetTypes;
        
        if (!value) throw new Error('Invalid group type of bonus sets');

        if (activeFilter.includes(value)) {
            setActiveFilter((prev) => {
                return prev.filter(e => e !== value);
            })
        } else {
            setActiveFilter((prev) => {
                return [...prev, value];
            })
        }
    };

    const buttons = props.contents.map(content => {
        const style = activeFilter.includes(content) ? { border: '1px solid white' } : undefined;
        return (<button key={content} value={content} style={style} onClick={toggleHandler}>{content[0].toUpperCase() + content.slice(1)}</button>);
    });

    useEffect(() => {
        props.updateCallback(activeFilter);
    }, [activeFilter]);

    return (
        <div className={classes.filterStackContainer}>
            {buttons}
        </div>
    );
};