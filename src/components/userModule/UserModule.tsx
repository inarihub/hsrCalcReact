import classes from './UserModule.module.scss';
import { Clock } from './clock/Clock';
import { useEffect, useState } from 'react';

export const UserModule = () => {
    const [time, setTime] = useState(new Date());
    let timer: NodeJS.Timeout;

    useEffect(() => {
        timer = setInterval(() => {
            setTime(new Date())
        }, 1000);

        return function cleanup() {
            clearInterval(timer);
        }
    })

    return (
        <div className={classes.userModuleContainer}>
            <Clock />
            <div className={classes.textInfo}>
                <p>Hello, guest</p>
                <p style={{ fontSize: '28px' }}>{time.toLocaleTimeString()}</p>
            </div>
        </div>
    );
}