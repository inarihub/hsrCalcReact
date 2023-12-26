import classes from './HSRCalc.module.scss';
import { Results } from './results/Results';

const HSRCalc = () => {
    return (
        <div className={classes.calcMainContainer}>
            <p>Hey</p>
            <Results />
        </div>
    )
}

export default HSRCalc;