import classes from './BonusSet.module.scss';

export const BonusSet = () => {
    return (
        <div className={classes.bonusSetContainer}>
            <div style={{backgroundColor: 'gray', width: '50px', height: '50px'}}></div>
            <p>Name</p>
        </div>
    );
};