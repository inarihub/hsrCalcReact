import classes from './Clock.module.scss';
import ClockBG from '@/assets/img/clock.png';

export const Clock = () => {
    return (
        <div className={classes.clockContainer}><img alt='Clock' src={ClockBG}></img></div>
    );
}