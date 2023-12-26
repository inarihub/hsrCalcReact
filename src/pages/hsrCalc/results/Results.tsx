import classes from './Results.module.scss';

export const Results = () => {
    const attNames = ['Урон', 'Крит.', 'Средн.'];
    let result = [];

    for (const attName of attNames) {
        result.push((<div className={classes.resultRow}>
            <text className={classes.attText}>{attName}</text>
            <text className={classes.valueText}>0</text>
        </div>));
    }

    return (
        <div className={classes.resultsMain}>
            {result}
        </div>
    );
}