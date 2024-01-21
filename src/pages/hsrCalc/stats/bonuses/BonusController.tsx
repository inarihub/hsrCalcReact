import classes from './BonusController.module.scss';
import { BonusSet } from './BonusSet';

export const BonusController = () => {
    return (
        <div className={classes.bonusControllerContainer}>
            <div className={classes.headerSection}>
                <p className={classes.header}>Bonuses:</p>
            </div>
            <div className={classes.controlsPanel}>
                <button>Load</button>
                <button>Clear</button>
            </div>
            <div className={classes.bonusSetsSection}>
                <BonusSet />
                <BonusSet />
                <BonusSet />
                <BonusSet />
                <BonusSet />
            </div>
        </div>
    );
};