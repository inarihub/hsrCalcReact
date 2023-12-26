import { useEffect, useState } from 'react';
import classes from './Clock.module.scss';

function getRotateTransfrom(degree: number): React.CSSProperties {
    return {transform: `rotate(${degree}deg`};
}

export const Clock = () => {
    let [date, setDate] = useState(new Date());

    const timer = setInterval(() => {
        setDate(new Date());
    })
    
    useEffect(() => {
        return () => {clearInterval(timer)};
    });

    const secDegree = (date.getSeconds() * 6) % 360;
    const minDegree = (date.getMinutes() * 6) % 360;
    const hourDegree = (date.getHours() * 30 + minDegree / 15) % 360;

    return (
        <div className={classes.handsBox}>
            <div className={classes.hours} style={getRotateTransfrom(hourDegree)}></div>
            <div className={classes.minutes} style={getRotateTransfrom(minDegree)}></div>
            <div className={classes.seconds} style={getRotateTransfrom(secDegree)}></div>
        </div>
    );
}