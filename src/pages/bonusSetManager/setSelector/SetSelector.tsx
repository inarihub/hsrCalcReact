import classes from './SetSelector.module.scss';

export const SetSelector = () => {
    return (
        <div className={classes.setsListModule}>
            <p className={classes.header}>Your sets:</p>
            <select className={classes.setsList} name="fruit" size={10}>
                <option value="none">Nothing</option>
                <option value="guava">Guava</option>
                <option value="lychee">Lychee</option>
                <option value="papaya">Papaya</option>
                <option value="watermelon">Watermelon</option>
            </select>
        </div>
    );
};