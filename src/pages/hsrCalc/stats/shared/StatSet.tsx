import { SourceStatKey } from '../char/Character';
import { StatRow } from './StatRow';
import classes from './StatSet.module.scss';

export const StatSet = (props: {set?: any}) => {
    let title: SourceStatKey = 'atk';
    if (props.set !== null) {
        title = props.set.title;
    }
    

    return (
        <div className={classes.statSet}>
            
        </div>
    )
};