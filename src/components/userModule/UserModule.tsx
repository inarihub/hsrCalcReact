import classes from './UserModule.module.scss';
import ClockBG from '@/assets/img/clock.png';
import { Clock } from './clock/Clock';

export const UserModule = () => {
    return (
        <div className={classes.userModuleContainer}>
            <Clock />
            <p>Hello, guest</p>
        </div>
    );
}